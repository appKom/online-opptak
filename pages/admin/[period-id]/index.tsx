import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";
import { periodType } from "../../../lib/types/types";
import NotFound from "../../404";
import ApplicantsOverview from "../../../components/applicantoverview/ApplicantsOverview";
import { useQuery } from "@tanstack/react-query";
import { fetchPeriodById } from "../../../lib/api/periodApi";
import LoadingPage from "../../../components/LoadingPage";
import ErrorPage from "../../../components/ErrorPage";

const Admin = () => {
  const { data: session } = useSession();
  const periodId = router.query["period-id"];

  const [period, setPeriod] = useState<periodType | null>(null);
  const [committees, setCommittees] = useState<string[] | null>(null);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["periods", periodId],
    queryFn: fetchPeriodById,
  });

  useEffect(() => {
    setPeriod(data?.period);
    setCommittees(
      data?.period.committees.concat(data?.period.optionalCommittees)
    );
  }, [data, session?.user?.owId]);

  console.log(committees);

  if (session?.user?.role !== "admin") return <NotFound />;
  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <ApplicantsOverview
      period={period}
      committees={committees}
      includePreferences={true}
      showPeriodName
    />
  );
};

export default Admin;
