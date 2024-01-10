import { useSession } from "next-auth/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";
import AuthenticationIllustration from "../components/illustrations/authentication";
import SelectionIllustration from "../components/illustrations/selection";
import CustomizationIllustration from "../components/illustrations/customization";

const Home = () => {
  const { data: session } = useSession();

  // sjekk om bruker er i komité som har opptak
  // sjekk om bruker allerede har sendt inn søknad
  // sjekke om det er en søknadsperiode
  //    sjekke hvilken søknadsperiode

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {!session && (
        <div className="flex items-center justify-center flex-grow">
          <div className="flex flex-col items-center justify-center gap-5">
            <AuthenticationIllustration />
            <p className="text-lg">
              Vennligst logg inn for å få tilgang til opptakssystemet
            </p>
          </div>
        </div>
      )}

      {session && (
        <div className="flex flex-col items-center justify-center flex-grow gap-20">
          <h1 className="text-3xl font-semibold text-online-darkBlue">
            Komitéopptak 2024
          </h1>
          <div className="flex flex-col items-center justify-center gap-10 sm:flex-row md:gap-40">
            <div className="flex flex-col items-center justify-center gap-5">
              <SelectionIllustration />
              <Link href="/form">
                <button
                  type="button"
                  className="px-6 py-3 font-medium text-center transition-all rounded-lg shadow-sm bg-online-darkTeal text-online-snowWhite hover:text-online-orange focus:ring focus:ring-primary-200"
                >
                  Søk komité
                </button>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
              <CustomizationIllustration />
              <Link href="/committee">
                <button
                  type="button"
                  className="px-6 py-3 font-medium text-center transition-all rounded-lg shadow-sm bg-online-darkTeal text-online-snowWhite hover:text-online-orange focus:ring focus:ring-primary-200"
                >
                  Komité-innstillinger
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
