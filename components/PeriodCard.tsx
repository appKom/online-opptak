import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { periodType } from "../lib/types/types";
import { formatDateNorwegian } from "../lib/utils/dateUtils";
import Button from "./Button";

interface Props {
  period: periodType;
}

const PeriodCard = ({ period }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (session?.user?.owId) {
        const response = await fetch(
          `/api/applicants/${period._id}/${session.user.owId}`
        );
        if (response.ok) {
          const data = await response.json();
          setHasApplied(data.exists);
        }
      }
    };

    if (period._id && session?.user?.owId) {
      checkApplicationStatus();
    }
  }, [period._id, session?.user?.owId]);

  const handleButtonOnClick = () => {
    router.push(`/application/${period._id}`);
  };

  return (
    <div className="w-full max-w-md mx-auto break-words dark:bg-online-darkBlue text-black dark:text-white rounded-lg shadow">
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {period.name}
          </h3>
          <p className="w-full mt-1 text-gray-500 dark:text-gray-400">
            {period.description}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Søknadsperiode:{" "}
            {formatDateNorwegian(period.applicationPeriod.start)} -{" "}
            {formatDateNorwegian(period.applicationPeriod.end)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Intervjuperiode: {formatDateNorwegian(period.interviewPeriod.start)}{" "}
            - {formatDateNorwegian(period.interviewPeriod.end)}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={hasApplied ? handleButtonOnClick : handleButtonOnClick}
            title={hasApplied ? "Se søknad" : "Søk nå"}
            size="small"
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodCard;
