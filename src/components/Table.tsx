// import { useAppSelector } from "@/lib/store/hooks";
// import _ from "lodash";

import { role } from "@/lib/data";

// const response = useAppSelector((state) => state.auth.userData?.userRole);
// const role = _.toLower(response);

const Table = ({
  columns,
  renderRow,
  data,
  teacher,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
  teacher?: boolean;
}) => {
  // Filter out the "action" column for non-admin/teacher roles
  const filteredColumns = columns.filter((col) => {
    if (col.accessor === "action") {
      return role === "admin" || teacher === true;
    }
    return true; // Keep all other columns
  });

  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
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
