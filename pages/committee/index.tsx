import type { NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import CommitteeInterViewTimes from "../../components/committee/Committee-Interview-Times";
import {
  CheckIcon,
  CalendarIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { Tabs } from "../../components/Tabs";
import CommitteeApplicants from "../../components/committee/committe-applicants";
import CommitteeInterviewPeriod from "../../components/committee/committee-interview-period";

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(0);

  if (!session || !session.user?.isCommitee) {
    return <p>Ingen tilgang!</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        content={[
          {
            title: "Intervjutider",
            icon: <CalendarIcon className="w-5 h-5" />,
            content: (
              <>
                <CommitteeInterViewTimes />
              </>
            ),
          },
          {
            title: "Søkere",
            icon: <CheckIcon className="w-5 h-5" />,
            content: (
              <>
                <CommitteeApplicants routeString={"/committee/applications/"} />
              </>
            ),
          },
          {
            title: "Intervju",
            icon: <CheckIcon className="w-5 h-5" />,
            content: (
              <>
                <CommitteeInterviewPeriod />
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Committee;
