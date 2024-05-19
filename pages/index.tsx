import { useSession } from "next-auth/react";
import AuthenticationIllustration from "../components/icons/illustrations/AuthenticationIllustration";
import { useEffect, useState } from "react";
import { periodType } from "../lib/types/types";
import PeriodCard from "../components/PeriodCard";

const Home = () => {
  const { data: session } = useSession();
  const [currentPeriods, setCurrentPeriods] = useState<periodType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await fetch("/api/periods");
        const data = await res.json();
        const today = new Date();

        setCurrentPeriods(
          data.periods.filter((period: periodType) => {
            const startDate = new Date(period.applicationPeriod.start || "");
            const endDate = new Date(period.applicationPeriod.end || "");

            return startDate <= today && endDate >= today;
          })
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch application periods:", error);
      }
    };

    fetchPeriods();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center text-center">
        <h2 className="text-2xl font-semibold text-online-darkBlue dark:text-white">
          Vent litt...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between overflow-x-hidden text-online-darkBlue dark:text-white">
      <div className="flex flex-col items-center justify-center gap-5 px-5 my-10">
        {session ? (
          currentPeriods.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-8">
              <h1 className="text-3xl ">Ingen åpne opptak for øyeblikket</h1>
              <p className="w-10/12 max-w-2xl text-center text-md ">
                Opptak til{" "}
                <a
                  href="https://online.ntnu.no/applications"
                  className="underline text-online-darkBlue dark:text-white hover:text-online-orange dark:hover:text-online-orange"
                >
                  komiteene
                </a>{" "}
                skjer vanligvis i august etter fadderuka. Noen komiteer har
                vanligvis suppleringsopptak i februar.{<br></br>} <br></br> Følg
                med på{" "}
                <a
                  href="https://online.ntnu.no"
                  className="underline text-online-darkBlue dark:text-white hover:text-online-orange dark:hover:text-online-orange"
                >
                  online.ntnu.no
                </a>{" "}
                eller på vår{" "}
                <a
                  href="https://www.facebook.com/groups/1547182375336132"
                  className="underline text-online-darkBlue dark:text-white hover:text-online-orange dark:hover:text-online-orange"
                >
                  Facebook
                </a>{" "}
                side for kunngjøringer!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <h3 className="text-xl font-semibold text-center text-online-darkBlue dark:text-white">
                Nåværende søknadsperioder
              </h3>
              <div className="flex flex-wrap justify-center max-w-full gap-5">
                {currentPeriods.map((period: periodType, index: number) => (
                  <PeriodCard key={index} period={period} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-5">
            <AuthenticationIllustration className="h-52" />
            <p className="text-lg">
              Vennligst logg inn for å få tilgang til opptakssystemet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
