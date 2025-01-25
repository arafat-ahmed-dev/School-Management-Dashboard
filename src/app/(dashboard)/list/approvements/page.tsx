import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role as host } from "@/lib/data";
import Image from "next/image";
import { FilterPopover } from "@/components/filter";
import { ITEM_PER_PAGE } from "@/lib/setting";
import prisma from "../../../../../prisma";
import { Prisma, Approve } from "@prisma/client"; // Updated import
import dynamic from "next/dynamic";
import { Toaster } from "sonner"; // Import Toaster from sonner

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
        case "status":
          (query as any).approved = value.toUpperCase() as Approve;
          break;
        case "search":
          if (role === "student") {
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { class: { name: { contains: value, mode: "insensitive" } } },
            ];
          } else if (role === "teacher") {
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { subjects: { some: { name: { contains: value, mode: "insensitive" } } } },
            ];
          } else if (role === "parent") {
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { students: { some: { name: { contains: value, mode: "insensitive" } } } },
            ];
          } else if (role === "admin") {
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
            ];
          }
          break;
        default:
          break;
      }
    }
  }

  // If no status is specified, get all statuses
  if (!queryParams.status) {
    (query as any).approved = undefined;
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

  const ClientComponent = dynamic(() => import("./ClientComponent"), {
    ssr: false,
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <Toaster /> {/* Add Toaster component */}
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
      <Table columns={columns} renderRow={(item) => (
        <ClientComponent
          item={item}
          role={role}
        />
      )} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ApprovementListPage;
