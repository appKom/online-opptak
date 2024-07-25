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
import PageTitle from "../../components/PageTitle";
import { useQuery } from "@tanstack/react-query";
import { fetchPeriodById } from "../../lib/api/periodApi";
import { fetchApplicantByPeriodAndId } from "../../lib/api/applicantApi";
import ErrorPage from "../../components/ErrorPage";

interface FetchedApplicationData {
  exists: boolean;
  application: applicantType;
}

const Application: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const applicantId = session?.user?.owId;

  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(true);
  const [periodExists, setPeriodExists] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
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
  const [isApplicationPeriodOver, setIsApplicationPeriodOver] = useState(false);

  const {
    data: periodData,
    isError: periodIsError,
    isLoading: periodIsLoading,
  } = useQuery({
    queryKey: ["periods", periodId],
    queryFn: fetchPeriodById,
  });

  const {
    data: applicantData,
    isError: applicantIsError,
    isLoading: applicantIsLoading,
  } = useQuery({
    queryKey: ["applicants", periodId, applicantId],
    queryFn: fetchApplicantByPeriodAndId,
  });

  useEffect(() => {
    if (!periodData) return;

    setPeriod(periodData.period);
    setPeriodExists(periodData.exists);

    const currentDate = new Date().toISOString();
    if (
      new Date(periodData.period.applicationPeriod.end) < new Date(currentDate)
    ) {
      setIsApplicationPeriodOver(true);
    }
  }, [periodData]);

  useEffect(() => {
    setHasAlreadySubmitted(applicantData?.exists);
  }, [applicantData]);

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

  if (periodIsLoading || applicantIsLoading) return <LoadingPage />;
  if (periodIsError || applicantIsError) return <ErrorPage />;

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
      <div className="flex flex-col items-center justify-center h-full gap-5 px-5 py-10 md:px-40 lg:px-80 dark:text-white">
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
        {!isApplicationPeriodOver && (
          <Button
            title="Trekk tilbake søknad"
            color="white"
            onClick={handleDeleteApplication}
          />
        )}
        {applicantData.application && (
          <div className="w-full max-w-md">
            <ApplicantCard
              applicant={applicantData.application}
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
        <PageTitle
          boldMainTitle={period?.name}
          subTitle={formatDateNorwegian(period?.applicationPeriod.end) || ""}
          boldSubTitle="Søknadsfrist"
        />
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
