import Link from "next/link";
import { useTheme } from "../styles/darkmode/theme-context";

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
  const { theme } = useTheme();

  return (
    <div
      className={`overflow-hidden rounded-lg border shadow-md ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <table
        className={`w-full border-collapse ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-white text-gray-500"
        }`}
      >
        <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={`px-6 py-4 font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`${
            theme === "dark"
              ? "divide-gray-600 border-t border-gray-600"
              : "divide-gray-100 border-t border-gray-100"
          }`}
        >
          {rows.map((row) => (
            <Link key={"link-" + row.id} href={row.link || ""}>
              <tr
                key={"tr-" + row.id}
                className={`relative hover:${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } cursor-pointer`}
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
