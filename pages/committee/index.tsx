import type { NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "../404";
import CommitteeTimesPage from "./committe-times-page";
import { CheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Tabs } from "../../components/Tabs";
import CommitteeApplicants from "./committe-applicants";

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(0);

  if (!session || !session.user?.isCommitee) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col items-center">
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        content={[
          {
            title: "Søkere",
            icon: <CheckIcon className="w-5 h-5" />,
            content: (
              <>
                <CommitteeApplicants />
              </>
            ),
          },
          {
            title: "Intervjutider",
            icon: <CalendarIcon className="w-5 h-5" />,
            content: (
              <>
                <CommitteeTimesPage />
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Committee;
