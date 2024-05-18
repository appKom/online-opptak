import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "../../../404";
import {
  applicantTypeForCommittees,
  commiteeType,
  periodType,
} from "../../../../lib/types/types";
import { useRouter } from "next/router";

const CommitteeApplicantOverView: NextPage = () => {
  const { data: session } = useSession();
  const [applicants, setApplicants] = useState<applicantTypeForCommittees[]>(
    []
  );
  const [filteredApplicants, setFilteredApplicants] = useState<
    applicantTypeForCommittees[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const periodId = router.query["period-id"] as string | undefined;
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [period, setPeriod] = useState<periodType | null>(null);
  const [committeeTimes, setCommitteeTimes] = useState<any[]>([]);
  const [exists, setExists] = useState<boolean>(false);
  const [interviewSchedule, setInterviewSchedule] = useState<{
    [key: string]: string;
  }>({});

  // Fetch period data
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

    const fetchCommitteeTimes = async () => {
      try {
        const res = await fetch(`/api/committees`);
        const data = await res.json();
        const filteredCommitteeTimes = data.committees.find(
          (committee: commiteeType) => committee.periodId === periodId
        );
        setCommitteeTimes(filteredCommitteeTimes?.availabletimes || []);
        setExists(!!filteredCommitteeTimes);
      } catch (error) {
        console.error("Failed to fetch committee times:", error);
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
        setApplicants(data.applicants);
        setFilteredApplicants(data.applicants);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
    fetchPeriod();
    fetchCommitteeTimes();
  }, [session, periodId]);

  // Filter committees based on the session user
  useEffect(() => {
    if (period && session) {
      const userCommittees = session.user!.committees;
      const periodCommittees = period.committees;
      const filteredCommittees = periodCommittees.filter(
        (committee) => userCommittees?.includes(committee.toLowerCase())
      );
      setCommittees(filteredCommittees);
    }
  }, [period, session]);

  const scheduleInterview = (applicantId: string, time: string) => {
    setInterviewSchedule((prev) => ({
      ...prev,
      [applicantId]: time,
    }));
  };

  const findMatchingTimes = (
    applicantTimes: any[],
    committeeTimes: any[],
    duration: number
  ) => {
    const matches: any[] = [];

    // Convert duration from minutes to milliseconds
    const durationMs = duration * 60 * 1000;

    // Iterate through each applicant time slot
    for (const applicantTime of applicantTimes) {
      const applicantStart = new Date(applicantTime.start).getTime();
      const applicantEnd = new Date(applicantTime.end).getTime();

      // Iterate through each committee time slot
      for (const committeeTime of committeeTimes) {
        const committeeStart = new Date(committeeTime.start).getTime();
        const committeeEnd = new Date(committeeTime.end).getTime();

        // Check if the time slots overlap and if they can accommodate the duration
        const start = Math.max(applicantStart, committeeStart);
        const end = Math.min(applicantEnd, committeeEnd);
        if (end - start >= durationMs) {
          matches.push({
            start: new Date(start).toISOString(),
            end: new Date(start + durationMs).toISOString(),
          });
        }
      }
    }

    return matches;
  };

  if (!session || !session.user?.isCommitee) {
    return <NotFound />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exists) {
    return (
      <div className="flex items-center justify-center w-full">
        Legg inn tilgjengelige intervjutider først
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">{`${period?.name}`}</h2>
      <div className="w-full max-w-4xl">
        <h3 className="mt-4 text-xl font-semibold">Søkere:</h3>
        <ul>
          {filteredApplicants.map((applicant) => {
            const applicantTimes = applicant.selectedTimes || [];
            const matches = findMatchingTimes(
              applicantTimes,
              committeeTimes,
              30
            );

            return (
              <li key={applicant.owId} className="mb-4 border p-4 rounded-md">
                <p className="font-bold">{`Navn: ${applicant.name}`}</p>
                <p>{`Email: ${applicant.email}`}</p>
                <p>{`Selected Times: ${
                  applicant.selectedTimes && applicant.selectedTimes.length > 0
                    ? applicant.selectedTimes
                        .map(
                          (time) =>
                            `(${new Date(
                              time.start
                            ).toLocaleString()} - ${new Date(
                              time.end
                            ).toLocaleString()})`
                        )
                        .join(", ")
                    : "No times selected"
                }`}</p>
                <div className="mt-2">
                  <label className="block text-sm font-semibold">
                    Set Interview Time:
                  </label>
                  <select
                    value={interviewSchedule[applicant.owId] || ""}
                    onChange={(e) =>
                      scheduleInterview(applicant.owId, e.target.value)
                    }
                    className="appearance-none block w-full px-3 py-1.5 text-base border rounded cursor-pointer focus:outline-none text-black border-gray-300 focus:border-blue-600 dark:bg-online-darkBlue dark:text-white dark:border-gray-700 dark:focus:border-blue-600"
                  >
                    <option value="">Select a time</option>
                    {matches.map((time, index) => (
                      <option key={index} value={time.start}>{`${new Date(
                        time.start
                      ).toLocaleString()} - ${new Date(
                        time.end
                      ).toLocaleString()}`}</option>
                    ))}
                  </select>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CommitteeApplicantOverView;
