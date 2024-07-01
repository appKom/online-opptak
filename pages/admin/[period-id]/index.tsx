import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";
import { applicantType, periodType } from "../../../lib/types/types";
import NotFound from "../../404";
import ApplicantsOverview from "../../../components/applicantoverview/ApplicantsOverview";

const Admin = () => {
  const { data: session } = useSession();
  const periodId = router.query["period-id"];
  const [period, setPeriod] = useState<periodType | null>(null);
  const [applicants, setApplicants] = useState<applicantType[]>([]);
  const [applicationsExist, setApplicationsExist] = useState(false);
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [years, setYears] = useState<string[]>([]);

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
      } finally {
      }
    };

    const fetchApplications = async () => {
      if (!session || session.user?.role !== "admin") {
        return;
      }
      if (periodId === undefined) return;

      try {
        const response = await fetch(`/api/applicants/${periodId}`);
        const data = await response.json();
        if (response.ok) {
          setApplicants(data.applications);
          setApplicationsExist(data.exists);

          const uniqueYears: string[] = Array.from(
            new Set(
              data.applications.map((applicant: applicantType) =>
                applicant.grade.toString()
              )
            )
          );
          setYears(uniqueYears);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking applications:", error);
      } finally {
      }
    };

    fetchPeriod();
    fetchApplications();
  }, [session?.user?.owId, periodId]);

  useEffect(() => {}, [applicants, committees]);

  if (!session || session.user?.role !== "admin") {
    return <NotFound />;
  }

  return (
    <ApplicantsOverview
      applicants={applicants}
      period={period}
      committees={committees}
      years={years}
      applicationsExist={applicationsExist}
      includePreferences={true}
      optionalCommitteesExist={period?.optionalCommittees != null}
    />
  );
};

export default Admin;
