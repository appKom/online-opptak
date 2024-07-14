import Link from "next/link";
import TableCard from "./TableCard";
import { FaTrash } from "react-icons/fa";
import React from "react";

type ColumnType = {
  label: string;
  field: string;
};

export type RowType = {
  id: string;
  link?: string;
  [key: string]: any;
};

interface TableProps {
  columns: ColumnType[];
  rows: RowType[];
  onDelete?: (id: string, name: string) => void;
}

const Table = ({ rows, columns, onDelete }: TableProps) => {
  return (
    <div className="">
      <div className="hidden md:flex overflow-auto border border-gray-200 rounded-lg shadow-md dark:border-gray-700">
        <table className="w-full text-gray-500 border-collapse dark:bg-online-darkBlue dark:text-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <React.Fragment key={column.label}>
                  {column.label !== "Delete" ? (
                    <th className="px-4 py-2 text-xs font-medium text-gray-900 dark:text-gray-200 sm:px-6 sm:py-4 sm:text-sm">
                      {column.label}
                    </th>
                  ) : (
                    <div className="px-10 py-2"></div>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="border-t border-gray-100 dark:border-0">
            {rows.map((row) => (
              <tr
                key={"tr-" + row.id}
                className="relative cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-900 dark:border-gray-700"
              >
                {columns.map((column) => (
                  <td
                    key={row.id + "-" + column.field}
                    className={`px-4 py-2 text-xs ${
                      columns.indexOf(column) === 0 ? "font-medium" : ""
                    } sm:px-6 sm:py-4 sm:text-sm`}
                  >
                    {column.field === "delete" && onDelete ? (
                      <div className="flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            row.link && onDelete(row.id, row.name);
                          }}
                          className="text-black dark:text-white hover:text-red-700 hover:text-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      <Link href={row.link || ""}>{row[column.field]}</Link>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col space-y-4">
        {rows.map((row) => (
          <TableCard key={row.id} period={row} />
        ))}
      </div>
    </div>
  );
};

export default Table;
