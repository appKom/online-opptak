import { useEffect, useState, useRef } from "react";
import {
  applicantType,
  committeePreferenceType,
  periodType,
  preferencesType,
} from "../../lib/types/types";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import ApplicantTable from "./ApplicantTable";
import ApplicantOverviewSkeleton from "./ApplicantOverviewSkeleton";

interface Props {
  period?: periodType | null;
  committees?: string[] | null;
  committee?: string;
  includePreferences: boolean;
}

const isPreferencesType = (
  preferences: preferencesType | committeePreferenceType[]
): preferences is preferencesType => {
  return (preferences as preferencesType).first !== undefined;
};

const ApplicantsOverview = ({
  period,
  committees,
  committee,
  includePreferences,
}: Props) => {
  const [filteredApplicants, setFilteredApplicants] = useState<applicantType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBankom, setSelectedBankom] = useState<string>("");
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [applicants, setApplicants] = useState<applicantType[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bankomOptions: string[] = ["yes", "no", "maybe"];

  const apiUrl = includePreferences
    ? `/api/applicants/${period?._id}`
    : `/api/committees/applicants/${period?._id}/${committee}`;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }

        const data = await response.json();
        const dataType = includePreferences
          ? data.applications
          : data.applicants;

        setApplicants(dataType);

        const uniqueYears: string[] = Array.from(
          new Set(
            dataType.map((applicant: applicantType) =>
              applicant.grade.toString()
            )
          )
        );
        setYears(uniqueYears);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (period) {
      fetchApplicants();
    }
  }, [period]);

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

    if (selectedBankom) {
      filtered = filtered.filter(
        (applicant) => applicant.bankom === selectedBankom
      );
    }

    if (searchQuery) {
      const regex = new RegExp(searchQuery.split("").join(".*"), "i");
      filtered = filtered.filter((applicant) => regex.test(applicant.name));
    }

    setFilteredApplicants(filtered);
  }, [
    selectedCommittee,
    selectedYear,
    searchQuery,
    selectedBankom,
    applicants,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCommittee(null);
    setSelectedYear("");
    setSelectedBankom("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).classList.contains("filter-icon")
      ) {
        setFilterMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterMenuRef]);

  if (isLoading) {
    return <ApplicantOverviewSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <p className="text-2xl">Det skjedde en feil, vennligst prøv igjen</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-5">
      <h2 className="mt-5 mb-6 text-3xl font-bold items-start text-start">
        {period?.name}
      </h2>

      <div className="w-full max-w-lg mx-auto mb-5">
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
              className={`w-8 h-8 cursor-pointer transition-transform duration-300 transform filter-icon ${
                filterMenuVisible ? "rotate-180" : "rotate-0"
              }`}
              onClick={() => setFilterMenuVisible(!filterMenuVisible)}
            />
            {filterMenuVisible && (
              <div
                ref={filterMenuRef}
                className="absolute right-0 top-10 w-48 bg-white dark:bg-online-darkBlue border border-gray-300 dark:border-gray-600 p-4 rounded shadow-lg z-10"
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
                <div className="mb-4">
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
                <div>
                  <label className="block text-sm mb-2">Velg bankom</label>
                  <select
                    className="w-full p-2 border text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
                    value={selectedBankom}
                    onChange={(e) => setSelectedBankom(e.target.value)}
                  >
                    <option value="">Velg bankom</option>
                    {bankomOptions.map((bankom) => (
                      <option key={bankom} value={bankom}>
                        {bankom}
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
        <div className="w-full max-w-lg mx-auto">
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
