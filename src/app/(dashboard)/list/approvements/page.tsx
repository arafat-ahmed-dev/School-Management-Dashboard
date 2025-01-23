import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";
import { FilterPopover } from "@/components/filter";
import { ITEM_PER_PAGE } from "@/lib/setting";
import prisma from "../../../../../prisma";
import { Prisma } from "@prisma/client";


const staticData = [
  {
    id: 1,
    title: "Approvement 1",
    class: { name: "Class A" },
    date: "2023-10-01",
    status: "pending",
  },
  {
    id: 2,
    title: "Approvement 2",
    class: { name: "Class B" },
    date: "2023-10-02",
    status: "pending",
  },
  {
    id: 3,
    title: "Approvement 3",
    class: { name: "Class C" },
    date: "2023-10-03",
    status: "pending",
  },
];
const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: role === "admin" ? "Subject" : "Class",
    accessor: "class.name",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden md:table-cell p-2",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
          className: "flex justify-center",
        },
      ]
    : []),
];

const filterGroups = [
  {
    title: "Role",
    options: [
      { label: "Student", value: "student" },
      { label: "Teacher", value: "teacher" },
      { label: "Parent", value: "parent" },
      { label: "Admin", value: "admin" },
    ],
  },
  {
    title: "Status",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
];

const renderRow = (item: any) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 text-xs md:p-4 p-2 md:px-2 ">
      {item.title}
    </td>
    <td className="text-xs md:text-sm">{item.class.name}</td>
    <td className="hidden md:table-cell text-xs p-2">
      {new Intl.DateTimeFormat("en-US").format(new Date(item.date))}
    </td>
    <td className="hidden md:table-cell text-xs p-2">{item.status}</td>
    <td>
      <div className="flex items-center gap-2 justify-center flex-col md:flex-row">
        {item.status === "pending" && (
          <>
            <button className="bg-green-500 w-[60px] md:w-[75px] text-[11px] md:text-sm text-white px-2 py-1 rounded">
              Approve
            </button>
            <button className="bg-red-500 w-[60px] md:w-[75px] text-[11px] md:text-sm text-white px-2 py-1 rounded">
              Cancel
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
);

const ApprovementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.UserApprovalWhereInput = {};

  // for (const [key, value] of Object.entries(queryParams)) {
  //   if (value !== undefined) {
  //     switch (key) {
  //       case "teacherId":
  //         query.class = {
  //           lessons: {
  //             some: {
  //               teacherId: value,
  //             },
  //           },
  //         };
  //         break;
  //       case "search":
  //         query.OR = [
  //           // { name: { contains: value, mode: "insensitive" } },
  //           // {
  //           //   class: {
  //           //     name: { contains: value, mode: "insensitive" },
  //           //   },
  //           // },
  //         ];
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }

  const [data, count] = await prisma.$transaction([
    prisma.userApproval.findMany({
      where: query,
      include: {
        admin: true,
        student: true,
        teacher: true,
        parent: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.userApproval.count({ where: query }),
  ]);

  console.log(data, count);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Approvals</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Approvals
            </h1>
            <div className="flex items-center gap-4 self-end">
              {/* <FilterPopover
                filterGroups={filterGroups}
                onFilterChange={setFilters}
              /> */}
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={staticData} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ApprovementListPage;
