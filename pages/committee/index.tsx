import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Table from "../../components/Table";
import { formatDate } from "../../lib/utils/dateUtils";
import { periodType } from "../../lib/types/types";
import LoadingPage from "../../components/LoadingPage";
import { useQuery } from "@tanstack/react-query";
import { fetchPeriods } from "../../lib/api/periodApi";
import ErrorPage from "../../components/ErrorPage";

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [periods, setPeriods] = useState([]);

  const {
    data: periodsData,
    isError: periodsIsError,
    isLoading: periodsIsLoading,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: fetchPeriods,
  });

  useEffect(() => {
    if (!periodsData) return;

    const userCommittees = session?.user?.committees || [];

    // Viser bare aktuelle perioder
    const filteredPeriods = periodsData.periods.filter((period: periodType) =>
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
  }, [periodsData, session]);

  const periodsColumns = [
    { label: "Navn", field: "name" },
    { label: "Søknad", field: "application" },
    { label: "Intervju", field: "interview" },
  ];

  if (!session || !session.user?.isCommittee) return <p>Ingen tilgang!</p>;
  if (periodsIsLoading) return <LoadingPage />;
  if (periodsIsError) return <ErrorPage />;

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
