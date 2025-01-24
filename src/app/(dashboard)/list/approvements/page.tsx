import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role as host } from "@/lib/data";
import Image from "next/image";
import { FilterPopover } from "@/components/filter";
import { ITEM_PER_PAGE } from "@/lib/setting";
import prisma from "../../../../../prisma";
import { Prisma } from "@prisma/client";

const filterGroups = [
  {
    title: "Role",
    options: [
      { label: "Student", value: "student", default: "student" },
      { label: "Teacher", value: "teacher" },
      { label: "Parent", value: "parent" },
      { label: "Admin", value: "admin" },
    ],
  },
  {
    title: "Status",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "accepted" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
];



const ApprovementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query:
    | Prisma.StudentWhereInput
    | Prisma.ParentWhereInput
    | Prisma.AdminWhereInput
    | Prisma.TeacherWhereInput = {};
  const role = (queryParams.role || "student") as
    | "student"
    | "teacher"
    | "parent"
    | "admin";
  console.log(role);
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        // case "status":
        //   query.status = value;
        //   break;
        case "search":
          query.OR = [
            { name: { contains: value, mode: "insensitive" } },
            {
              class: {
                name: { contains: value, mode: "insensitive" },
              },
            },
          ];
          break;
        default:
          break;
      }
    }
  }

  const include = (() => {
    switch (role) {
      case "student":
        return { class: { select: { name: true } } };
      case "teacher":
        return { subjects: { select: { name: true } } };
      case "parent":
        return { students: { select: { name: true } } };
      default:
        return {};
    }
  })();

  const [data, count] = await prisma.$transaction([
    (prisma[role] as any).findMany({
      where: query,
      include,
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    (prisma[role] as any).count({ where: query }),
  ]);
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    ...(role === "admin"
      ? []
      : [
          {
            header:
              role === "student"
                ? "Class"
                : role === "teacher"
                ? "Subjects"
                : "Students",
            accessor:
              role === "student"
                ? "class.name"
                : role === "teacher"
                ? "subjects.name"
                : "students.name",
          },
        ]),
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
    ...(host === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
            className: "flex justify-center",
          },
        ]
      : []),
  ];
  const renderRow = (item: any) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 text-xs md:text-sm md:p-4 p-2 md:px-2 ">
        {item.name}
      </td>
      {role !== "admin" && (
        <td className="text-xs md:text-sm">
          {item?.class?.name ||
            item.subjects?.map((item: any) => item.name).join(", ") ||
            item.students?.map((item: any) => item.name).join(", ")}
        </td>
      )}
      <td className="hidden md:table-cell text-xs p-2">
        {new Intl.DateTimeFormat("en-US").format(
          new Date(item.createdAt || Date.now())
        )}
      </td>
      <td className="hidden md:table-cell text-xs p-2">{item.approved}</td>
      <td>
        <div className="flex items-center gap-2 justify-center flex-col md:flex-row">
          {item.approved === "PENDING" && (
            <>
              <button className="bg-green-500 w-[60px] md:w-[75px] text-[11px] md:text-sm text-white px-2 py-1 rounded">
                Approve
              </button>
              <button className="bg-red-500 w-[60px] md:w-[75px] text-[11px] md:text-sm text-white px-2 py-1 rounded">
                Cancel
              </button>
            </>
          )}
          {item.approved === "ACCEPTED" && (
            <Image
              src="/approvement2.png"
              width={20}
              height={20}
              alt="checkmark"
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Approvals</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Approvals
            </h1>
            <div className="flex items-center gap-4 self-end">
              <FilterPopover filterGroups={filterGroups} />
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
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

export default ApprovementListPage;
