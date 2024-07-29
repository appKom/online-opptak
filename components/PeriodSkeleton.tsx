export const PeriodSkeleton = () => {
  return (
    <div className="w-full max-w-md p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700 ">
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    </div>
  );
};

export const PeriodSkeletonPage = () => {
  return (
    <div className="flex flex-col justify-between overflow-x-hidden text-online-darkBlue dark:text-white">
      <div className="flex flex-col items-center justify-center gap-5 px-5 my-10">
        <div className="flex flex-col gap-10">
          <h3 className="text-4xl font-bold tracking-tight text-center dark:text-white">
            Nåværende opptaksperioder
          </h3>
          <div className="flex flex-col items-center max-w-full gap-5">
            <PeriodSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};
