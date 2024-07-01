import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";
import { applicantType, periodType } from "../../../lib/types/types";
import NotFound from "../../404";
import ApplicantTable from "../../../components/admin/ApplicantTable";

const Admin = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const periodId = router.query["period-id"];
  const [period, setPeriod] = useState<periodType>();

  const [applications, setApplications] = useState<applicantType[] | null>(
    null
  );
  const [applicationsExist, setApplicationsExist] = useState(false);

  const [committees, setCommittees] = useState<string[] | null>(null);
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchPeriod = async () => {
      if (!session || session.user?.role !== "admin") {
        return;
      }
      if (periodId === undefined) return;
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    const fetchApplications = async () => {
      if (!session || session.user?.role !== "admin") {
        return;
      }
      if (periodId === undefined) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/applicants/${periodId}`);
        const data = await response.json();
        if (response.ok) {
          setApplications(data.applications || []);
          setApplicationsExist(data.exists);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriod();
    fetchApplications();
  }, [session?.user?.owId, periodId]);

  const filteredApplications = applications?.filter((applicant) => {
    const { first, second, third } = applicant.preferences;
    const committeeMatch =
      !selectedCommittee ||
      [first, second, third].some(
        (pref) => pref && pref.toLowerCase() === selectedCommittee.toLowerCase()
      );

    const nameMatch =
      !searchTerm ||
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase());

    return committeeMatch && nameMatch;
  });

  useEffect(() => {}, [applications, committees]);

  if (!session || session.user?.role !== "admin") {
    return <NotFound />;
  }

  return (
    <div>
      <div className="flex justify-center">
        {isLoading ? (
          <p className="animate-pulse">Vent litt...</p>
        ) : (
          <div className="flex flex-col px-20">
            <div className="flex flex-col py-2">
              <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue dark:text-white">
                {period?.name}
              </h1>
              <h2 className="text-xl font-semibold text-center text-online-darkBlue dark:text-gray-200">
                {filteredApplications?.length} Søknader
              </h2>
            </div>
            {committees && (
              <div className="flex flex-row py-5 pt-10">
                <select
                  className="w-full p-2 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark-border-gray-600"
                  value={selectedCommittee ?? ""}
                  onChange={(e) => setSelectedCommittee(e.target.value)}
                >
                  <option value="">Alle komiteer</option>
                  {committees.map((committee, index) => (
                    <option key={index} value={committee}>
                      {committee}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Søk etter navn"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 ml-5 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
                />
              </div>
            )}

            <ApplicantTable
              filteredApplications={filteredApplications}
              applicationsExist={applicationsExist}
              includePreferences={true}
              optionalCommitteesExist={period?.optionalCommittees != null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
