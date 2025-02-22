import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma, Lesson, Subject, Class, Teacher } from "@prisma/client";

type LessonList = Lesson & { subject: Subject[] } & { class: Class } & {
  teacher: Teacher;
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
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
          className: "table-cell",
        },
      ]
    : []),
];
const renderRow = (item: LessonList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 p-4 px-2">{item.name}</td>
    <td className="capitalize">{item.class.name}</td>
    <td className="hidden md:table-cell p-2">{item.teacher.name}</td>
    <td>
      <div className="flex items-center gap-2 w-fit justify-center">
        {role === "admin" && (
          <>
            <FormModel table="lesson" type="update" />
            <FormModel table="lesson" type="delete" id={parseInt(item.id)} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.LessonWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "classId":
          query.classId = {
            equals: value, // Use `equals` for ObjectId fields
          };
          break;
        case "teacherId":
          query.teacherId = {
            equals: value, // Use `equals` for ObjectId fields
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
    prisma.lesson.findMany({
      where: query,
      include: {
        class: true,
        subject: true,
        teacher: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        name: "asc", // Sort by className in ascending order
      },
    }),
    prisma.lesson.count({ where: query }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Lessons
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModel table="lesson" type="create" />}
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

export default LessonListPage;
