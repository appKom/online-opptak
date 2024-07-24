import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingPage from "../../../components/LoadingPage";
import CommitteeCard from "../../../components/committee/CommitteeCard";

const ChooseCommittee = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"];
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeriod = async () => {
      if (!session || !periodId) return;

      try {
        const res = await fetch(`/api/periods/${periodId}`);
        const data = await res.json();

        if (data.period) {
          const userCommittees = session!.user!.committees;
          const periodCommittees = data.period.committees;

          if (data.period.optionalCommittees != null) {
            periodCommittees.push(...data.period.optionalCommittees);
          }

          const filteredCommittees = periodCommittees.filter(
            (committee: string) =>
              userCommittees?.includes(committee.toLowerCase())
          );
          setCommittees(filteredCommittees);
        }
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPeriod();
  }, [periodId, session]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col px-5 pt-5 items-center gap-8">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">Velg komite</h2>
      {committees?.map((committee) => (
        <CommitteeCard
          key={committee}
          committee={committee}
          link={`${periodId}/${committee.toLowerCase()}`}
        />
      ))}
    </div>
  );
};

export default ChooseCommittee;
