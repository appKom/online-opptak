import { useRouter } from "next/router";
import { formatDateNorwegian } from "../lib/utils/dateUtils";
import Button from "./Button";

const TableCard = ({ period }: { period: any }) => {
  const router = useRouter();
  const handleButtonOnClick = () => {
    router.push(period.link);
  };

  console.log(period);

  return (
    <div className="flex flex-col justify-between h-full p-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-online-snowWhite">
          {period.name}
        </h3>
        <p className="w-full mt-1 text-gray-500 dark:text-gray-200">
          {period.description}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
          Søknadsperiode: {period.application}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
          Intervjuperiode: {period.interview}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={handleButtonOnClick}
          title={"Se opptak"}
          size="small"
          color="white"
        />
      </div>
    </div>
  );
};

export default TableCard;
