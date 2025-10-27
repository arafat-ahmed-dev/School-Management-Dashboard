import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma, Subject, Teacher } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

type SubjectList = Subject & {
  teachers: Teacher[];
  classes: { name: string }[];
};

const getColumns = (role: string) => [
  {
    header: "Subject Info",
    accessor: "subjectName",
    className: "p-2",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden lg:table-cell p-2",
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

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get user session for role-based access
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "guest";

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.SubjectWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.OR = [
            { name: { contains: value, mode: "insensitive" } },
            {
              teachers: {
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
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.subject.count({ where: query }),
  ]);

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">Code: {item.code}</p>
        </div>
      </td>
      <td className="hidden p-2 md:table-cell">
        {item.teachers.map((teacher) => teacher.name).join(", ") || "No teachers assigned"}
      </td>
      <td className="hidden p-2 lg:table-cell">
        {item.classes.map((cls) => cls.name).join(", ") || "No classes assigned"}
      </td>
      <td>
        <div className="flex w-fit gap-2">
          {role === "admin" && (
            <>
              <FormModel table="subject" type="update" data={item} id={item.id.toString()} />
              <FormModel table="subject" type="delete" id={item.id.toString()} />
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
        <h1 className="hidden text-lg font-semibold md:block">All Subjects</h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Subjects
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModel table="subject" type="create" />}
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

export default SubjectListPage;
