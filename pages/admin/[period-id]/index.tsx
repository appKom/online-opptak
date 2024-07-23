import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";
import { applicantType, periodType } from "../../../lib/types/types";
import NotFound from "../../404";
import ApplicantsOverview from "../../../components/applicantoverview/ApplicantsOverview";
import { Tabs } from "../../../components/Tabs";
import { CalendarIcon, InboxIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";
import { sendOutInterviewTimes } from "../../../lib/utils/sendInterviewTimes/sendInterviewTimes";

const Admin = () => {
  const { data: session } = useSession();
  const periodId = router.query["period-id"] as string;
  const [period, setPeriod] = useState<periodType | null>(null);
  const [committees, setCommittees] = useState<string[] | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabClicked, setTabClicked] = useState<number>(0);

  useEffect(() => {
    const fetchPeriod = async () => {
      if (!session || session.user?.role !== "admin") {
        return;
      }
      if (periodId === undefined) return;

      try {
        const response = await fetch(`/api/periods/${periodId}`);
        const data = await response.json();
        if (response.ok) {
          setPeriod(data.period);
          setCommittees(data.period.committees);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking period:", error);
      } finally {
      }
    };

    fetchPeriod();
  }, [session?.user?.owId, periodId]);

  if (!session || session.user?.role !== "admin") {
    return <NotFound />;
  }

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
