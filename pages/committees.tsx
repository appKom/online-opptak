import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { owCommitteeType, periodType } from "../lib/types/types";
import CommitteeAboutCard from "../components/CommitteeAboutCard";

const Committees = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [committees, setCommittees] = useState<owCommitteeType[]>([]);
  const [periods, setPeriods] = useState<periodType[]>([]);

  const excludedCommittees = ["Jubkom", "Output", "Faddere"];

  const filterCommittees = (committees: owCommitteeType[]) => {
    return committees.filter(
      (committee) => !excludedCommittees.includes(committee.name_short)
    );
  };

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/periods");
      const data = await response.json();
      setPeriods(data.periods);
    } catch (error) {
      console.error("Failed to fetch periods:", error);
    }
  };

  const fetchCommittees = async () => {
    try {
      const response = await fetch("/api/periods/ow-committees");
      const data = await response.json();

      const filteredData = filterCommittees(data);

      const cachedData = JSON.parse(
        localStorage.getItem("committeesCache") || "[]"
      );

      if (JSON.stringify(filteredData) !== JSON.stringify(cachedData)) {
        localStorage.setItem("committeesCache", JSON.stringify(filteredData));
        setCommittees(filteredData);
      } else {
        setCommittees(cachedData);
      }
      console.log(filteredData);
    } catch (error) {
      console.error("Failed to fetch committees:", error);
      const cachedData = JSON.parse(
        localStorage.getItem("committeesCache") || "[]"
      );
      setCommittees(cachedData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = JSON.parse(
      localStorage.getItem("committeesCache") || "[]"
    );
    if (cachedData.length > 0) {
      setCommittees(cachedData);
      setIsLoading(false);
    }
    fetchPeriods();
    fetchCommittees();
  }, []);

  const hasPeriod = (committee: any) => {
    if (!Array.isArray(periods)) {
      return false;
    }

    if (periods.length > 0 && committee.name_short === "Bankom") {
      return true;
    }

    const today = new Date();
    return periods.some((period) => {
      const applicationStart = new Date(period.applicationPeriod.start);
      const applicationEnd = new Date(period.applicationPeriod.end);

      return (
        applicationStart <= today &&
        applicationEnd >= today &&
        (period.committees.includes(committee.name_short) ||
          period.optionalCommittees.includes(committee.name_short))
      );
    });
  };

  if (isLoading) return <LoadingPage />;

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Onlines komiteer
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Komitémedlemmer får Online til å gå rundt, og arbeider for at alle
            informatikkstudenter skal ha en flott studiehverdag.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
          {committees?.map((committee, index) => {
            return (
              <CommitteeAboutCard
                key={index}
                committee={committee}
                hasPeriod={hasPeriod(committee)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Committees;
