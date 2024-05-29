import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import ApplicationForm from "../../components/form/ApplicationForm";
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
import Schedule from "../../components/committee/Schedule";
import ApplicationOverview from "../../components/applicantoverview/ApplicationOverview";

const Application: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"] as string;

  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  const [periodExists, setPeriodExists] = useState(false);
  const [fetchedApplicationData, setFetchedApplicationData] = useState(null);

  const [shouldShowListView, setShouldShowListView] = useState(true);

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<
    DeepPartial<applicantType>
  >({
    owId: session?.user?.owId,
    name: session?.user?.name,
    email: session?.user?.email,
    phone: session?.user?.phone || "",
    grade: session?.user?.grade,
    about: "",
    preferences: {
      first: "",
      second: "",
      third: "",
    },
  });
  const [period, setPeriod] = useState<periodType>();

  useEffect(() => {
    const checkPeriodAndApplicationStatus = async () => {
      if (!periodId || !session?.user?.owId) {
        return;
      }

      setIsLoading(true);
      try {
        const periodResponse = await fetch(`/api/periods/${periodId}`);
        const periodData = await periodResponse.json();
        if (periodResponse.ok) {
          setPeriod(periodData.period);
          setPeriodExists(periodData.exists);
        } else {
          throw new Error(periodData.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking period:", error);
      }

      try {
        const applicationResponse = await fetch(
          `/api/applicants/${periodId}/${session.user.owId}`
        );
        const applicationData = await applicationResponse.json();
        if (applicationResponse.ok) {
          setHasAlreadySubmitted(applicationData.exists);
        } else {
          throw new Error(applicationData.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPeriodAndApplicationStatus();
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

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Søknad sendt inn");
        setHasAlreadySubmitted(true);
      } else {
        if (
          responseData.error ===
          "409 Application already exists for this period"
        ) {
          toast.error("Du har allerede søkt for denne perioden");
        } else {
          throw new Error(`Error creating applicant: ${response.statusText}`);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Det skjedde en feil, vennligst prøv igjen");
      }
    }
  };
  const fetchApplicationData = async () => {
    if (!session?.user?.owId || !periodId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/applicants/${periodId}/${session.user.owId}`
      );
      const data = await response.json();

      if (response.ok) {
        setFetchedApplicationData(data);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching application data:", error);
      toast.error("Failed to fetch application data.");
    } finally {
      setIsLoading(false);
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
      <div className="flex flex-col items-center justify-center py-5">
        {periodExists && period && (
          <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue dark:text-white">
            {period?.name}
          </h1>
        )}
        {isLoading ? (
          <p className="animate-pulse dark:text-white">Vent litt...</p>
        ) : !periodExists ? (
          <p className="dark:text-white">Perioden finnes ikke</p>
        ) : hasAlreadySubmitted ? (
          <div className="flex flex-col items-center justify-center gap-5 px-6 md:px-40 lg:px-80 dark:text-white">
            <WellDoneIllustration className="h-32" />
            <p className="text-lg text-center">
              Vi har mottatt din søknad og sendt deg en bekreftelse på e-post!
              Du vil få enda en e-post med intervjutider når søknadsperioden er
              over.
            </p>
            <div className="flex gap-5">
              <Button
                title="Trekk tilbake søknad"
                color="white"
                onClick={handleDeleteApplication}
              />
              <Button
                title={shouldShowListView ? "Se søknad" : "Skjul søknad"}
                color="blue"
                onClick={() => {
                  fetchApplicationData();
                  setShouldShowListView(!shouldShowListView);
                }}
              />
            </div>
            {fetchedApplicationData && !shouldShowListView && (
              <ApplicationOverview application={fetchedApplicationData} />
            )}
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
                      availableCommittees={period?.committees || []}
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
                  <div className="flex flex-col items-center justify-center">
                    <Schedule
                      interviewLength={Number(30)}
                      periodTime={period?.interviewPeriod}
                      setApplicationData={setApplicationData}
                      applicationData={applicationData}
                    />
                    <div className="flex justify-center w-full mt-10">
                      <Button
                        title="Send inn søknad"
                        color="blue"
                        onClick={handleSubmitApplication}
                        size="small"
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default Application;

const validateApplication = (applicationData: any) => {
  // Check if email is valid
  if (!validator.isEmail(applicationData.email)) {
    toast.error("Fyll inn en gyldig e-postadresse");
    return false;
  }

  // Check if phone number is valid
  if (!validator.isMobilePhone(applicationData.phone, "nb-NO")) {
    toast.error("Fyll inn et gyldig mobilnummer");
    return false;
  }

  // Check if grade is valid
  if (applicationData.grade == 0) {
    toast.error("Velg et trinn");
    return false;
  }

  // Check if about section is filled
  if (applicationData.about === "") {
    toast.error("Skriv litt om deg selv");
    return false;
  }

  // Check if at least one preference is selected
  if (
    !applicationData.preferences.first &&
    !applicationData.preferences.second &&
    !applicationData.preferences.third
  ) {
    toast.error("Velg minst én komité");
    return false;
  }

  // Check for duplicate committee preferences
  const { first, second, third } = applicationData.preferences;
  if (
    (first && second && first === second) ||
    (first && third && first === third) ||
    (second && third && second === third)
  ) {
    toast.error("Du kan ikke velge samme komité flere ganger");
    return false;
  }

  // Check if Bankom interest is specified
  if (applicationData.bankom === undefined) {
    toast.error("Velg om du er interessert i Bankom");
    return false;
  }

  // Check if FeminIT interest is specified
  if (applicationData.feminIt === undefined) {
    toast.error("Velg om du er interessert i FeminIT");
    return false;
  }

  // Validate selected times
  if (applicationData.selectedTimes.length === 0) {
    toast.error("Velg minst én tilgjengelig tid");
    return false;
  }

  for (const time of applicationData.selectedTimes) {
    const startTime = new Date(time.start);
    const endTime = new Date(time.end);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      toast.error("Ugyldig start- eller sluttid");
      return false;
    }
    if (startTime >= endTime) {
      toast.error("Starttid må være før sluttid");
      return false;
    }
  }

  return true;
};
