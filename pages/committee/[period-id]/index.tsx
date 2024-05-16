import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "../../404";

const CommitteeApplicantOverView: NextPage = () => {
  const { data: session } = useSession();

  if (!session || !session.user?.isCommitee) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">Velg opptak</h2>
    </div>
  );
};

export default CommitteeApplicantOverView;
