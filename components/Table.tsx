import Link from "next/link";
import TableCard from "./TableCard";

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
}

const Table = ({ rows, columns }: TableProps) => {
  return (
    <div className="">
      <div className="hidden md:flex overflow-auto border border-gray-200 rounded-lg shadow-md dark:border-gray-700">
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
            {rows.map((row) => (
              <Link key={"link-" + row.id} href={row.link || ""}>
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
                      {row[column.field]}
                    </td>
                  ))}
                </tr>
              </Link>
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
