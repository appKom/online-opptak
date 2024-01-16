import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import ApplicationForm from "../components/form/ApplicationForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import validator from "validator";
import toast from "react-hot-toast";
import WellDoneIllustration from "../components/icons/illustrations/WellDoneIllustration";
import CheckIcon from "../components/icons/icons/CheckIcon";
import Button from "../components/Button";
import CalendarIcon from "../components/icons/icons/CalendarIcon";

const Form: NextPage = () => {
  const { data: session } = useSession();

  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [applicationData, setApplicationData] = useState({
    owId: session?.user.owId,
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    about: "",
    grade: 0,
    bankom: false,
    feminIt: false,
    preferences: {
      first: "",
      second: "",
      third: "",
    },
    interviewTimes: [{}],
  });

  useEffect(() => {
    const checkApplicationStatus = async () => {
      setIsLoading(true);
      if (session?.user.owId) {
        try {
          const response = await fetch(`/api/applicants/${session.user.owId}`);
          if (response.status === 404) {
            setHasAlreadySubmitted(false);
          } else {
            setHasAlreadySubmitted(true);
          }
        } catch (error) {
          console.error("Error checking application status:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkApplicationStatus();
  }, [session?.user.owId]);

  const handleSubmitApplication = async () => {
    if (!validateApplication(applicationData)) {
      return;
    }
    try {
      const response = await fetch("/api/applicants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error(`Error creating applicant: ${response.statusText}`);
      }

      toast.success("Søknad sendt inn");
      setHasAlreadySubmitted(true);
    } catch (error) {
      toast.error("Det skjedde en feil, vennligst prøv igjen");
      console.error("Error:", error);
    }
  };

  const handleDeleteApplication = async () => {
    if (!session?.user.owId) {
      toast.error("User ID not found");
      return;
    }

    const isConfirmed = confirm(
      "Er du sikker på at du vil trekke tilbake søknaden?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/applicants/${session.user.owId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the application");
      }

      toast.success("Søknad trukket tilbake");
      setHasAlreadySubmitted(false);
    } catch (error) {
      toast.error("Det skjedde en feil, vennligst prøv igjen");
    }
  };

  const getTabClass = (tabIndex: number) => {
    const defaultTabClass =
      "inline-flex cursor-pointer items-center gap-2 px-1 py-3 ";

    return (
      defaultTabClass +
      (tabIndex === activeTab
        ? "relative text-online-darkTeal after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-online-darkTeal hover:text-online-darkTeal border-online-darkTeal"
        : "text-gray-500 hover:text-online-darkTeal")
    );
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-5">
        <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue">
          Komitésøknad 2024
        </h1>
        {isLoading ? (
          <p className="animate-pulse">Vent litt...</p>
        ) : hasAlreadySubmitted ? (
          <div className="flex flex-col items-center justify-center gap-5 px-6 md:px-40 lg:px-80">
            <WellDoneIllustration className="h-32" />
            <p className="text-lg text-center">
              Vi har mottatt din søknad og sendt deg en bekreftelse på e-post!
              Du vil få enda en e-post med intervjutider når søknadsperioden er
              over.
            </p>
            <Button
              title="Trekk tilbake søknad"
              color="white"
              onClick={handleDeleteApplication}
            />
          </div>
        ) : (
          <>
            <div className="w-10/12 mb-5 border-b border-b-gray-300">
              <ul className="flex items-center gap-4 -mb-px text-sm font-medium">
                {/* Tab 1 */}
                <li>
                  <a onClick={() => setActiveTab(0)} className={getTabClass(0)}>
                    <CheckIcon className="w-5 h-5" />
                    Søknad
                  </a>
                </li>

                {/* Tab 2 */}
                <li>
                  <a onClick={() => setActiveTab(1)} className={getTabClass(1)}>
                    <CalendarIcon className="w-5 h-5" />
                    Invervjutider
                  </a>
                </li>
              </ul>
            </div>
            <div className="py-3">
              {/* Tab 1 */}
              <div className={activeTab === 0 ? "block" : "hidden"}>
                <ApplicationForm
                  applicationData={applicationData}
                  setApplicationData={setApplicationData}
                />
                <div className="flex w-full justify-center">
                  <Button
                    title="Videre"
                    color="blue"
                    onClick={() => {
                      if (!validateApplication(applicationData)) {
                        return;
                      }
                      setActiveTab(1);
                      window.scrollTo(0, 0);
                    }}
                    size="small"
                  />
                </div>
              </div>
              {/* Tab 2 */}
              <div className={activeTab === 1 ? "block text-center" : "hidden"}>
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <br />
                when2meet
                <div className="flex w-full justify-center">
                  <Button
                    title="Send inn søknad"
                    color="blue"
                    onClick={handleSubmitApplication}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Form;

const validateApplication = (applicationData: any) => {
  if (!validator.isEmail(applicationData.email)) {
    toast.error("Fyll inn en gyldig e-postadresse");
    return false;
  }
  if (!validator.isMobilePhone(applicationData.phone, "nb-NO")) {
    toast.error("Fyll inn et gyldig mobilnummer");
    return false;
  }
  if (applicationData.grade == 0) {
    toast.error("Velg et trinn");
    return false;
  }
  if (applicationData.about == "") {
    toast.error("Skriv litt om deg selv");
    return false;
  }
  if (
    applicationData.preferences.first == "" &&
    applicationData.preferences.second == "" &&
    applicationData.preferences.third == ""
  ) {
    toast.error("Velg minst én komité");
    return false;
  }
  if (
    (applicationData.preferences.first &&
      applicationData.preferences.second &&
      applicationData.preferences.first ===
        applicationData.preferences.second) ||
    (applicationData.preferences.first &&
      applicationData.preferences.third &&
      applicationData.preferences.first ===
        applicationData.preferences.third) ||
    (applicationData.preferences.second &&
      applicationData.preferences.third &&
      applicationData.preferences.second === applicationData.preferences.third)
  ) {
    toast.error("Du kan ikke velge samme komité flere ganger");
    return false;
  }
  return true;
};
