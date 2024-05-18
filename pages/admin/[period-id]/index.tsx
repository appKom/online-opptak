import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";
import router from "next/router";
import { applicantType, periodType } from "../../../lib/types/types";
import NotFound from "../../404";

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

  if (isLoading) {
    return <p className="animate-pulse">Vent litt...</p>;
  }

  return (
    <div className="">
      <div className="flex flex-col py-2">
        <h1 className="my-5 text-3xl font-semibold text-center text-online-darkBlue dark:text-white">
          {period?.name}
        </h1>
        {/* <h2 className="text-xl font-semibold text-center text-online-darkBlue dark:text-gray-200">
          {filteredApplications?.length} Søknader
        </h2> */}
      </div>
      <div className="flex justify-center items-center">
        {committees && (
          <div className="flex flex-row py-5 pt-10 space-x-5">
            <select
              className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark-border-gray-600"
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
              className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark-border-gray-600"
            />
          </div>
        )}
      </div>

      {applicationsExist && filteredApplications?.length ? (
        <div className="min-w-200 px-20 py-10">
          <table className="min-w-full border border-collapse border-gray-200 dark:bg-online-darkBlue dark:border-gray-700">
            <thead>
              <tr>
                {[
                  "Navn",
                  "1. Komitee",
                  "2. Komitee",
                  "3. Komitee",
                  "Dato",
                  "Klasse",
                  "E-post",
                  "Telefon",
                ].map((header) => (
                  <th
                    key={header}
                    className="p-2 border border-gray-200 dark:border-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((applicant, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.name}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.preferences.first}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.preferences.second}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.preferences.third}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {new Date(applicant.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.grade}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.email}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-end py-5 px-10">
            <p>{`${filteredApplications.length} resultater`}</p>
          </div>
        </div>
      ) : (
        <p>Ingen søknader.</p>
      )}
    </div>
  );
};

export default Admin;
