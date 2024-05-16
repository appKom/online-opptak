import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "../404";
import Table from "../../components/Table";
import { formatDate } from "../../lib/utils/dateUtils";
import { periodType } from "../../lib/types/types";

const CommitteeApplicants: NextPage = () => {
  const { data: session } = useSession();
  const [periods, setPeriods] = useState([]);

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/periods");
      const data = await response.json();
      const userCommittees = session?.user?.committees || [];

      //Viser bare aktuelle perioder
      const filteredPeriods = data.periods.filter((period: periodType) =>
        period.committees.some((committee: string) =>
          userCommittees.includes(committee.toLowerCase())
        )
      );
      console.log(userCommittees);

      setPeriods(
        filteredPeriods.map((period: periodType) => {
          return {
            name: period.name,
            preparation:
              formatDate(period.preparationPeriod.start) +
              " til " +
              formatDate(period.preparationPeriod.end),
            application:
              formatDate(period.applicationPeriod.start) +
              " til " +
              formatDate(period.applicationPeriod.end),
            interview:
              formatDate(period.interviewPeriod.start) +
              " til " +
              formatDate(period.interviewPeriod.end),
            committees: period.committees,
            link: `/committee/${period._id}`,
          };
        })
      );
    } catch (error) {
      console.error("Failed to fetch application periods:", error);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const periodsColumns = [
    { label: "Navn", field: "name" },
    { label: "Forberedelse", field: "preparation" },
    { label: "Søknad", field: "application" },
    { label: "Intervju", field: "interview" },
  ];

  if (!session || !session.user?.isCommitee) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">Velg opptak</h2>
      <div className="py-10">
        {periods.length > 0 && (
          <Table columns={periodsColumns} rows={periods} />
        )}
      </div>
    </div>
  );
};

export default CommitteeApplicants;
