import Link from "next/link";

type ColumnType = {
  label: string;
  field: string;
};

type RowType = {
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
    <div className="overflow-hidden rounded-lg border shadow-md border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-200">
        <thead className="bg-gray-50 dark:bg-online-darkBlue">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className="px-6 py-4 font-medium  text-gray-900 dark:text-gray-200"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-gray-100 border-t border-gray-100 dark:divide-gray-600 dark:border-t border-gray-60">
          {rows.map((row) => (
            <Link key={"link-" + row.id} href={row.link || ""}>
              <tr
                key={"tr-" + row.id}
                className="relative hover: bg-gray-50 dark:bg-online-darkBlue cursor-pointer"
              >
                {columns.map((column) => (
                  <td
                    key={row.id + "-" + column.field}
                    className={`px-6 py-4 ${
                      columns.indexOf(column) === 0 ? "font-medium" : ""
                    }`}
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
  );
};

export default Table;
