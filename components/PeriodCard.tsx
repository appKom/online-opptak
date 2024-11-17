import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { periodType } from "../lib/types/types";
import { formatDateNorwegian } from "../lib/utils/dateUtils";
import Button from "./Button";
import CheckIcon from "./icons/icons/CheckIcon";
import { useQuery } from "@tanstack/react-query";
import { fetchApplicantByPeriodAndId } from "../lib/api/applicantApi";
import { PeriodSkeleton } from "./PeriodSkeleton";

interface Props {
  period: periodType;
}

const PeriodCard = ({ period }: Props) => {
  const { data: session } = useSession();
  const [hasApplied, setHasApplied] = useState(false);

  const { data: applicantData, isLoading: applicantIsLoading } = useQuery({
    queryKey: ["applicants", period._id, session?.user?.owId],
    queryFn: fetchApplicantByPeriodAndId,
  });

  useEffect(() => {
    if (applicantData) {
      setHasApplied(applicantData.exists);
    }
  }, [applicantData]);

  if (applicantIsLoading) return <PeriodSkeleton />;

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
            <CheckIcon className="w-3 h-3" />
          </span>
        )}
        <div className="flex justify-center mt-4">
          <Button
            title={hasApplied ? "Se søknad" : "Søk nå"}
            size="small"
            color="white"
            href={`/apply/${period._id}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodCard;
