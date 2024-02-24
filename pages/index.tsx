import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthenticationIllustration from "../components/icons/illustrations/AuthenticationIllustration";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { formatDateNorwegian } from "../lib/utils/dateUtils";
import { periodType } from "../lib/types/types";
import { useRouter } from "next/router";

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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {!session && (
        <div className="flex items-center justify-center flex-grow">
          <div className="flex flex-col items-center justify-center gap-5">
            <AuthenticationIllustration className="h-60" />
            <p className="text-lg">
              Vennligst logg inn for å få tilgang til opptakssystemet
            </p>
          </div>
        </div>
      )}

      {session && (
        <div className="flex flex-col gap-5 px-5 my-10">
          <h3 className="text-xl font-semibold text-center text-online-darkBlue">
            Nåværende søknadsperioder
          </h3>
          {currentPeriods.map((period: periodType, index: number) => {
            return (
              <div
                key={index}
                className="w-full max-w-md mx-auto bg-white rounded-lg shadow"
              >
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    {period.name}
                  </h3>
                  <p className="mt-1 text-gray-500">{period.description}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Søknadsperiode:{" "}
                    {formatDateNorwegian(period.applicationPeriod.start)} -{" "}
                    {formatDateNorwegian(period.applicationPeriod.end)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Intervjuperiode:{" "}
                    {formatDateNorwegian(period.interviewPeriod.start)} -{" "}
                    {formatDateNorwegian(period.interviewPeriod.end)}
                  </p>
                  <div className="flex justify-center mt-2">
                    <Button
                      onClick={() =>
                        //router.push(`/application/?period-id=${period._id}`)
                        router.push(`/application/${period._id}`)
                      }
                      title="Søk nå"
                      size="small"
                      color="white"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
