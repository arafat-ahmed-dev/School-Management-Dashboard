import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import NotificationReader from "@/components/NotificationReader";
import { getSessionData } from "@/lib/session-utils";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Announcement, Prisma } from "@prisma/client";

type AnnouncementList = Announcement & { class: { name: string } };

const AnnouncementListPage = async ({
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
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
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

  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="max-w-xs truncate text-xs text-gray-500">{item.description}</p>
        </div>
      </td>
      <td className="capitalize">{item.class?.name || "All Classes"}</td>
      <td className="hidden p-2 md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td>
        <div className="flex w-fit items-center justify-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModel table="announcement" type="update" data={item} id={item.id} />
              <FormModel table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.AnnouncementWhereInput = {};

  // Apply role-based filtering for announcements
  // Note: Announcements with classId = null are "All Classes" and visible to everyone
  if (role === "student") {
    // Students can see: their class announcements + all-classes announcements
    const student = await prisma.student.findUnique({
      where: { id: userId || "" },
      select: { classId: true },
    });
    if (student?.classId) {
      query.OR = [
        { classId: student.classId },  // Announcements for their specific class
        { classId: null },             // All-classes announcements (visible to everyone)
      ];
    } else {
      // If student has no class, only show all-classes announcements
      query.classId = null;
    }
  } else if (role === "parent") {
    // Parents can see: their children's classes announcements + all-classes announcements
    const parent = await prisma.parent.findUnique({
      where: { id: userId || "" },
      include: { students: { select: { classId: true } } },
    });
    if (parent?.students.length) {
      const classIds = parent.students.map(s => s.classId).filter(Boolean) as string[];
      if (classIds.length > 0) {
        query.OR = [
          { classId: { in: classIds } }, // Announcements for their children's classes
          { classId: null },             // All-classes announcements (visible to everyone)
        ];
      } else {
        // If parent has no children with classes, only show all-classes announcements
        query.classId = null;
      }
    } else {
      // If parent has no children, only show all-classes announcements
      query.classId = null;
    }
  }
  // Teachers and admins can see ALL announcements (no filtering applied)

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
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: {
        date: "desc",
      },
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          {role === "student" || role === "parent" ? "My Announcements" : "All Announcements"}
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              {role === "student" || role === "parent" ? "My Announcements" : "All Announcements"}
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {(role === "admin" || role === "teacher") && (
                <FormModel table="announcement" type="create" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />

      {/* Notification Reader for marking announcements as read */}
      <NotificationReader type="announcements" />
    </div>
  );
};

export default AnnouncementListPage;