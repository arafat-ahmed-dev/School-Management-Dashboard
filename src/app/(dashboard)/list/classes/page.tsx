import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { Prisma, Class, Grade, Teacher } from "@prisma/client";

type ClassList = Class & { grade: Grade } & { supervisor: Teacher }; // Update type to include supervisor

const columns = [
  {
    header: "Class Name",
    accessor: "name",
    className: "p-2",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "p-2",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
          className: "table-cell p-2",
        },
      ]
    : []),
];
const renderRow = (item: ClassList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 p-4 px-2">{item.name}</td>
    <td className="hidden p-2 md:table-cell">{item.capacity}</td>
    <td className="hidden p-2 md:table-cell">{item.grade.level}</td>
    <td className=" p-2">{item.supervisor?.name}</td>
    <td>
      <div className="flex w-fit items-center justify-center gap-2">
        {role === "admin" && (
          <>
            <FormModel table="class" type="update" data={item}/>
            <FormModel table="class" type="delete" id={item.id.toString()} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.ClassWhereInput = {};
  const orderBy: Prisma.ClassOrderByWithRelationInput = { name: "asc" }; // Add sorting by name

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "teacherId":
          query.supervisorId = { equals: value };
          break;
        case "search":
          query.OR = [
            { name: { contains: value, mode: "insensitive" } },
            {
              supervisor: {
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
    prisma.class.findMany({
      where: query,
      include: {
        grade: {
          select: { id: true, level: true },
        }, 
        supervisor: {
          select: { id: true, name: true },
        }, 
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy, // Apply sorting
    }),
    prisma.class.count({ where: query }),
  ]);
  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Classes</h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Classes
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModel table="class" type="create" />}
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

export default ClassListPage;
