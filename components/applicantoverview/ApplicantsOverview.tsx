import { useEffect, useState } from "react";
import {
  applicantType,
  committeePreferenceType,
  periodType,
  preferencesType,
} from "../../lib/types/types";
import ApplicantTable from "./ApplicantTable";

interface Props {
  applicants: applicantType[];
  period: periodType | null;
  committees: string[] | null;
  years: string[];
  applicationsExist: boolean;
  includePreferences: boolean;
  optionalCommitteesExist: boolean;
}

const isPreferencesType = (
  preferences: preferencesType | committeePreferenceType[]
): preferences is preferencesType => {
  return (preferences as preferencesType).first !== undefined;
};

const ApplicantsOverview = ({
  applicants,
  period,
  committees,
  years,
  applicationsExist,
  includePreferences,
  optionalCommitteesExist,
}: Props) => {
  const [filteredApplicants, setFilteredApplicants] = useState<applicantType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    let filtered: applicantType[] = applicants;

    if (selectedCommittee) {
      filtered = filtered.filter((applicant) => {
        if (isPreferencesType(applicant.preferences)) {
          return (
            applicant.preferences.first.toLowerCase() ===
              selectedCommittee.toLowerCase() ||
            applicant.preferences.second.toLowerCase() ===
              selectedCommittee.toLowerCase() ||
            applicant.preferences.third.toLowerCase() ===
              selectedCommittee.toLowerCase()
          );
        } else {
          return applicant.preferences.some(
            (preference) =>
              preference.committee.toLowerCase() ===
              selectedCommittee.toLowerCase()
          );
        }
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

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">{`${period?.name}`}</h2>
      <div className="flex flex-wrap justify-center py-5 pt-10 space-x-5 max-w-full">
        <input
          type="text"
          placeholder="Søk etter navn"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600 mb-4"
        />
        {committees && (
          <select
            className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600 mb-4"
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

        <select
          className="p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600 mb-4"
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
      {filteredApplicants && filteredApplicants.length > 0 ? (
        <div className="px-20">
          <ApplicantTable
            filteredApplications={filteredApplicants}
            applicationsExist={applicationsExist}
            includePreferences={includePreferences}
            optionalCommitteesExist={optionalCommitteesExist}
          />
        </div>
      ) : (
        <p>Ingen søkere</p>
      )}
    </div>
  );
};

export default ApplicantsOverview;
