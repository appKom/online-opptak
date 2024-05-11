import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";
import router from "next/router";
import { applicantType, periodType } from "../../../lib/types/types";

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
        (pref) =>
          displayPreference(pref).toLowerCase() ===
          selectedCommittee.toLowerCase()
      );

    const nameMatch =
      !searchTerm ||
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase());

    return committeeMatch && nameMatch;
  });

  function displayPreference(pref: any) {
    if (typeof pref === "string") {
      return pref;
    }
    if (pref && typeof pref === "object" && pref.name) {
      return pref.name;
    }
    return "";
  }

  useEffect(() => {}, [applications, committees]);

  if (!session || session.user?.role !== "admin") {
    return <p>Access Denied. You must be an admin to view this page.</p>;
  }

  return (
    <div style={{ marginBottom: "50px" }}>
      <div className="flex justify-center">
        {isLoading ? (
          <p className="animate-pulse">Vent litt...</p>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col py-2">
              <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue">
                {period?.name}
              </h1>
              <h2 className="text-xl font-semibold text-center text-online-darkBlue">
                {filteredApplications?.length} Søknader
              </h2>
            </div>
            {committees && (
              <div className="flex flex-row py-5 pt-10">
                <select
                  className=""
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
                  className="p-2 ml-5 border"
                />
              </div>
            )}

            {applicationsExist && filteredApplications?.length ? (
              <table className="min-w-full bg-white border border-collapse border-gray-200">
                <thead>
                  <tr>
                    <th className="p-2 border">Navn</th>
                    <th className="p-2 border">1. Komitee</th>
                    <th className="p-2 border">2. Komitee</th>
                    <th className="p-2 border">3. Komitee</th>
                    <th className="p-2 border">Dato</th>
                    <th className="p-2 border">Kalasse</th>
                    <th className="p-2 border">Telefon</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((applicant, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{applicant.name}</td>
                      <td className="p-2 border">
                        {displayPreference(applicant.preferences.first)}
                      </td>
                      <td className="p-2 border">
                        {displayPreference(applicant.preferences.second)}
                      </td>
                      <td className="p-2 border">
                        {displayPreference(applicant.preferences.third)}
                      </td>

                      <td className="p-2 border">
                        {new Date(applicant.date).toLocaleDateString()}
                      </td>
                      <td className="p-2 border">{applicant.grade}</td>
                      <td className="p-2 border">{applicant.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Ingen søknader.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
