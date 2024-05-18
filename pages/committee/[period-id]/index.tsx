import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  applicantTypeForCommittees,
  periodType,
} from "../../../lib/types/types";
import { useRouter } from "next/router";

const CommitteeApplicantOverView: NextPage = () => {
  const { data: session } = useSession();
  const [applicants, setApplicants] = useState<applicantTypeForCommittees[]>(
    []
  );
  const [filteredApplicants, setFilteredApplicants] = useState<
    applicantTypeForCommittees[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [period, setPeriod] = useState<periodType | null>(null);
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    if (!session || !periodId) return;

    const fetchPeriod = async () => {
      console.log("sheesh");
      try {
        const res = await fetch(`/api/periods/${periodId}`);
        const data = await res.json();
        setPeriod(data.period);
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      }
    };

    const fetchApplicants = async () => {
      console.log(periodId);
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
        console.log(data);
        setApplicants(data.applicants);
        setFilteredApplicants(data.applicants);

        const uniqueYears: string[] = Array.from(
          new Set(
            data.applicants.map((applicant: applicantTypeForCommittees) =>
              applicant.grade.toString()
            )
          )
        );
        setYears(uniqueYears);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
    fetchPeriod();
  }, []);

  useEffect(() => {
    let filtered = applicants;
    // console.log(filtered);

    if (selectedCommittee) {
      filtered = filtered.filter((applicant) => {
        return applicant.preferences.some(
          (preference) =>
            preference.committee.toLowerCase() ===
            selectedCommittee.toLowerCase()
        );
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (applicant) => applicant.grade.toString() === selectedYear
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((applicant) =>
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplicants(filtered);
  }, [selectedCommittee, selectedYear, searchQuery, applicants]);

  useEffect(() => {
    if (period && session) {
      const userCommittees = session.user!.committees;
      const periodCommittees = period.committees;
      const filteredCommittees = periodCommittees.filter(
        (committee) => userCommittees?.includes(committee.toLowerCase())
      );
      setCommittees(filteredCommittees);
    }
  }, [period, session]);

  if (!session || !session.user?.isCommitee) {
    return <p>Ingen Tilgang!</p>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">{`${period?.name}`}</h2>
      <div className="flex flex-row py-5 pt-10">
        {committees && (
          <select
            className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
            value={selectedCommittee ?? ""}
            onChange={(e) => setSelectedCommittee(e.target.value)}
          >
            <option value="">Velg komite</option>
            {committees.map((committee, index) => (
              <option key={index} value={committee}>
                {committee}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          placeholder="Søk etter navn"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 ml-5 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
        />
        <div className="px-5">
          <select
            className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Velg klasse</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}. Klasse
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredApplicants.length > 0 ? (
        <div className="min-w-full px-20 py-10">
          <table className="min-w-full border border-collapse border-gray-200 dark:bg-online-darkBlue dark:border-gray-700">
            <thead>
              <tr>
                {[
                  "Navn",
                  "Beskrivelse",
                  "Bankom",
                  "Klasse",
                  "Telefon",
                  "E-post",
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
              {filteredApplicants.map((applicant, index) => (
                <tr key={index} className="">
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.name}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.about}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.bankom}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.grade}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.phone}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-end py-5 px-10">
            <p>{`${filteredApplicants.length} resultater`}</p>
          </div>
        </div>
      ) : (
        <p>Fant ingen søkere</p>
      )}
    </div>
  );
};

export default CommitteeApplicantOverView;
