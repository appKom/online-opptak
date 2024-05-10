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
  const [periodExists, setPeriodExists] = useState(false);

  const [applications, setApplications] = useState<applicantType[] | null>(
    null
  );
  const [applicationsExist, setApplicationsExist] = useState(false);

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
          setPeriodExists(data.exists);
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
        console.log(data);
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

  if (!session || session.user?.role !== "admin") {
    return <p>Access Denied. You must be an admin to view this page.</p>;
  }

  return (
    <div style={{ marginBottom: "50px" }}>
      <Navbar />
      <div className="flex justify-center">
        {isLoading ? (
          <p className="animate-pulse">Vent litt...</p>
        ) : (
          <div className="flex flex-col py-2">
            <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue">
              {period?.name}
            </h1>
            {applicationsExist ? (
              <table className="min-w-full bg-white border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border p-2">Navn</th>
                    <th className="border p-2">1. Komitee</th>
                    <th className="border p-2">2. Komitee</th>
                    <th className="border p-2">3. Komitee</th>
                    <th className="border p-2">Dato</th>
                    <th className="border p-2">Klasse</th>
                    <th className="border p-2">Telefon</th>
                  </tr>
                </thead>
                <tbody>
                  {applications?.map((applicant, index) => (
                    <tr key={index}>
                      <td className="border p-2">{applicant.name}</td>
                      {/* <td className="border p-2">
                        {`First: ${applicant.preferences.first}, Second: ${applicant.preferences.second}, Third: ${applicant.preferences.third}`}
                      </td> */}
                      <td className="border p-2">
                        {applicant.preferences.first}
                      </td>
                      <td className="border p-2">
                        {applicant.preferences.second}
                      </td>
                      <td className="border p-2">
                        {applicant.preferences.third}
                      </td>
                      <td className="border p-2">
                        {new Date(applicant.date).toLocaleDateString()}
                      </td>
                      <td className="border p-2">{applicant.grade}</td>
                      <td className="border p-2">{applicant.phone}</td>
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
