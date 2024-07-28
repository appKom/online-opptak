import { useEffect, useState } from "react";
import { periodType } from "../lib/types/types";
import PeriodCard from "../components/PeriodCard";
import LoadingPage from "../components/LoadingPage";
import { fetchPeriods } from "../lib/api/periodApi";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/ErrorPage";
import Link from "next/link";

const Apply = () => {
  const [currentPeriods, setCurrentPeriods] = useState<periodType[]>([]);

  const {
    data: periodsData,
    isError: periodsIsError,
    isLoading: periodsIsLoading,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: fetchPeriods,
  });

  useEffect(() => {
    if (!periodsData) return;

    const today = new Date();

    setCurrentPeriods(
      periodsData.periods.filter((period: periodType) => {
        const startDate = new Date(period.applicationPeriod.start || "");
        const endDate = new Date(period.applicationPeriod.end || "");

        return startDate <= today && endDate >= today;
      })
    );
  }, [periodsData]);

  if (periodsIsLoading) return <LoadingPage />;
  if (periodsIsError) return <ErrorPage />;

  return (
    <div className="flex flex-col justify-between overflow-x-hidden text-online-darkBlue dark:text-white">
      <div className="flex flex-col items-center justify-center gap-5 px-5 my-10">
        {currentPeriods.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-3xl ">Ingen åpne opptak for øyeblikket</h1>
            <p className="w-10/12 max-w-2xl text-center text-md ">
              Opptak til{" "}
              <Link href="/committees">
                <a className="underline text-online-darkBlue dark:text-white hover:text-online-orange dark:hover:text-online-orange">
                  komiteene
                </a>
              </Link>{" "}
              skjer vanligvis i august etter fadderuka. Noen komiteer har
              vanligvis suppleringsopptak i februar.
              <br />
              <br />
              Følg med på{" "}
              <Link href="https://online.ntnu.no">
                <a className="underline text-online-darkBlue dark:text-white hover:text-online-orange dark:hover:text-online-orange">
                  online.ntnu.no
                </a>
              </Link>{" "}
              eller på vår{" "}
              <Link href="https://www.facebook.com/groups/1547182375336132">
                <a className="underline text-online-darkBlue dark:text-white hover:text-online-orange dark:hover:text-online-orange">
                  Facebook-gruppe
                </a>
              </Link>{" "}
              for kunngjøringer!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <h3 className="text-4xl font-bold tracking-tight text-center dark:text-white">
              Nåværende opptaksperioder
            </h3>
            <div className="flex flex-col items-center max-w-full gap-5">
              {currentPeriods.map((period: periodType, index: number) => (
                <PeriodCard key={index} period={period} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apply;
