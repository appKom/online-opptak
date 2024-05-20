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
} from "../../../../lib/types/types";

type Event = {
  id: string;
  start: string; // ISO string in local time
  applicant: applicantTypeForCommittees | null;
};

type CalendarProps = {
  events: Event[];
  moveEvent: (id: string, start: string) => void;
  addEvent: (start: string) => void;
  deleteEvent: (id: string) => void;
  timePeriod: number;
  interviewPeriod: { start: Date; end: Date };
};

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
              start: new Date(period.interviewPeriod.start),
              end: new Date(period.interviewPeriod.end),
            }}
          />
        </DndProvider>
      )}
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({
  events,
  moveEvent,
  addEvent,
  deleteEvent,
  timePeriod,
  interviewPeriod,
}) => {
  const generateTimeSlots = (
    startHour: number,
    endHour: number,
    period: number
  ) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += period) {
        let formattedMinutes = minutes.toString().padStart(2, "0");
        if (formattedMinutes === "030") {
          formattedMinutes = "30";
        }
        let formattedHour = hour.toString().padStart(2, "0");
        const time = `${formattedHour}:${formattedMinutes}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const hours = generateTimeSlots(8, 17, timePeriod);

  // Exclude weekends
  const generateDates = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const interviewStartDate = new Date(interviewPeriod.start);
  const interviewEndDate = new Date(interviewPeriod.end);
  const dates = generateDates(interviewStartDate, interviewEndDate);

  return (
    <div className="grid grid-cols-6 gap-4 border-solid border-black rounded-lg shadow border w-full">
      <div>
        {hours.map((hour) => (
          <div key={hour} className="h-12 flex items-center justify-center">
            {hour}
          </div>
        ))}
      </div>
      {dates.map((date) => (
        <div key={date.toDateString()} className="flex flex-col">
          <h3 className="text-center">{date.toDateString()}</h3>
          <div className="flex flex-col divide-y divide-gray-200">
            {hours.map((hour) => (
              <HourRow
                key={`${date.toDateString()}-${hour}`}
                hour={hour}
                date={date}
                events={events}
                moveEvent={moveEvent}
                addEvent={addEvent}
                deleteEvent={deleteEvent}
                timePeriod={timePeriod}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

type HourRowProps = {
  hour: string;
  date: Date;
  events: Event[];
  moveEvent: (id: string, start: string) => void;
  addEvent: (start: string) => void;
  deleteEvent: (id: string) => void;
  timePeriod: number;
};

const HourRow: React.FC<HourRowProps> = ({
  hour,
  date,
  events,
  moveEvent,
  addEvent,
  deleteEvent,
  timePeriod,
}) => {
  const [, drop] = useDrop({
    accept: "event",
    drop: (item: { id: string }) => {
      const start = new Date(date);
      const [hours, minutes] = hour.split(":").map(Number);
      start.setHours(hours, minutes, 0, 0);
      moveEvent(item.id, start.toISOString());
    },
  });

  return (
    <div
      ref={drop}
      className="flex items-center justify-between h-12 p-2 cursor-pointer"
      onClick={() => {
        const start = new Date(date);
        const [hours, minutes] = hour.split(":").map(Number);
        start.setHours(hours, minutes, 0, 0);
        addEvent(start.toISOString());
      }}
    >
      <div className="flex-1 flex items-center space-x-2">
        {events
          .filter(
            (event) =>
              new Date(event.start).getTime() ===
              new Date(date).setHours(
                parseInt(hour.split(":")[0]),
                parseInt(hour.split(":")[1]),
                0,
                0
              )
          )
          .map((event) => (
            <EventBlock
              key={event.id}
              event={event}
              deleteEvent={deleteEvent}
              timePeriod={timePeriod}
            />
          ))}
      </div>
    </div>
  );
};

type EventBlockProps = {
  event: Event;
  deleteEvent: (id: string) => void;
  timePeriod: number;
};

const EventBlock: React.FC<EventBlockProps> = ({
  event,
  deleteEvent,
  timePeriod,
}) => {
  const [, drag] = useDrag({
    type: "event",
    item: { id: event.id },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent(event.id);
  };

  const isAvailable = (applicant: applicantTypeForCommittees, event: Event) => {
    const eventStart = new Date(event.start).toISOString();
    const eventEnd = new Date(
      new Date(event.start).getTime() + timePeriod * 60000
    ).toISOString();

    return applicant.selectedTimes.some(
      (time) => time.start <= eventStart && time.end >= eventEnd
    );
  };

  const applicant = event.applicant;
  const available = applicant ? isAvailable(applicant, event) : false;
  const backgroundColor = available ? "bg-blue-500" : "bg-red-500";

  return (
    <div
      ref={drag}
      className={`${backgroundColor} text-white p-2 rounded flex items-center`}
    >
      <span>
        {applicant
          ? applicant.name + " " + event.start.slice(11, 16)
          : "No Applicant"}
      </span>
      <button onClick={handleDelete} className="ml-2 text-red-500">
        ✕
      </button>
    </div>
  );
};

export default CommitteeInterviewPage;
