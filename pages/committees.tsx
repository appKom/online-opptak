import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { owCommitteeType, periodType } from "../lib/types/types";
import CommitteeAboutCard from "../components/CommitteeAboutCard";
import { useQuery } from "@tanstack/react-query";
import { fetchOwCommittees } from "../lib/api/committeesApi";
import ErrorPage from "../components/ErrorPage";
import { fetchPeriods } from "../lib/api/periodApi";
import { MainTitle } from "../components/Typography";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Tabs } from "../components/Tabs";
import { UserIcon } from "@heroicons/react/24/solid";
import { shuffleList } from "../lib/utils/shuffleList";

const excludedCommittees = ["Faddere", "Output"];

const otherCommittees = ["Jubkom", "Velkom", "Ekskom", "Debug"];

const Committees = () => {
  const [committees, setCommittees] = useState<owCommitteeType[]>([]);
  const [nodeCommittees, setNodeCommittees] = useState<owCommitteeType[]>([]);
  const [periods, setPeriods] = useState<periodType[]>([]);
  const [activeTab, setActiveTab] = useState(0);

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

    const filterNodeCommittees = owCommitteeData.filter(
      (committee: owCommitteeType) =>
        otherCommittees.includes(committee.name_short)
    );
    setNodeCommittees(filterNodeCommittees);

    let filteredCommittees = owCommitteeData.filter(
      (committee: owCommitteeType) =>
        !excludedCommittees.includes(committee.name_short) &&
        !otherCommittees.includes(committee.name_short)
    );

    filteredCommittees = shuffleList(filteredCommittees);
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
    <div className="flex flex-col items-center gap-5">
      <MainTitle
        boldMainTitle={"Onlines komiteér"}
        subTitle={
          "Komitémedlemmer får Online til å gå rundt, og arbeider for at alle informatikkstudenter skal ha en flott studiehverdag."
        }
        boldSubTitle=""
      />

      <Tabs
        activeTab={activeTab}
        setActiveTab={(index) => {
          setActiveTab(index);
        }}
        content={[
          {
            title: "Komitéer",
            icon: <UsersIcon className="w-5 h-5" />,
            content: (
              <div className="max-w-screen-2xl px-4 mx-auto bg-white sm:py-6 lg:px-6 dark:bg-gray-900">
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
            ),
          },
          {
            title: "Nodekomitéer",
            icon: <UserIcon className="w-5 h-5" />,
            content: (
              <div className="max-w-screen-2xl px-4 mx-auto bg-white sm:py-6 lg:px-6 dark:bg-gray-900">
                <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
                  {nodeCommittees?.map((committee, index) => {
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
            ),
          },
        ]}
      />
    </div>
  );
};

export default Committees;
