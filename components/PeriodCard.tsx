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
    <div className="relative w-full max-w-md mx-auto break-words border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div className="flex flex-col justify-between h-full p-4">
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-online-snowWhite">
            {period.name}
          </h3>
          <p className="w-full mt-1 text-gray-500 dark:text-gray-200">
            {period.description}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
            Søknadsperiode:{" "}
            {formatDateNorwegian(period.applicationPeriod.start)} -{" "}
            {formatDateNorwegian(period.applicationPeriod.end)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
            Intervjuperiode: {formatDateNorwegian(period.interviewPeriod.start)}{" "}
            - {formatDateNorwegian(period.interviewPeriod.end)}
          </p>
        </div>
        {hasApplied && (
          <span className="absolute flex items-center justify-center gap-2 px-3 py-1 text-green-600 bg-green-100 rounded-full top-4 right-4 dark:bg-green-800 shrink-0 dark:text-green-300">
            Søkt
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
        )}
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
