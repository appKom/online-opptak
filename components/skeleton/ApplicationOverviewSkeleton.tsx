import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "../../lib/hooks/useTheme";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const ApplicationOverviewSkeleton = () => {
  const theme = useTheme();

  return (
    <SkeletonTheme
      baseColor={theme === "dark" ? "#202020" : "#e0e0e0"}
      highlightColor={theme === "dark" ? "#444" : "#f5f5f5"}
    >
      <div className="flex justify-center w-full px-5">
        <div className="flex flex-col items-center w-full max-w-lg">
          <Skeleton width={200} height={30} className="py-4 mt-5 mb-6" />
          <div className="w-full max-w-lg pt-1 mx-auto mb-5">
            <div className="relative flex flex-row justify-between mb-2 align-end">
              <p className="text-sm text-gray-800 dark:text-gray-300">
                Søk etter navn eller filtrer
              </p>
              <div className="relative flex flex-row gap-2">
                <AdjustmentsHorizontalIcon
                  className={`w-8 h-8 cursor-pointer transition-transform duration-300 transform filter-icon`}
                  onClick={() => {}}
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Ola Nordmann"
              value={""}
              onChange={(e) => {}}
              className="w-full text-black border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="w-full p-4 my-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div
              onClick={() => {}}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <Skeleton width={200} height={24} className="w-full" />
                <Skeleton width={80} height={20} className="w-full" />
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform duration-300 transform`}
              />
            </div>
          </div>
          <div className="w-full p-4 my-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div
              onClick={() => {}}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <Skeleton width={200} height={24} className="w-full" />
                <Skeleton width={80} height={20} className="w-full" />
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform duration-300 transform`}
              />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ApplicationOverviewSkeleton;
