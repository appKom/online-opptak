import type { NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import CommitteeInterViewTimes from "../../components/committee/CommitteeInterviewTimes";
import CommitteeApplicants from "../../components/committee/CommitteApplicants";

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(0);

  if (!session || !session.user?.isCommitee) {
    return <p>Ingen tilgang!</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <CommitteeApplicants routeString={"/committee/applications/"} />
    </div>
  );
};

export default Committee;
