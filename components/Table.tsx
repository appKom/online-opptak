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
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className="px-6 py-4 font-medium text-gray-900"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {rows.map((row) => (
            <Link key={"link-" + row.id} href={row.link || ""}>
              <tr
                key={"tr-" + row.id}
                className="relative hover:bg-gray-50 cursor-pointer"
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
