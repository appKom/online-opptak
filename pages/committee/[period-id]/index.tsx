import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { applicantType, periodType } from "../../../lib/types/types";
import { useRouter } from "next/router";
import ApplicantsOverview from "../../../components/applicantoverview/ApplicantsOverview";

const CommitteeApplicantOverView: NextPage = () => {
  const { data: session } = useSession();
  const [applicants, setApplicants] = useState<applicantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [period, setPeriod] = useState<periodType | null>(null);
  const [years, setYears] = useState<string[]>([]);

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

        const uniqueYears: string[] = Array.from(
          new Set(
            data.applicants.map((applicant: applicantType) =>
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

    fetchApplicants();
    fetchPeriod();
  }, [session, periodId]);

  useEffect(() => {
    if (period && session) {
      const userCommittees = session.user!.committees;
      const periodCommittees = period.committees;

      if (period.optionalCommittees != null) {
        periodCommittees.push(...period.optionalCommittees);
      }

      const filteredCommittees = periodCommittees.filter(
        (committee) => userCommittees?.includes(committee.toLowerCase())
      );
      setCommittees(filteredCommittees);
    }
  }, [period, session]);

  if (!session || !session.user?.isCommitee) {
    return <p>Ingen Tilgang!</p>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ApplicantsOverview
      applicants={applicants}
      period={period}
      committees={committees}
      years={years}
      includePreferences={false}
    />
  );
};

export default CommitteeApplicantOverView;
