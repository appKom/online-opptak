import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Table from "../../components/Table";
import { formatDate } from "../../lib/utils/dateUtils";
import { periodType } from "../../lib/types/types";
import LoadingPage from "../../components/LoadingPage";

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/periods");
      const data = await response.json();
      const userCommittees = session?.user?.committees || [];

      // Viser bare aktuelle perioder
      const filteredPeriods = data.periods.filter((period: periodType) =>
        period.committees.some((committee: string) =>
          userCommittees.includes(committee.toLowerCase())
        )
      );

      setPeriods(
        filteredPeriods.map((period: periodType) => {
          const userCommittees = session?.user?.committees?.map((committee) =>
            committee.toLowerCase()
          );
          const periodCommittees = period.committees.map((committee) =>
            committee.toLowerCase()
          );

          period.optionalCommittees.forEach((committee) => {
            periodCommittees.push(committee.toLowerCase());
          });

          const commonCommittees = userCommittees!.filter((committee) =>
            periodCommittees.includes(committee)
          );

          let uriLink = "";

          if (commonCommittees.length > 1) {
            uriLink = `committee/${period._id}`;
          } else {
            uriLink = `committee/${period._id}/${commonCommittees[0]}`;
          }

          return {
            name: period.name,
            application:
              formatDate(period.applicationPeriod.start) +
              " til " +
              formatDate(period.applicationPeriod.end),
            interview:
              formatDate(period.interviewPeriod.start) +
              " til " +
              formatDate(period.interviewPeriod.end),
            committees: period.committees,
            link: uriLink,
          };
        })
      );
    } catch (error) {
      console.error("Failed to fetch application periods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const periodsColumns = [
    { label: "Navn", field: "name" },
    { label: "Søknad", field: "application" },
    { label: "Intervju", field: "interview" },
  ];

  if (!session || !session.user?.isCommitee) {
    return <p>Ingen tilgang!</p>;
  }

  if (isLoading) {
    return <LoadingPage />;
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

export default Committee;
