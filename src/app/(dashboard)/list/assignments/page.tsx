import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";

type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Due Date",
    accessor: "dueDate",
    className: "hidden md:table-cell p-2",
  },
  ...(role === "admin" || role === "teacher"
    ? [
      {
        header: "Actions",
        accessor: "action",
        className: "table-cell",
      },
    ]
    : []),
];
const renderRow = (item: AssignmentList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 p-4 px-2">
      {item.lesson.subject.name}
    </td>
    <td className="capitalize">{item.lesson.class.name}</td>
    <td className="hidden md:table-cell p-2">{item.lesson.teacher.name}</td>
    <td className="hidden md:table-cell p-2">
      {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
    </td>
    <td>
      <div className="flex items-center gap-2 w-fit justify-center">
        {role === "admin" && (
          <>
            <FormModel table="assignment" type="update" />
            <FormModel
              table="assignment"
              type="delete"
              id={item.id.toString()}
            />
          </>
        )}
      </div>
    </td>
  </tr>
);

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.AssignmentWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "teacherId":
          query.lesson = {
            teacherId: value,
          };
          break;
        case "classId":
          query.lesson = {
            classId: value,
          };
          break;
        case "search":
          query.lesson = {
            OR: [
              {
                subject: { name: { contains: value, mode: "insensitive" } },
              },
              {
                teacher: { name: { contains: value, mode: "insensitive" } },
              },
              { class: { name: { contains: value, mode: "insensitive" } } },
            ],
          };
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: true,
            teacher: true,
            class: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        dueDate: "asc",
      },
    }),
    prisma.assignment.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Assignments
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {(role === "admin" || role === "teacher") && (
                <FormModel table="assignment" type="create" />
              )}
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

export default AssignmentListPage;
