import type { NextPage } from "next";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import {
  applicantTypeForCommittees,
  commiteeType,
  periodType,
  Event,
} from "../../../../lib/types/types";
import { Calendar } from "../../../../components/committee/interview/calendar";

const CommitteeInterviewPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [period, setPeriod] = useState<periodType | null>(null);
  const [timePeriod, setTimePeriod] = useState(15);
  const periodId = router.query["period-id"] as string;
  const [applicants, setApplicants] = useState<applicantTypeForCommittees[]>(
    []
  );
  const [assignedApplicants, setAssignedApplicants] = useState<Set<string>>(
    new Set()
  );
  const [filteredApplicants, setFilteredApplicants] = useState<
    applicantTypeForCommittees[]
  >([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [committee, setCommittee] = useState<commiteeType | null>(null);
  const [maxEvents, setMaxEvents] = useState<number>(0);

  useEffect(() => {
    if (!session || !periodId) return;

    const fetchPeriod = async () => {
      try {
        const res = await fetch(`/api/periods/${periodId}`);
        const data = await res.json();
        setPeriod(data.period);
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      }
    };

    const fetchCommittee = async () => {
      try {
        const res = await fetch(`/api/committees`);
        const data = await res.json();

        const filteredCommittees = data.committees.filter(
          (committee: { periodId: any }) => committee.periodId === periodId
        );
        setCommittee(filteredCommittees[0]);
        setTimePeriod(filteredCommittees[0].timeslot);
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      }
    };

    const fetchApplicants = async () => {
      try {
        const response = await fetch(`/api/committees/${periodId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }

        const data = await response.json();
        console.log(data);

        setMaxEvents(data.applicants.length);
        setApplicants(data.applicants);
        setFilteredApplicants(data.applicants);

        const uniqueYears: string[] = Array.from(
          new Set(
            data.applicants.map((applicant: applicantTypeForCommittees) =>
              applicant.grade.toString()
            )
          )
        );
        setYears(uniqueYears);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittee();
    fetchApplicants();
    fetchPeriod();
  }, [session, periodId]);

  const moveEvent = useCallback((id: string, start: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === id ? { ...event, start } : event))
    );
  }, []);

  const addEvent = useCallback(
    (start: string) => {
      if (
        events.length >= maxEvents ||
        assignedApplicants.size >= applicants.length
      )
        return;

      const availableApplicants = applicants.filter(
        (applicant) => !assignedApplicants.has(applicant._id.toString())
      );

      if (availableApplicants.length === 0) return;

      const applicant = availableApplicants[0];
      setAssignedApplicants((prev) =>
        new Set(prev).add(applicant._id.toString())
      );

      setEvents((prevEvents) => [
        ...prevEvents,
        { id: uuidv4(), start, applicant },
      ]);
    },
    [events, maxEvents, applicants, assignedApplicants]
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prevEvents) => {
      const eventToDelete = prevEvents.find((event) => event.id === id);
      if (eventToDelete?.applicant) {
        setAssignedApplicants((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventToDelete.applicant!._id.toString());
          return newSet;
        });
      }
      return prevEvents.filter((event) => event.id !== id);
    });
  }, []);

  if (!session || !session.user?.isCommitee) {
    return <p>Ingen tilgang!</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold p-10">Planlegg intervju</h1>
      <div className="flex justify-center gap-10 text-gray-700 py-10">
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 bg-green-500 border border-gray-300 rounded-sm"></div>
          Kandidaten er ledig
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 bg-red-500 border border-gray-300 rounded-sm"></div>
          <div>
            Kandidaten er <span className="font-bold">ikke</span> ledig
          </div>
        </div>
      </div>
      <div className="mb-4 flex flex-row gap-20">
        <p>Intervjulengde: {timePeriod}min</p>
        <div className="items-end justify-end">
          <p className="">
            {events.length}/{applicants.length}
          </p>
        </div>
      </div>
      {period && (
        <DndProvider backend={HTML5Backend}>
          <Calendar
            events={events}
            moveEvent={moveEvent}
            addEvent={(start: string) => addEvent(start)}
            deleteEvent={deleteEvent}
            timePeriod={timePeriod}
            interviewPeriod={{
              start: period.interviewPeriod.start,
              end: period.interviewPeriod.end,
            }}
          />
        </DndProvider>
      )}
    </div>
  );
};

export default CommitteeInterviewPage;
