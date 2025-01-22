import FormModel from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import prisma from "../../../../../prisma";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/setting";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Supervisors",
    accessor: "supervisors",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 p-4 px-2">
      <Image
        src={"/noAvatar.png"}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell p-2">{item.id.substring(10)}</td>
    <td className="hidden md:table-cell p-2">
      {item.subjects.map((item) => item.name).join(", ")}
    </td>
    <td className="hidden md:table-cell p-2">
      {item.classes.map((item) => item.name).join(", ")}
    </td>
    <td className="hidden lg:table-cell p-2">{item.phone}</td>
    <td className="hidden lg:table-cell p-2">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-aamSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <FormModel table="teacher" type="delete" id={parseInt(item.id)} />
        )}
      </div>
    </td>
  </tr>
);
const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.TeacherWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "classId":
          query.lessons = {
            some: { classId: value },
          };
          break;
        case "search":
          query.OR = [
            { name: { contains: value, mode: "insensitive" } },
            {
              subjects: {
                some: { name: { contains: value, mode: "insensitive" } },
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
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true, // Keep this if subjects relation exists
        classes: true, // Keep this if classes relation exists
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Teachers
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModel table="teacher" type="create" />}
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

export default TeacherListPage;
