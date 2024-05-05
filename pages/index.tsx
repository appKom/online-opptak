import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthenticationIllustration from "../components/icons/illustrations/AuthenticationIllustration";
import { useEffect, useState } from "react";
import { periodType } from "../lib/types/types";
import { useRouter } from "next/router";
import PeriodCard from "../components/PeriodCard";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPeriods, setCurrentPeriods] = useState([]);

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
      } catch (error) {
        console.error("Failed to fetch application periods:", error);
      }
    };
    fetchPeriods();
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="flex items-center justify-center flex-grow gap-5 px-5 my-10">
        {session ? (
          currentPeriods.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="text-lg">
                Det er ingen aktive søknadsperioder for øyeblikket, kom tilbake
                senere!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <h3 className="text-xl font-semibold text-center text-online-darkBlue">
                Nåværende søknadsperioder
              </h3>
              {currentPeriods.map((period: periodType, index: number) => (
                <PeriodCard key={index} period={period} />
              ))}
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
      <Footer />
    </div>
  );
};

export default Home;
