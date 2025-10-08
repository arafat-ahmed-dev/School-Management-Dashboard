import React from "react";

const Table = ({
  columns,
  renderRow,
  data,
  teacher,
  role = "admin",
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
  teacher?: boolean;
  role?: string;
}) => {
  // Filter out the "action" column for non-admin/teacher roles
  const filteredColumns = columns.filter((col) => {
    if (col.accessor === "action") {
      return role === "admin" || teacher === true;
    }
    return true; // Keep all other columns
  });

  return (
    <table className="mt-4 w-full">
      <thead>
        <tr className="text-left text-sm text-gray-500">
          {filteredColumns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody >{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};

export default Table;
