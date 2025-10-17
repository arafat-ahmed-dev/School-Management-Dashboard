import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSessionData } from "@/lib/session-utils";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma, Subject, Teacher } from "@prisma/client";

type SubjectList = Subject & {
  teachers: Teacher[];
  classes: { name: string }[];
};

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get current user session for security
  const { userRole, userId } = await getSessionData();
  const role = userRole || "admin";

  const columns = [
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

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">Subject</p>
        </div>
      </td>
      <td className="hidden p-2 md:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.teachers.map((teacher) => (
            <span
              key={teacher.id}
              className="rounded-full bg-aamSkyLight px-2 py-1 text-xs"
            >
              {teacher.name}
            </span>
          ))}
        </div>
      </td>
      <td className="hidden p-2 lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.classes.map((cls, index) => (
            <span
              key={index}
              className="rounded-full bg-aamYellowLight px-2 py-1 text-xs"
            >
              {cls.name}
            </span>
          ))}
        </div>
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {role === "admin" && (
            <>
              <FormModel table="subject" type="update" data={item} id={item.id} />
              <FormModel table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.SubjectWhereInput = {};

  // Apply role-based filtering
  if (role === "student") {
    // Students should only see subjects taught in their class
    const student = await prisma.student.findUnique({
      where: { id: userId || "" },
      select: { classId: true },
    });
    if (student?.classId) {
      query.classes = {
        some: { id: student.classId },
      };
    }
  } else if (role === "parent") {
    // Parents should only see subjects taught in their children's classes
    const parent = await prisma.parent.findUnique({
      where: { id: userId || "" },
      include: { students: { select: { classId: true } } },
    });
    if (parent?.students.length) {
      const classIds = parent.students.map(s => s.classId).filter(Boolean) as string[];
      if (classIds.length > 0) {
        query.classes = {
          some: { id: { in: classIds } },
        };
      }
    }
  } else if (role === "teacher") {
    // Teachers should only see subjects they teach
    query.teachers = {
      some: { id: userId || "" },
    };
  }

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.name = { contains: value, mode: "insensitive" };
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await Promise.all([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
        classes: {
          select: {
            name: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        name: "asc",
      },
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          {role === "student" || role === "parent" || role === "teacher" ? "My Subjects" : "All Subjects"}
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              {role === "student" || role === "parent" || role === "teacher" ? "My Subjects" : "All Subjects"}
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
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default SubjectListPage;