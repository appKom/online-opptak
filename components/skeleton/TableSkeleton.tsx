import React from "react";

type ColumnType = {
  label: string;
  field: string;
};
interface Props {
  columns: ColumnType[];
}

export const TableSkeleton = ({ columns }: Props) => {
  return (
    <>
      <div className=" hidden overflow-auto border border-gray-200 rounded-lg shadow-md md:flex dark:border-gray-700">
        <table className="w-full text-gray-500 border-collapse dark:bg-online-darkBlue dark:text-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.label}
                  className="px-4 py-2 text-xs font-medium text-gray-900 dark:text-gray-200 sm:px-6 sm:py-4 sm:text-sm"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-t border-gray-100 dark:border-0">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <tr
                  key={"tr-" + index}
                  className="relative cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-900 dark:border-gray-700"
                >
                  {columns.map((column) => (
                    <td
                      key={"td-" + index + "-" + column.field}
                      className={`px-4 py-2 text-xs sm:px-6 sm:py-4 sm:text-sm`}
                    >
                      <div className="h-5 w-36 bg-gray-200 rounded-full dark:bg-gray-700 shadow animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="pt-6 px-5">
        <div className="md:hidden w-full max-w-md p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700 ">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
      </div>
    </>
  );
};
