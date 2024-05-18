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
  const [matchingTimes, setMatchingTimes] = useState<
    { start: string; end: string }[]
  >([]);
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

  // Find matching interview times
  useEffect(() => {
    if (filteredApplicants.length > 0 && committeeTimes.length > 0 && exists) {
      const timeslot = 30; // Interview timeslot duration in minutes

      const findMatchingTimes = (
        applicantTimes: { start: string; end: string }[],
        committeeTimes: { start: string; end: string }[],
        timeslot: number
      ) => {
        const matchingTimes: { start: string; end: string }[] = [];

        applicantTimes.forEach((appTime) => {
          const appStart = new Date(appTime.start);
          const appEnd = new Date(appTime.end);

          committeeTimes.forEach((commTime) => {
            const commStart = new Date(commTime.start);
            const commEnd = new Date(commTime.end);

            const overlapStart = new Date(
              Math.max(appStart.getTime(), commStart.getTime())
            );
            const overlapEnd = new Date(
              Math.min(appEnd.getTime(), commEnd.getTime())
            );

            if (overlapStart < overlapEnd) {
              let currentStart = overlapStart;

              while (currentStart < overlapEnd) {
                const currentEnd = new Date(
                  currentStart.getTime() + timeslot * 60000
                );

                if (currentEnd <= overlapEnd) {
                  matchingTimes.push({
                    start: currentStart.toISOString(),
                    end: currentEnd.toISOString(),
                  });
                }

                currentStart = currentEnd;
              }
            }
          });
        });

        return matchingTimes;
      };

      let allMatchingTimes: { start: string; end: string }[] = [];
      filteredApplicants.forEach((applicant) => {
        if (applicant.selectedTimes && applicant.selectedTimes.length > 0) {
          const applicantTimes = applicant.selectedTimes;
          const committeeAvailableTimes = committeeTimes;

          const matches = findMatchingTimes(
            applicantTimes,
            committeeAvailableTimes,
            timeslot
          );
          allMatchingTimes = [...allMatchingTimes, ...matches];
        }
      });
      setMatchingTimes(allMatchingTimes);
    }
  }, [filteredApplicants, committeeTimes, exists]);

  const scheduleInterview = (applicantId: string, time: string) => {
    setInterviewSchedule((prevSchedule) => ({
      ...prevSchedule,
      [applicantId]: time,
    }));
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
      <p>{`Period ID: ${periodId}`}</p>
      <div className="w-full max-w-4xl">
        <h3 className="mt-4 text-xl font-semibold">Applicants:</h3>
        <ul>
          {filteredApplicants.map((applicant) => (
            <li key={applicant.owId} className="mb-4 border p-4 rounded-md">
              <p className="font-bold">{`Name: ${applicant.name}`}</p>
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
                  {matchingTimes.map((time, index) => (
                    <option key={index} value={time.start}>{`${new Date(
                      time.start
                    ).toLocaleString()} - ${new Date(
                      time.end
                    ).toLocaleString()}`}</option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommitteeApplicantOverView;
