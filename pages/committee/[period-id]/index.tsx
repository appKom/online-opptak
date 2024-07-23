import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingPage from "../../../components/LoadingPage";
import CommitteeCard from "../../../components/committee/CommitteeCard";
import { useQuery } from "@tanstack/react-query";
import { fetchPeriodById } from "../../../lib/api/periodApi";
import ErrorPage from "../../../components/ErrorPage";
import NotFound from "../../404";

const ChooseCommittee = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"];

  const [committees, setCommittees] = useState<string[]>();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['periods', periodId],
    queryFn: fetchPeriodById,
  });

  useEffect(() => {
    if(!data) return;

    const userCommittees = session!.user!.committees;
    const periodCommittees = [...data.period?.committees, ...data.period?.optionalCommittees];

    const matchingCommittees = periodCommittees.filter(
      (committee: string) =>
        userCommittees?.includes(committee.toLowerCase())
    );
    setCommittees(matchingCommittees);

  }, [data, session])

  if (session?.user?.committees?.length === 0) return <NotFound />;
  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <div className="flex flex-col items-center gap-8 px-5">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">Velg komite</h2>
      {committees?.map((committee) =>
        CommitteeCard({
          committee,
          link: `${periodId}/${committee.toLowerCase()}`,
        })
      )}
    </div>
  );
};

export default ChooseCommittee;
