import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getSessionData } from "@/lib/session-utils";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { Event, Prisma } from "@prisma/client";

type EventList = Event & { class: { name: string } };

const EventListPage = async ({
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
      header: "Title",
      accessor: "title",
    },
    {
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell p-2",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell p-2",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden lg:table-cell p-2",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden lg:table-cell p-2",
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

  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-xs text-gray-500 md:hidden">{item.description}</p>
        </div>
      </td>
      <td className="hidden p-2 md:table-cell">
        <div className="max-w-40 truncate" title={item.description}>
          {item.description}
        </div>
      </td>
      <td className="capitalize">{item.class?.name || "All Classes"}</td>
      <td className="hidden p-2 md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td className="hidden p-2 lg:table-cell">
        {new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(item.startTime)}
      </td>
      <td className="hidden p-2 lg:table-cell">
        {new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(item.endTime)}
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModel table="event" type="update" data={item} id={item.id} />
              <FormModel table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.EventWhereInput = {};


  if (role === "student") {
    // Students can see: their class events + all-classes events
    const student = await prisma.student.findUnique({
      where: { id: userId || "" },
      select: { classId: true },
    });
    if (student?.classId) {
      query.OR = [
        { classId: student.classId },  // Events for their specific class
        { classId: null },             // All-classes events (visible to everyone)
      ];
    } else {
      // If student has no class, only show all-classes events
      query.classId = null;
    }
  } else if (role === "parent") {
    // Parents can see: their children's classes events + all-classes events
    const parent = await prisma.parent.findUnique({
      where: { id: userId || "" },
      include: { students: { select: { classId: true } } },
    });
    if (parent?.students.length) {
      const classIds = parent.students.map(s => s.classId).filter(Boolean) as string[];
      if (classIds.length > 0) {
        query.OR = [
          { classId: { in: classIds } }, // Events for their children's classes
          { classId: null },             // All-classes events (visible to everyone)
        ];
      } else {
        // If parent has no children with classes, only show all-classes events
        query.classId = null;
      }
    } else {
      // If parent has no children, only show all-classes events
      query.classId = null;
    }
  }
  // Teachers and admins can see ALL events (no filtering applied)

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.title = { contains: value, mode: "insensitive" };
          break;
        case "classId":
          query.classId = value;
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await Promise.all([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.event.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          {role === "student" || role === "parent" ? "My Events" : "All Events"}
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              {role === "student" || role === "parent" ? "My Events" : "All Events"}
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {(role === "admin" || role === "teacher") && (
                <FormModel table="event" type="create" />
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

export default EventListPage;