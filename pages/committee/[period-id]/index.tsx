import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "../../404";
import { applicantType } from "../../../lib/types/types";
import { useRouter } from "next/router";

const CommitteeApplicantOverView: NextPage = () => {
  const { data: session } = useSession();
  const [applicants, setApplicants] = useState<applicantType[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<applicantType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const periodId = router.query["period-id"] as string;

  useEffect(() => {
    if (!session || !periodId) return;

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
        console.log("Fetched applicants:", data.applicants);
        setApplicants(data.applicants);
        setFilteredApplicants(data.applicants); // Initially show all applicants
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [session, periodId]);

  useEffect(() => {
    // Filter applicants based on the search query
    if (searchQuery) {
      setFilteredApplicants(
        applicants.filter((applicant) =>
          applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredApplicants(applicants); // Reset to all applicants if search query is empty
    }
    console.log("Filtered applicants:", filteredApplicants);
  }, [searchQuery, applicants]);

  if (!session || !session.user?.isCommitee) {
    return <NotFound />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">{`${applicants.length} Søkere`}</h2>
      <input
        type="text"
        placeholder="Søk etter navn"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded dark:bg-online-darkBlue"
      />
      {filteredApplicants.length > 0 ? (
        <table className="min-w-full border border-collapse border-gray-200 dark:bg-online-darkBlue dark:border-gray-700">
          <thead>
            <tr>
              {["Navn", "Beskrivelse", "Klasse", "Telefon"].map((header) => (
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
            {filteredApplicants.map((applicant, index) => (
              <tr key={index} className="">
                <td className="p-2 border border-gray-200 dark:border-gray-700">
                  {applicant.name}
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">
                  {applicant.about}
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">
                  {applicant.grade}
                </td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">
                  {applicant.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Fant ingen søkere</p>
      )}
    </div>
  );
};

export default CommitteeApplicantOverView;
