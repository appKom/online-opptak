import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import ApplicationForm from "../../components/form/ApplicationForm";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import WellDoneIllustration from "../../components/icons/illustrations/WellDoneIllustration";
import CheckBoxIcon from "../../components/icons/icons/CheckBoxIcon";
import Button from "../../components/Button";
import CalendarIcon from "../../components/icons/icons/CalendarIcon";
import { Tabs } from "../../components/Tabs";
import { DeepPartial, applicantType, periodType } from "../../lib/types/types";
import { useRouter } from "next/router";
import Schedule from "../../components/committee/Schedule";
import { validateApplication } from "../../lib/utils/validateApplication";
import ApplicantCard from "../../components/applicantoverview/ApplicantCard";
import LoadingPage from "../../components/LoadingPage";
import { formatDateNorwegian } from "../../lib/utils/dateUtils";

interface FetchedApplicationData {
  exists: boolean;
  application: applicantType;
}

const Application: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"] as string;

  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(true);
  const [periodExists, setPeriodExists] = useState(false);
  const [fetchedApplicationData, setFetchedApplicationData] =
    useState<FetchedApplicationData | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<
    DeepPartial<applicantType>
  >({
    owId: session?.user?.owId,
    name: session?.user?.name,
    email: session?.user?.email,
    phone: session?.user?.phone || "",
    grade: "1",
    about: "",
    optionalCommittees: [],
    preferences: {
      first: "",
      second: "",
      third: "",
    },
  });
  const [period, setPeriod] = useState<periodType>();

  useEffect(() => {
    const checkPeriodAndApplicationStatus = async () => {
      if (!periodId || !session?.user?.owId) return;

      try {
        const periodResponse = await fetch(`/api/periods/${periodId}`);
        const periodData = await periodResponse.json();
        if (periodResponse.ok) {
          setPeriod(periodData.period);
          setPeriodExists(periodData.exists);
          fetchApplicationData();
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

        if (!applicationResponse.ok) {
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
    if (!validateApplication(applicationData)) return;

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
    } finally {
      fetchApplicationData();
    }
  };

  const fetchApplicationData = async () => {
    if (!session?.user?.owId || !periodId) return;

    try {
      const response = await fetch(
        `/api/applicants/${periodId}/${session.user.owId}`
      );
      const data = await response.json();
      if (!data.exists) {
        setHasAlreadySubmitted(false);
      } else {
        setFetchedApplicationData(data);
      }

      if (!response.ok) {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching application data:", error);
      toast.error("Failed to fetch application data.");
    }
  };

  const handleDeleteApplication = async () => {
    if (!session?.user?.owId) {
      toast.error("User ID not found");
      return;
    }

    if (!confirm("Er du sikker på at du vil trekke tilbake søknaden?")) return;

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

  if (isLoading) return <LoadingPage />;

  if (!periodExists) {
    return (
      <div className="flex flex-col items-center justify-center py-5">
        <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue dark:text-white">
          Opptaket finnes ikke
        </h1>
      </div>
    );
  }

  if (hasAlreadySubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-5 py-10 md:px-40 lg:px-80 dark:text-white">
        <WellDoneIllustration className="h-32" />
        <p className="max-w-md text-lg text-center">
          Vi har mottatt din søknad og sendt deg en bekreftelse på e-post!
        </p>
        <p className="max-w-md text-lg text-center">
          Du vil få enda en e-post med intervjutider når søknadsperioden er over
          (rundt {formatDateNorwegian(period?.applicationPeriod?.end)}).
        </p>
        <p className="max-w-md text-center text-gray-500">
          (Hvis du ikke finner e-posten din, sjekk søppelpost- eller
          spam-mappen.)
        </p>
        <div className="flex gap-5">
          <Button
            title="Trekk tilbake søknad"
            color="white"
            onClick={handleDeleteApplication}
          />
        </div>
        {fetchedApplicationData && (
          <div className="w-full max-w-md">
            <ApplicantCard
              applicant={fetchedApplicationData.application}
              includePreferences={true}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-5">
        {periodExists && period && (
          <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue dark:text-white">
            {period?.name}
          </h1>
        )}

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          content={[
            {
              title: "Søknad",
              icon: <CheckBoxIcon className="w-5 h-5" />,
              content: (
                <>
                  <ApplicationForm
                    applicationData={applicationData}
                    setApplicationData={setApplicationData}
                    availableCommittees={period?.committees || []}
                    optionalCommittees={period?.optionalCommittees || []}
                  />
                  <div className="flex justify-center w-full">
                    <Button
                      title="Videre"
                      color="blue"
                      onClick={() => {
                        if (!validateApplication(applicationData)) return;
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
      </div>
    </div>
  );
};

export default Application;
