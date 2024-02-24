import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import ApplicationForm from "../../components/form/ApplicationForm";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import validator from "validator";
import toast from "react-hot-toast";
import WellDoneIllustration from "../../components/icons/illustrations/WellDoneIllustration";
import CheckIcon from "../../components/icons/icons/CheckIcon";
import Button from "../../components/Button";
import CalendarIcon from "../../components/icons/icons/CalendarIcon";
import { Tabs } from "../../components/Tabs";
import { DeepPartial, applicantType, periodType } from "../../lib/types/types";
import { useRouter } from "next/router";

const Application: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"];

  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  const [periodExists, setPeriodExists] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<
    DeepPartial<applicantType>
  >({
    owId: session?.user?.owId,
    name: session?.user?.name,
    email: session?.user?.email,
    phone: session?.user?.phone,
    grade: session?.user?.grade,
  });
  const [period, setPeriod] = useState<periodType>();

  useEffect(() => {
    const checkPeriod = async () => {
      if (periodId === undefined) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/periods/${periodId}`);
        const data = await response.json();
        if (response.ok) {
          setPeriod(data.period);
          setPeriodExists(data.exists);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking period:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkApplicationStatus = async () => {
      setIsLoading(true);
      if (session?.user?.owId) {
        try {
          const response = await fetch(
            `/api/applicants/${periodId}/${session.user.owId}`
          );
          const data = await response.json();
          if (response.ok) {
            setHasAlreadySubmitted(data.exists);
          } else {
            throw new Error(data.error || "Unknown error");
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

    checkPeriod();
    checkApplicationStatus();
  }, [session?.user?.owId, periodId]);

  const handleSubmitApplication = async () => {
    if (!validateApplication(applicationData)) {
      return;
    }
    try {
      applicationData.periodId = periodId as string;
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
    }
  };

  const handleDeleteApplication = async () => {
    if (!session?.user?.owId) {
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
      const response = await fetch(
        `/api/applicants/${periodId}/${session.user.owId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the application");
      }

      toast.success("Søknad trukket tilbake");
      setHasAlreadySubmitted(false);
    } catch (error) {
      toast.error("Det skjedde en feil, vennligst prøv igjen");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-5">
        {periodExists && period && (
          <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue">
            {period?.name}
          </h1>
        )}
        {isLoading ? (
          <p className="animate-pulse">Vent litt...</p>
        ) : !periodExists ? (
          <p>Perioden finnes ikke</p>
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
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            content={[
              {
                title: "Søknad",
                icon: <CheckIcon className="w-5 h-5" />,
                content: (
                  <>
                    <ApplicationForm
                      applicationData={applicationData}
                      setApplicationData={setApplicationData}
                    />
                    <div className="flex justify-center w-full">
                      <Button
                        title="Videre"
                        color="blue"
                        onClick={() => {
                          if (!validateApplication(applicationData)) {
                            return;
                          }
                          setActiveTab(activeTab + 1);
                        }}
                        size="small"
                      />
                    </div>
                  </>
                ),
              },
              {
                title: "Intervjutider",
                icon: <CalendarIcon className="w-5 h-5" />,
                content: (
                  <>
                    <div>when2meet</div>
                    <div className="flex justify-center w-full">
                      <Button
                        title="Send inn søknad"
                        color="blue"
                        onClick={handleSubmitApplication}
                        size="small"
                      />
                    </div>
                  </>
                ),
              },
            ]}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Application;

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
  if (applicationData.bankom === undefined) {
    toast.error("Velg om du er interessert i Bankom");
    return false;
  }
  if (applicationData.feminIt === undefined) {
    toast.error("Velg om du er interessert i FeminIT");
    return false;
  }
  return true;
};

{
  /* <Button
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
      /> */
}
