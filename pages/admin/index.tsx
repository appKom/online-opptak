import { useSession } from "next-auth/react";
import Table, { RowType } from "../../components/Table";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { periodType } from "../../lib/types/types";
import { formatDate } from "../../lib/utils/dateUtils";
import NotFound from "../404";

const Admin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [periods, setPeriods] = useState<RowType[]>([]);

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/periods");
      const data = await response.json();
      setPeriods(
        data.periods.map((period: periodType) => {
          return {
            id: period._id,
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

  const deletePeriod = async (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Er det sikker på at du ønsker å slette ${name}?`
    );
    if (!isConfirmed) return;

    try {
      await fetch(`/api/periods/${id}`, {
        method: "DELETE",
      });
      setPeriods(periods.filter((period) => period.id !== id));
    } catch (error) {
      console.error("Failed to delete period:", error);
    }
  };

  const periodsColumns = [
    { label: "Navn", field: "name" },
    { label: "Forberedelse", field: "preparation" },
    { label: "Søknad", field: "application" },
    { label: "Intervju", field: "interview" },
    { label: "Delete", field: "delete" },
  ];

  if (!session || session.user?.role !== "admin") {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <h1 className="my-10 text-3xl font-semibold text-center dark:text-gray-200 text-online-darkBlue">
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
        <Table
          columns={periodsColumns}
          rows={periods}
          onDelete={deletePeriod}
        />
      )}
    </div>
  );
};

export default Admin;
