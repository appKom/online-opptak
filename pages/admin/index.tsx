import { useSession } from "next-auth/react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { periodType } from "../../lib/types/types";
import { formatDate } from "../../lib/utils/dateUtils";
import NotFound from "../404";

const Admin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [periods, setPeriods] = useState([]);

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/periods");
      const data = await response.json();
      setPeriods(
        data.periods.map((period: periodType) => {
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
            link: `/admin/${period._id}`,
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

  if (!session || session.user?.role !== "admin") {
    return <NotFound />;
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-5">
        <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue">
          Opptaksperioder
        </h1>

        <div className="pb-10">
          <Button
            title="Ny opptaksperiode"
            color="blue"
            onClick={() => router.push("/admin/new-period")}
          />
        </div>

        {periods.length > 0 && (
          <Table columns={periodsColumns} rows={periods} />
        )}
      </div>
    </div>
  );
};

export default Admin;
