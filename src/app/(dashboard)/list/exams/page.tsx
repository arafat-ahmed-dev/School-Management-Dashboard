import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma, Exam, Subject, Class, Teacher } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const columns = [
  {
    header: "Exam Details",
    accessor: "details",
    className: "w-1/2 sm:w-auto",
  },
  {
    header: "Subject",
    accessor: "subject",
    className: "hidden sm:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "w-1/4 sm:w-auto",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Type",
    accessor: "type",
    className: "hidden lg:table-cell",
  },
  {
    header: "Date & Time",
    accessor: "datetime",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell",
  },
];

const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // Get current session to determine user role and student class
  const session = await getServerSession(authOptions);
  const currentRole = session?.user?.role;
  const userId = session?.user?.id || "";

  // If user is a student, get their class information
  let studentClassId: string | null = null;
  let parentStudentClassIds: string[] = [];

  if (currentRole === "Student" || currentRole === "student") {
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: session?.user?.email || "" },
          { username: session?.user?.email || "" },
        ],
      },
      select: {
        classId: true,
      },
    });
    studentClassId = student?.classId || null;
  } else if (currentRole === "Parent" || currentRole === "parent") {
    // If user is a parent, get their children's class information
    const parent = await prisma.parent.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: session?.user?.email || "" },
          { username: session?.user?.email || "" },
        ],
      },
      include: {
        students: {
          select: {
            classId: true,
          },
        },
      },
    });
    parentStudentClassIds = parent?.students.map(s => s.classId).filter(Boolean) as string[] || [];
  }

  const renderRow = (item: ExamList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      {/* Exam Details - Always visible, responsive */}
      <td className="p-2 sm:p-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{item.title}</div>
          <div className="text-xs text-gray-500 sm:hidden">
            {item.lesson.subject.name} • {item.lesson.class.name}
          </div>
          <div className="text-xs text-gray-500 sm:hidden">
            <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {item.examType.charAt(0) + item.examType.slice(1).toLowerCase()}
            </span>
          </div>
          <div className="text-xs text-gray-500 md:hidden">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(item.startTime)}
          </div>
        </div>
      </td>

      {/* Subject - Hidden on mobile */}
      <td className="hidden p-2 sm:table-cell">{item.lesson.subject.name}</td>

      {/* Class - Always visible on small screens and up */}
      <td className="p-2 capitalize">{item.lesson.class.name}</td>

      {/* Teacher - Hidden on small screens */}
      <td className="hidden p-2 md:table-cell">{item.lesson.teacher.name}</td>

      {/* Type - Hidden on medium screens and below */}
      <td className="hidden p-2 lg:table-cell">
        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {item.examType.charAt(0) + item.examType.slice(1).toLowerCase()}
        </span>
      </td>

      {/* Date & Time - Hidden on small screens */}
      <td className="hidden p-2 md:table-cell">
        <div className="text-xs">
          <div className="font-medium">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(item.startTime)}
          </div>
          <div className="text-gray-500">
            {new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(item.startTime)} - {new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(item.endTime)}
          </div>
        </div>
      </td>

      {/* Actions - Always visible */}
      <td className="p-2">
        <div className="flex w-fit items-center justify-center gap-2">
          {(currentRole === "admin" || currentRole === "Admin") && (
            <>
              <FormModel table="exam" type="update" data={item} />
              <FormModel table="exam" type="delete" id={item.id.toString()} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION
  const query: Prisma.ExamWhereInput = {};

  query.lesson = {};

  // If student, filter by their class only
  if (currentRole === "Student" || currentRole === "student") {
    if (studentClassId) {
      query.lesson.classId = studentClassId;
    } else {
      // If student has no class, show no exams
      query.lesson.classId = "nonexistent";
    }
  } else if (currentRole === "Parent" || currentRole === "parent") {
    // If parent, filter by their children's classes
    if (parentStudentClassIds.length > 0) {
      query.lesson.classId = { in: parentStudentClassIds };
    } else {
      // If parent has no children assigned, show no exams
      query.lesson.classId = "nonexistent";
    }
  }

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            // For students and parents, ignore classId filter as we already filtered by their class(es)
            if (currentRole !== "Student" && currentRole !== "student" &&
              currentRole !== "Parent" && currentRole !== "parent") {
              query.lesson.classId = value;
            }
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              {
                lesson: {
                  subject: { name: { contains: value, mode: "insensitive" } },
                },
              },
              {
                lesson: {
                  teacher: { name: { contains: value, mode: "insensitive" } },
                },
              },
              {
                lesson: {
                  class: { name: { contains: value, mode: "insensitive" } },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),

    prisma.exam.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          {currentRole === "Student" || currentRole === "student" ? "My Exams" : "All Exams"}
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              {currentRole === "Student" || currentRole === "student" ? "My Exams" : "All Exams"}
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {(currentRole === "admin" || currentRole === "Admin" || currentRole === "teacher" || currentRole === "Teacher") && (
                <FormModel table="exam" type="create" />
              )}
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

export default ExamListPage;
