import FormModel from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getCurrentRole } from "@/lib/session-utils";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import prisma from "../../../../../prisma";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/setting";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = await getCurrentRole();

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
          className: "text-center table-cell",
        },
      ]
      : []),
  ];

  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">
        <Image
          src={item.img || "/default-profile.png"}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full object-cover md:hidden xl:block"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden p-2 md:table-cell">{item.id.substring(10)}</td>
      <td className="hidden p-2 md:table-cell">
        {item.subjects.map((item) => item.subjectId).join(", ")}
      </td>
      <td className="hidden p-2 md:table-cell">
        {item.classes.map((item) => item.name).join(", ")}
      </td>
      <td className="hidden p-2 lg:table-cell">{item.phone}</td>
      <td className="hidden p-2 lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center justify-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="flex size-7 items-center justify-center rounded-full bg-aamSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModel table="teacher" type="update" data={item} id={parseInt(item.id)} />
              <FormModel table="teacher" type="delete" id={parseInt(item.id)} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.TeacherWhereInput = {
    approved: "ACCEPTED", // Add this line to filter accepted students
  };

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
  console.log(data);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Teachers</h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Teachers
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
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
        role={role}
      />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
