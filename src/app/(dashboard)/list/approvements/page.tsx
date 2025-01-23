"use client";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";
import { FilterPopover } from "@/components/filter";

const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Role",
    accessor: "role",
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

const filterGroups = [
  {
    title: "Status",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
  {
    title: "Class",
    options: [
      { label: "Class A", value: "Class A" },
      { label: "Class B", value: "Class B" },
      { label: "Class C", value: "Class C" },
    ],
  },
];

const renderRow = (item: any) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 text-[12px] md:p-4 p-2 md:px-2 ">{item.title}</td>
    <td className="text-[12px] md:text-sm">{item.class.name}</td>
    <td className="hidden md:table-cell text-[12px] p-2">
      {new Intl.DateTimeFormat("en-US").format(new Date(item.date))}
    </td>
    <td className="hidden md:table-cell text-[12px] p-2">{item.status}</td>
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

const ApprovementListPage = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredData = staticData.filter(item => {
    return (
      (filters.Status ? item.status === filters.Status : true) &&
      (filters.Class ? item.class.name === filters.Class : true)
    );
  });

  const data = filteredData;
  const count = filteredData.length;
  const p = 1;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Approvals
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Approvals
            </h1>
            <div className="flex items-center gap-4 self-end">
              <FilterPopover filterGroups={filterGroups} onFilterChange={setFilters} />
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
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

export default ApprovementListPage;
