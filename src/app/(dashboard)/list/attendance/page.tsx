import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { attendanceData, role } from "@/lib/data";
import { useAppSelector } from "@/lib/store/hooks";
import _ from "lodash";
import Image from "next/image";

type Attendance = {
  id: number;
  name: string;
  class: string;
  date: string;
  status: string;
};
  // const response = useAppSelector((state) => state.auth.userData?.userRole);
  // const role = _.toLower(response);
const columns = [
  {
    header: "Student Name",
    accessor: "student",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden md:table-cell p-2",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const AttendanceListPage = () => {
  const renderRow = (item: Attendance) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">{item.name}</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell p-2">{item.date}</td>
      <td className="hidden md:table-cell p-2">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModel table="attendance" type="update" />
              <FormModel table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Attendance
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Attendance
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && (
                <FormModel table="attendance" type="create" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={attendanceData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AttendanceListPage;
