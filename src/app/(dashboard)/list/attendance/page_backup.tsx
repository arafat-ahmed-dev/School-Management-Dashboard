import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import prisma from "../../../../../prisma";
import { Attendance, Prisma } from "@prisma/client";

type AttendanceList = Attendance & {
  student: { name: string; class: { name: string } };
};

const getColumns = (role: string) => [
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
        className: "text-center table-cell",
      },
    ]
    : []),
];

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get user session for role-based access
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "guest";

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.AttendanceWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.OR = [
            { student: { name: { contains: value, mode: "insensitive" } } },
            {
              student: {
                class: { name: { contains: value, mode: "insensitive" } },
              },
            },
          ];
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        lesson: {
          select: {
            id: true,
            name: true,
            subject: { select: { name: true } },
            class: { select: { name: true } }
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        date: "desc",
      },
    }),
    prisma.attendance.count({ where: query }),
  ]);

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
        {item.present ? "Present" : "Absent"}
      </td>
      <td>
        <div className="flex w-fit items-center justify-center gap-2">
          {role === "admin" && (
            <>
              <FormModel table="attendance" type="update" data={item} id={item.id} />
              <FormModel
                table="attendance"
                type="delete"
                id={item.id.toString()}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          All Attendance
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Attendance
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
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
      <Table columns={getColumns(role)} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
