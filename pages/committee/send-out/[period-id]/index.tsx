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
  const [committeeTimes, setCommitteeTimes] = useState<commiteeType[]>([]);
  const [exists, setExists] = useState<boolean>(false);
  const [matchingTimes, setMatchingTimes] = useState<
    { start: string; end: string }[]
  >([]);

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

        const filteredCommitteeTimes = data.committees.filter(
          (committee: commiteeType) => committee.periodId === periodId
        );
        setCommitteeTimes(filteredCommitteeTimes);
        if (filteredCommitteeTimes.length > 0) {
          setExists(true);
        }
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

  useEffect(() => {
    if (filteredApplicants.length > 0 && committeeTimes.length > 0 && exists) {
      console.log(filteredApplicants);
      const applicantTimes = filteredApplicants[0]?.selectedTimes || [];
      const committeeAvailableTimes = committeeTimes.flatMap(
        (ct) => ct.availableTimes || []
      );
      const timeslot = 30;

      const findMatchingTimes = (
        applicantTimes: any[],
        committeeTimes: any[],
        timeslot: number
      ) => {
        const matchingTimes: { start: string; end: string }[] = [];
        console.log(applicantTimes);
        applicantTimes.forEach((appTime) => {
          const appStart = new Date(appTime.start);
          const appEnd = new Date(appTime.end);
          console.log("sdifo");

          console.log(`commite times: ${committeeTimes}`);

          committeeTimes.forEach((commTime) => {
            const commStart = new Date(commTime.start);
            const commEnd = new Date(commTime.end);
            console.log(commStart, commEnd);

            const overlapStart = new Date(
              Math.max(appStart.getTime(), commStart.getTime())
            );
            const overlapEnd = new Date(
              Math.min(appEnd.getTime(), commEnd.getTime())
            );
            console.log(overlapStart, overlapEnd);
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

      const matches = findMatchingTimes(
        applicantTimes,
        committeeAvailableTimes,
        timeslot
      );
      setMatchingTimes(matches);
    }
  }, [filteredApplicants, committeeTimes, exists]);

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
      <div>
        <h3 className="mt-4 text-xl font-semibold">
          Matching Interview Times:
        </h3>
        <ul>
          {matchingTimes.map((time, index) => (
            <li key={index}>{`Start: ${new Date(
              time.start
            ).toLocaleString()} - End: ${new Date(
              time.end
            ).toLocaleString()}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommitteeApplicantOverView;
