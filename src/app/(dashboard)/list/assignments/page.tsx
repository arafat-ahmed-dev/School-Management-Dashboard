import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSessionData } from "@/lib/session-utils";
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

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get current user session for security
  const { userRole, userId } = await getSessionData();
  const role = userRole || "admin";

  // Define columns based on user role
  const columns = [
    {
      header: "Assignment Info",
      accessor: "info",
    },
    {
      header: "Subject",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden lg:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Dates",
      accessor: "dates",
      className: "hidden xl:table-cell",
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

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-xs text-gray-500 md:hidden">
            {item.lesson.subject.name} • {item.lesson.class.name}
          </p>
          <p className="text-xs text-gray-500 lg:hidden">
            Teacher: {item.lesson.teacher.name}
          </p>
          <p className="text-xs text-gray-500 xl:hidden">
            Due: {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
          </p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-medium">{item.lesson.subject.name}</span>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="flex flex-col">
          <span className="font-medium">{item.lesson.class.name}</span>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="flex flex-col">
          <span className="font-medium">{item.lesson.teacher.name}</span>
        </div>
      </td>
      <td className="hidden xl:table-cell">
        <div className="flex flex-col text-xs">
          <span className="text-gray-500">
            Start: {new Intl.DateTimeFormat("en-US").format(item.startDate)}
          </span>
          <span className="font-medium">
            Due: {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
          </span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModel table="assignment" type="update" data={item} />
              <FormModel table="assignment" type="delete" id={item.id.toString()} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.AssignmentWhereInput = {};

  // Apply role-based filtering
  if (role === "student") {
    // Students should only see assignments for their class
    const student = await prisma.student.findUnique({
      where: { id: userId || "" },
      select: { classId: true },
    });
    if (student?.classId) {
      query.lesson = {
        classId: student.classId,
      };
    }
  } else if (role === "parent") {
    // Parents should only see assignments for their children's classes
    const parent = await prisma.parent.findUnique({
      where: { id: userId || "" },
      include: { students: { select: { classId: true } } },
    });
    if (parent?.students.length) {
      const classIds = parent.students.map(s => s.classId).filter(Boolean) as string[];
      if (classIds.length > 0) {
        query.lesson = {
          classId: { in: classIds },
        };
      }
    }
  }

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
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          All Assignments
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Assignments
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
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
