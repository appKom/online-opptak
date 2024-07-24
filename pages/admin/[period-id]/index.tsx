import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";
import { periodType } from "../../../lib/types/types";
import NotFound from "../../404";
import ApplicantsOverview from "../../../components/applicantoverview/ApplicantsOverview";
import { Tabs } from "../../../components/Tabs";
import { CalendarIcon, InboxIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";
import { sendOutInterviewTimes } from "../../../lib/utils/sendInterviewTimes/sendInterviewTimes";
import { useQuery } from "@tanstack/react-query";
import { fetchPeriodById } from "../../../lib/api/periodApi";
import LoadingPage from "../../../components/LoadingPage";
import ErrorPage from "../../../components/ErrorPage";

const Admin = () => {
  const { data: session } = useSession();
  const periodId = router.query["period-id"] as string;
  const [period, setPeriod] = useState<periodType | null>(null);
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabClicked, setTabClicked] = useState<number>(0);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["periods", periodId],
    queryFn: fetchPeriodById,
  });

  useEffect(() => {
    setPeriod(data?.period);
    setCommittees(data?.period.committees);
  }, [data, session?.user?.owId]);

  if (session?.user?.role !== "admin") return <NotFound />;
  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <div className="px-5 py-2">
      <Tabs
        activeTab={activeTab}
        setActiveTab={(index) => {
          setActiveTab(index);
          setTabClicked(index);
        }}
        content={[
          {
            title: "Søkere",
            icon: <CalendarIcon className="w-5 h-5" />,
            content: (
              <ApplicantsOverview
                period={period}
                committees={committees}
                includePreferences={true}
              />
            ),
          },
          {
            title: "Send ut",
            icon: <InboxIcon className="w-5 h-5" />,
            content: (
              <div className="flex flex-col items-center">
                <Button
                  title={"Send ut"}
                  color={"blue"}
                  onClick={() => sendOutInterviewTimes({ periodId })}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Admin;
