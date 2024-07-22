import Button from "./Button";
import { FaTrash } from "react-icons/fa";

interface Props {
  period: any;
  onDelete?: (id: string, name: string) => void;
}

const TableCard = ({ period, onDelete }: Props) => (
  <div className="px-10">
    <div className="flex flex-col justify-between h-full p-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div>
        <div className="flex flex-row justify-between pb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-online-snowWhite">
            {period.name}
          </h3>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                period.link && onDelete(period.id, period.name);
              }}
              className="text-black dark:text-white hover:text-red-700 hover:text-lg"
            >
              <FaTrash />
            </button>
          )}
        </div>

        <p className="w-full mt-1 text-gray-500 dark:text-gray-200">
          {period.description}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
          Søknadsperiode: {period.application}
        </p>
        <p className="pb-4 mt-1 text-sm text-gray-500 dark:text-gray-200">
          Intervjuperiode: {period.interview}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          title={"Se opptak"}
          size="small"
          color="white"
          href={period.link}
        />
      </div>
    </div>
  </div>
);

export default TableCard;
