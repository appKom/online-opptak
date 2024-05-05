import { useRouter } from "next/router";
import { periodType } from "../lib/types/types";
import { formatDateNorwegian } from "../lib/utils/dateUtils";
import Button from "./Button";

interface Props {
  period: periodType;
}

const PeriodCard = (props: Props) => {
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto break-words bg-white rounded-lg shadow">
      <div className="p-4">
        <h3 className="text-xl font-medium text-gray-900">
          {props.period.name}
        </h3>
        <p className="w-full mt-1 text-gray-500">{props.period.description}</p>
        <p className="mt-1 text-sm text-gray-500">
          Søknadsperiode:{" "}
          {formatDateNorwegian(props.period.applicationPeriod.start)} -{" "}
          {formatDateNorwegian(props.period.applicationPeriod.end)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Intervjuperiode:{" "}
          {formatDateNorwegian(props.period.interviewPeriod.start)} -{" "}
          {formatDateNorwegian(props.period.interviewPeriod.end)}
        </p>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => router.push(`/application/${props.period._id}`)}
            title="Søk nå"
            size="small"
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodCard;
