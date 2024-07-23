import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";
import { periodType } from "../../../lib/types/types";
import NotFound from "../../404";
import ApplicantsOverview from "../../../components/applicantoverview/ApplicantsOverview";

const Admin = () => {
  const { data: session } = useSession();
  const periodId = router.query["period-id"];
  const [period, setPeriod] = useState<periodType | null>(null);
  const [committees, setCommittees] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchPeriod = async () => {
      if (!session || session.user?.role !== "admin") {
        return;
      }
      if (periodId === undefined) return;

      try {
        const response = await fetch(`/api/periods/${periodId}`);
        const data = await response.json();
        if (response.ok) {
          setPeriod(data.period);
          setCommittees(data.period.committees);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking period:", error);
      }
    };

    fetchPeriod();
  }, [session?.user?.owId, periodId]);

  if (!session || session.user?.role !== "admin") {
    return <NotFound />;
  }

  return (
    <ApplicantsOverview
      period={period}
      committees={committees}
      includePreferences={true}
    />
  );
};

export default Admin;
