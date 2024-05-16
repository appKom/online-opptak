import { useSession } from "next-auth/react";
import Footer from "../components/Footer";
import AuthenticationIllustration from "../components/icons/illustrations/AuthenticationIllustration";
import { useEffect, useState } from "react";
import { periodType } from "../lib/types/types";
import { useRouter } from "next/router";
import PeriodCard from "../components/PeriodCard";
import Button from "../components/Button";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
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
      <div className="flex text-center justify-center">
        <h2 className="text-2xl font-semibold text-online-darkBlue dark:text-white">
          Vent litt...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between min-h-screen overflow-x-hidden text-online-darkBlue dark:text-white">
      <div className="flex flex-col items-center justify-center gap-5 px-5 my-10">
        {session ? (
          currentPeriods.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="text-lg">
                Det er ingen aktive søknadsperioder for øyeblikket, kom tilbake
                senere!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <h3 className="text-xl font-semibold text-center text-online-darkBlue dark:text-white">
                Nåværende søknadsperioder
              </h3>
              <div className="flex flex-wrap gap-5 justify-center max-w-full">
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

        {session?.user?.isCommitee && currentPeriods.length !== 0 ? (
          <div className="flex flex-col gap-20">
            <Button
              title="Se eller administrer komiteens intervjutider"
              color="blue"
              onClick={() => router.push(`/committee/`)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
