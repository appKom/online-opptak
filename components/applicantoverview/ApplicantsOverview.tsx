import { useEffect, useState } from "react";
import {
  applicantType,
  committeePreferenceType,
  periodType,
  preferencesType,
} from "../../lib/types/types";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
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
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCommittee(null);
    setSelectedYear("");
  };

  return (
    <div className="flex flex-col items-center px-5">
      <h2 className="mt-5 mb-6 text-3xl font-bold items-start text-start">{`${period?.name}`}</h2>

      <div className="w-full max-w-md mx-auto mb-5">
        <div className="flex flex-row mb-2 align-end justify-between relative">
          <p className="dark:text-gray-300 text-gray-800 text-sm">
            Søk etter navn eller filtrer
          </p>
          <div className="flex flex-row gap-2 relative">
            {applicants.length > filteredApplicants.length && (
              <p
                className="text-blue-800 dark:text-blue-400 text-sm cursor-pointer"
                onClick={resetFilters}
              >
                (Vis alle {applicants.length})
              </p>
            )}
            <AdjustmentsHorizontalIcon
              className="w-8 h-8 cursor-pointer"
              onClick={() => setFilterMenuVisible(!filterMenuVisible)}
            />
            {filterMenuVisible && (
              <div
                className="absolute right-0 top-10 w-48 bg-white dark:bg-online-darkBlue border border-gray-300 dark:border-gray-600 p-4 rounded shadow-lg z-10"
                onMouseLeave={() => setFilterMenuVisible(false)}
              >
                {committees && (
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Velg komite</label>
                    <select
                      className="w-full p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
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
                  </div>
                )}
                <div>
                  <label className="block text-sm mb-2">Velg klasse</label>
                  <select
                    className="w-full p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
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
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Ola Nordmann"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
        />
      </div>

      {filteredApplicants && filteredApplicants.length > 0 ? (
        <div>
          <ApplicantTable
            filteredApplications={filteredApplicants}
            includePreferences={includePreferences}
          />
        </div>
      ) : (
        <p>Ingen søkere</p>
      )}
    </div>
  );
};

export default ApplicantsOverview;
