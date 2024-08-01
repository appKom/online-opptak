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
import {
  DeepPartial,
  applicationType,
  periodType,
} from "../../lib/types/types";
import { useRouter } from "next/router";
import Schedule from "../../components/committee/Schedule";
import { validateApplication } from "../../lib/utils/validateApplication";
import ApplicationCard from "../../components/applicationoverview/ApplicationCard";
import LoadingPage from "../../components/LoadingPage";
import { formatDateNorwegian } from "../../lib/utils/dateUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPeriodById } from "../../lib/api/periodApi";
import {
  createApplication,
  deleteApplication,
  fetchApplicationByPeriodAndId,
} from "../../lib/api/applicationApi";
import ErrorPage from "../../components/ErrorPage";
import { MainTitle, SimpleTitle } from "../../components/Typography";

const Application: NextPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const applicationId = session?.user?.owId;

  const [activeTab, setActiveTab] = useState(0);
  const [inputApplicationData, setInputApplicationData] = useState<
    DeepPartial<applicationType>
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
    data: applicationData,
    isError: applicationIsError,
    isLoading: applicationIsLoading,
  } = useQuery({
    queryKey: ["application", periodId, applicationId],
    queryFn: fetchApplicationByPeriodAndId,
  });

  const createApplicationMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.setQueryData(["application", periodId, applicationId], {
        application: inputApplicationData,
        exists: true,
      });
      toast.success("Søknad sendt inn");
    },
    onError: (error) => {
      if (error.message === "409 Application already exists for this period") {
        toast.error("Du har allerede søkt for denne perioden");
      } else {
        toast.error("Det skjedde en feil, vennligst prøv igjen");
      }
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.setQueryData(["application", periodId, applicationId], null);
      toast.success("Søknad trukket tilbake");
      setActiveTab(0);
    },
    onError: () => toast.error("Det skjedde en feil, vennligst prøv igjen"),
  });

  useEffect(() => {
    if (!periodData || !periodData.period) return;

    setPeriod(periodData.period);

    const currentDate = new Date().toISOString();
    if (
      new Date(periodData.period.applicationPeriod.end) < new Date(currentDate)
    ) {
      setIsApplicationPeriodOver(true);
    }
  }, [periodData]);

  const handleSubmitApplication = async () => {
    if (!validateApplication(inputApplicationData)) return;
    inputApplicationData.periodId = periodId as string;
    createApplicationMutation.mutate(inputApplicationData as applicationType);
  };

  const handleDeleteApplication = async () => {
    if (!session?.user?.owId) {
      toast.error("User ID not found");
      return;
    }

    if (!confirm("Er du sikker på at du vil trekke tilbake søknaden?")) return;

    deleteApplicationMutation.mutate({ periodId, owId: session?.user?.owId });
  };

  if (
    periodIsLoading ||
    applicationIsLoading ||
    createApplicationMutation.isPending ||
    deleteApplicationMutation.isPending
  )
    return <LoadingPage />;
  if (periodIsError || applicationIsError) return <ErrorPage />;

  if (!periodData?.exists)
    return <SimpleTitle title="Opptaket finnes ikke" size="large" />;

  if (applicationData?.exists)
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
        {applicationData?.application && (
          <div className="w-full max-w-md">
            <ApplicationCard
              application={applicationData.application}
              includePreferences={true}
            />
          </div>
        )}
      </div>
    );

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <MainTitle
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
                    applicationData={inputApplicationData}
                    setApplicationData={setInputApplicationData}
                    availableCommittees={period?.committees || []}
                    optionalCommittees={period?.optionalCommittees || []}
                  />
                  <div className="flex justify-center w-full">
                    <Button
                      title="Videre"
                      color="blue"
                      onClick={() => {
                        if (!validateApplication(inputApplicationData)) return;
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
                    setApplicationData={setInputApplicationData}
                    applicationData={inputApplicationData}
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
