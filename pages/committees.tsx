import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { owCommitteeType, periodType } from "../lib/types/types";
import CommitteeAboutCard from "../components/CommitteeAboutCard";
import { useQuery } from "@tanstack/react-query";
import { fetchOwCommittees } from "../lib/api/committeesApi";
import ErrorPage from "../components/ErrorPage";
import { fetchPeriods } from "../lib/api/periodApi";
import { MainTitle } from "../components/Typography";

const excludedCommittees = ["Faddere"];

const Committees = () => {
  const [committees, setCommittees] = useState<owCommitteeType[]>([]);
  const [periods, setPeriods] = useState<periodType[]>([]);

  const {
    data: owCommitteeData,
    isError: owCommitteeIsError,
    isLoading: owCommitteeIsLoading,
  } = useQuery({
    queryKey: ["ow-committees"],
    queryFn: fetchOwCommittees,
  });

  const {
    data: periodsData,
    isError: periodsIsError,
    isLoading: periodsIsLoading,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: fetchPeriods,
  });

  useEffect(() => {
    if (!owCommitteeData) return;

    const filteredCommittees = owCommitteeData.filter(
      (committee: owCommitteeType) =>
        !excludedCommittees.includes(committee.name_short)
    );

    setCommittees(filteredCommittees);
  }, [owCommitteeData]);

  useEffect(() => {
    if (!periodsData) return;

    setPeriods(periodsData.periods);
  }, [periodsData]);

  const hasPeriod = (committee: owCommitteeType) => {
    if (!Array.isArray(periods)) return false;

    const today = new Date();

    if (committee.name_short === "Bankom") {
      return periods.some((period) => {
        const applicationStart = new Date(period.applicationPeriod.start);
        const applicationEnd = new Date(period.applicationPeriod.end);
        return applicationStart <= today && applicationEnd >= today;
      });
    }

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

  if (owCommitteeIsLoading || periodsIsLoading) return <LoadingPage />;
  if (owCommitteeIsError || periodsIsError) return <ErrorPage />;

  return (
    <div className="max-w-screen-xl px-4 mx-auto bg-white sm:py-6 lg:px-6 dark:bg-gray-900">
      <div className="max-w-screen-md mb-8 lg:mb-16">
        <MainTitle
          boldMainTitle="Onlines komiteer"
          subTitle="Komitémedlemmer får Online til å gå rundt, og arbeider for at alle
          informatikkstudenter skal ha en flott studiehverdag."
        />
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
  );
};

export default Committees;
