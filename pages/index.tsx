import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import AuthenticationIllustration from "../components/icons/illustrations/AuthenticationIllustration";
import SelectionIllustration from "../components/icons/illustrations/SelectionIllustration";
import CustomizationIllustration from "../components/icons/illustrations/CustomizationIllustration";
import Button from "../components/Button";
import { useUser } from "@auth0/nextjs-auth0/client";

const Home = () => {
  const { user } = useUser();

  // sjekk om bruker er i komité som har opptak
  // sjekk om bruker allerede har sendt inn søknad
  // sjekke om det er en søknadsperiode
  //    sjekke hvilken søknadsperiode

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {!user && (
        <div className="flex items-center justify-center flex-grow">
          <div className="flex flex-col items-center justify-center gap-5">
            <AuthenticationIllustration className="h-60" />
            <p className="text-lg">
              Vennligst logg inn for å få tilgang til opptakssystemet
            </p>
          </div>
        </div>
      )}

      {user && (
        <div className="flex flex-col items-center justify-center flex-grow gap-20">
          <h1 className="text-3xl font-semibold text-online-darkBlue">
            Komitéopptak 2024
          </h1>
          <div className="flex flex-col items-center justify-center gap-10 sm:flex-row md:gap-40">
            <div className="flex flex-col items-center justify-center gap-5">
              <SelectionIllustration className="h-32" />
              <Link href="/form">
                <Button title="Søk komité" color="blue" />
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
              <CustomizationIllustration className="h-32" />
              <Link href="/committee">
                <Button title="Komité-innstillinger" color="blue" />
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
