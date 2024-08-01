import { useEffect, useState, useRef } from "react";
import {
  applicationType,
  bankomOptionsType,
  committeePreferenceType,
  periodType,
  preferencesType,
} from "../../lib/types/types";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../ErrorPage";
import { getBankomValue } from "../../lib/utils/toString";
import ApplicationCard from "./ApplicationCard";
import {
  fetchApplicationsByPeriodId,
  fetchApplicationsByPeriodIdAndCommittee,
} from "../../lib/api/applicationApi";
import ApplicationOverviewSkeleton from "../skeleton/ApplicationOverviewSkeleton";
import { SimpleTitle } from "../Typography";

interface Props {
  period?: periodType | null;
  committees?: string[] | null;
  committee?: string;
  includePreferences: boolean;
  showPeriodName?: boolean;
}

const isPreferencesType = (
  preferences: preferencesType | committeePreferenceType[]
): preferences is preferencesType => {
  return (preferences as preferencesType).first !== undefined;
};

const ApplicationsOverview = ({
  period,
  committees,
  committee,
  includePreferences,
  showPeriodName,
}: Props) => {
  const [filteredApplications, setFilteredApplications] = useState<
    applicationType[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBankom, setSelectedBankom] =
    useState<bankomOptionsType>(undefined);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [applications, setApplications] = useState<applicationType[]>([]);
  const years: string[] = ["1", "2", "3", "4", "5"];

  const bankomOptions: bankomOptionsType[] = ["yes", "no", "maybe"];

  const {
    data: applicationsData,
    isError: applicationsIsError,
    isLoading: applicationsIsLoading,
  } = useQuery({
    queryKey: ["applications", period?._id, committee],
    queryFn: includePreferences
      ? fetchApplicationsByPeriodId
      : fetchApplicationsByPeriodIdAndCommittee,
  });

  useEffect(() => {
    if (!applicationsData) return;

    const dataType = includePreferences
      ? applicationsData.applications
      : applicationsData.applications;

    setApplications(dataType);
  }, [applicationsData, includePreferences]);

  useEffect(() => {
    let filtered: applicationType[] = applications;

    if (selectedCommittee) {
      filtered = filtered.filter((application) => {
        if (isPreferencesType(application.preferences)) {
          return (
            application.preferences.first.toLowerCase() ===
              selectedCommittee.toLowerCase() ||
            application.preferences.second.toLowerCase() ===
              selectedCommittee.toLowerCase() ||
            application.preferences.third.toLowerCase() ===
              selectedCommittee.toLowerCase() ||
            application.optionalCommittees.some(
              (optionalCommittee) =>
                optionalCommittee.toLowerCase() ===
                selectedCommittee.toLowerCase()
            )
          );
        }
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (application) => application.grade.toString() === selectedYear
      );
    }

    if (selectedBankom) {
      filtered = filtered.filter(
        (application) => application.bankom === selectedBankom
      );
    }

    if (searchQuery) {
      const regex = new RegExp(searchQuery.split("").join(".*"), "i");
      filtered = filtered.filter((application) => regex.test(application.name));
    }

    setFilteredApplications(filtered);
  }, [
    selectedCommittee,
    selectedYear,
    searchQuery,
    selectedBankom,
    applications,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCommittee(null);
    setSelectedYear("");
    setSelectedBankom(undefined);
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

  if (applicationsIsLoading) return <ApplicationOverviewSkeleton />;
  if (applicationsIsError) return <ErrorPage />;

  return (
    <div className="flex flex-col items-center">
      {showPeriodName && <SimpleTitle title={period?.name || ""} />}

      <div className="w-full max-w-lg mx-auto mt-10 mb-5">
        <div className="relative flex flex-row justify-between mb-2 align-end">
          <p className="text-sm text-gray-800 dark:text-gray-300">
            Søk etter navn eller filtrer
          </p>
          <div className="relative flex flex-row gap-2">
            {applications.length > filteredApplications.length && (
              <p
                className="text-sm text-blue-800 cursor-pointer dark:text-blue-400"
                onClick={resetFilters}
              >
                (Vis alle {applications.length})
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
                className="absolute right-0 z-10 w-48 p-4 bg-white border border-gray-300 rounded shadow-lg top-10 dark:bg-online-darkBlue dark:border-gray-600"
              >
                {committees && (
                  <div className="mb-4">
                    <label className="block mb-2 text-sm">Velg komite</label>
                    <select
                      className="w-full p-2 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
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
                  <label className="block mb-2 text-sm">Velg klasse</label>
                  <select
                    className="w-full p-2 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
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
                  <label className="block mb-2 text-sm">Velg bankom</label>
                  <select
                    className="w-full p-2 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
                    value={selectedBankom}
                    onChange={(e) =>
                      setSelectedBankom(e.target.value as bankomOptionsType)
                    }
                  >
                    <option value="">Velg bankom</option>
                    {bankomOptions.map((bankom) => (
                      <option key={bankom} value={bankom}>
                        {getBankomValue(bankom)}
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

      {filteredApplications && filteredApplications.length > 0 ? (
        <div className="w-full max-w-lg mx-auto">
          <div className="flex flex-col ">
            {filteredApplications?.map((application) => (
              <ApplicationCard
                key={application.owId + application.name}
                application={application}
                includePreferences={includePreferences}
              />
            ))}
            <p className="text-end ">
              {filteredApplications?.length} resultater
            </p>
          </div>
        </div>
      ) : (
        <p>Ingen søkere</p>
      )}
    </div>
  );
};

export default ApplicationsOverview;
