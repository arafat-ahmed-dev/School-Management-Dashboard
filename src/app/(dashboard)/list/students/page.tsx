import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { Class, Grade, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import prisma from "../../../../../prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";

type StudnetList = Student & { class: Class } & { grade: Grade };

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "p-2",
  },
  {
    header: "Student ID",
    accessor: "teacherId",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Grade",
    accessor: "subjects",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden md:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
      {
        header: "Actions",
        accessor: "action",
        className: "flex justify-center table-cell ",
      },
    ]
    : []),
];

const renderRow = (item: StudnetList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 p-4 px-2">
      <Image
        src="/noAvatar.png"
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full object-cover md:hidden xl:block"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.class.name}</p>
      </div>
    </td>
    <td className="hidden p-2 md:table-cell">{item.id.substring(10)}</td>
    <td className="hidden p-2 md:table-cell">{item.grade?.level ?? "N/A"}</td>
    <td className="hidden p-2 md:table-cell">{item.phone}</td>
    <td className="hidden p-2 md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center justify-center  gap-2">
        <Link href={`/list/students/${item.id}`}>
          <button className="flex size-7 items-center justify-center rounded-full bg-aamSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <>
            <FormModel table="student" type="update" data={item} id={item.id.toString()} />
            <FormModel table="student" type="delete" id={item.id.toString()} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.StudentWhereInput = {
    approved: "ACCEPTED", // Add this line to filter accepted students
  };

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "teacherId":
          query.class = {
            lessons: {
              some: {
                teacherId: value,
              },
            },
          };
          break;
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

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
        grade: true, // Ensure grade is included in the query
      },

      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        name: "asc", // Sort by className in ascending order
      },
    }),
    prisma.student.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Students</h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Students
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModel table="student" type="create" />}
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table
        columns={columns}
        renderRow={renderRow}
        data={data}
        teacher={true}
      />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentListPage;
