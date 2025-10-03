import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { Prisma, Result, Student, Exam, Assignment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import prisma from "../../../../../prisma";

// import DataService from "@/services/data-service";
// import ClientResultPage from "./ClientResultPage";

type ResultList = Result & {
  student: Student & {
    class: {
      name: string;
    };
  };
} & {
  exam?: Exam | null;
  assignment?: Assignment | null;
};

const ResultPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const session = await getServerSession(authOptions);
  const currentUserRole = session?.user?.role || "admin";
  const currentUserId = session?.user?.id;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Role-based query filtering
  const query: Prisma.ResultWhereInput = {};

  if (currentUserRole === "student") {
    query.studentId = currentUserId;
  } else if (currentUserRole === "parent") {
    query.student = {
      parentId: currentUserId,
    };
  }
  // Admin and Teacher can see all results - no additional filtering needed

  // Handle search and other filters
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          // @ts-ignore: OR property assignment for search functionality
          query.OR = [
            {
              student: {
                name: { contains: value, mode: "insensitive" },
              },
            },
            {
              exam: {
                title: { contains: value, mode: "insensitive" },
              },
            },
            {
              assignment: {
                title: { contains: value, mode: "insensitive" },
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
    prisma.result.findMany({
      where: query,
      include: {
        student: {
          include: {
            class: {
              select: {
                name: true,
              },
            },
          },
        },
        exam: true,
        assignment: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        id: "desc",
      },
    }),
    prisma.result.count({ where: query }),
  ]);

  // Define table columns based on role
  const columns = [
    {
      header: "Student",
      accessor: "student",
      className: "p-2",
    },
    {
      header: "Exam/Assignment",
      accessor: "examAssignment",
      className: "hidden md:table-cell p-2",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell p-2",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden lg:table-cell p-2",
    },
    {
      header: "Percentage",
      accessor: "percentage",
      className: "hidden lg:table-cell p-2",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "flex justify-center table-cell",
    },
  ];

  // Helper function to calculate grade
  const calculateGrade = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-100 text-sm transition-colors duration-200 even:bg-gray-50/50 hover:bg-blue-50/80"
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
          <h3 className="font-semibold">{item.student?.name}</h3>
          <p className="text-xs text-gray-500">{item.student?.class?.name}</p>
        </div>
      </td>
      <td className="hidden p-2 md:table-cell">
        {item.exam?.title || item.assignment?.title || "N/A"}
      </td>
      <td className="hidden p-2 md:table-cell">
        {item.score}/{item.maxScore}
      </td>
      <td className="hidden p-2 lg:table-cell">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${calculateGrade(item.score, item.maxScore) === "F"
              ? "border border-red-200 bg-red-50 text-red-700"
              : calculateGrade(item.score, item.maxScore) === "A+" ||
                calculateGrade(item.score, item.maxScore) === "A"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-amber-200 bg-amber-50 text-amber-700"
            }`}
        >
          {calculateGrade(item.score, item.maxScore)}
        </span>
      </td>
      <td className="hidden p-2 lg:table-cell">
        {Math.round((item.score / item.maxScore) * 100)}%
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          <Link href={`/list/results/${item.id}`}>
            <button className="flex size-8 items-center justify-center rounded-lg bg-blue-500 shadow-sm transition-colors duration-200 hover:bg-blue-600">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {currentUserRole === "admin" && (
            <>
              <FormModel table="result" type="update" data={item} id={item.id} />
              <FormModel table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Commented out original dashboard functionality
  // try {
  //   const data = await DataService.getAllResultData();
  //   return <ClientResultPage initialData={data} />;
  // } catch (error) {
  //   console.error('❌ Server: Error loading result data:', error);
  //   return (
  //     <div className="m-2 mt-0 flex-1 rounded-md bg-white text-base md:m-4 md:p-4 md:text-lg">
  //       <div className="flex h-96 items-center justify-center">
  //         <div className="text-lg text-red-500">Error loading result data: {error instanceof Error ? error.message : 'Unknown error'}</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="m-4 mt-0 flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          {currentUserRole === "student" || currentUserRole === "parent"
            ? "My Results"
            : "All Results"}
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              {currentUserRole === "student" || currentUserRole === "parent"
                ? "My Results"
                : "All Results"}
            </h1>
            <div className="flex items-center gap-3 self-end">
              <button className="flex size-9 items-center justify-center rounded-lg bg-gray-100 shadow-sm transition-colors duration-200 hover:bg-gray-200">
                <Image src="/filter.png" alt="" width={16} height={16} />
              </button>
              <button className="flex size-9 items-center justify-center rounded-lg bg-gray-100 shadow-sm transition-colors duration-200 hover:bg-gray-200">
                <Image src="/sort.png" alt="" width={16} height={16} />
              </button>
              {currentUserRole === "admin" && (
                <FormModel table="result" type="create" />
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

export default ResultPage;
