import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSessionData } from "@/lib/session-utils";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { Attendance, Prisma } from "@prisma/client";

type AttendanceList = Attendance & {
  student: { name: string; class: { name: string } };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get current user session for security
  const { userRole, userId } = await getSessionData();
  const role = userRole || "admin";

  // Define columns based on user role
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
    ...(role === "admin" || role === "teacher"
      ? [
        {
          header: "Actions",
          accessor: "action",
          className: "text-center table-cell",
        },
      ]
      : []),
  ];

  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">{item.student?.name}</td>
      <td className="capitalize">{item.student?.class?.name}</td>
      <td className="hidden p-2 md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td className="hidden p-2 md:table-cell">
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            item.present
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModel table="attendance" type="update" data={item} id={item.id} />
              <FormModel table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.AttendanceWhereInput = {};

  // Apply role-based filtering
  if (role === "student") {
    // Students can only see their own attendance
    query.studentId = userId || "";
  } else if (role === "parent") {
    // Parents can only see their children's attendance
    const parent = await prisma.parent.findUnique({
      where: { id: userId || "" },
      include: { students: { select: { id: true } } },
    });
    if (parent?.students.length) {
      const studentIds = parent.students.map(s => s.id);
      query.studentId = { in: studentIds };
    }
  }
  // Teachers and admins can see all attendance records

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.student = {
            name: { contains: value, mode: "insensitive" },
          };
          break;
        case "classId":
          query.student = {
            classId: value,
          };
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await Promise.all([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          include: {
            class: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        date: "desc",
      },
    }),
    prisma.attendance.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          {role === "student" ? "My Attendance" : 
           role === "parent" ? "Children's Attendance" : 
           "All Attendance"}
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              {role === "student" ? "My Attendance" : 
               role === "parent" ? "Children's Attendance" : 
               "All Attendance"}
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {(role === "admin" || role === "teacher") && (
                <FormModel table="attendance" type="create" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;