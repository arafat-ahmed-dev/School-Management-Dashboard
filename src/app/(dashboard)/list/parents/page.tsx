import FormModel from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import prisma from "../../../../../prisma";
import { Prisma, Parent, Student } from "@prisma/client";

type ParentList = Parent & { students: Student[] };

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: " p-2",
  },
  {
    header: "Student Names",
    accessor: "students",
    className: "p-2",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden md:table-cell",
  },
  ...(role === "admin"
    ? [
      {
        header: "Actions",
        accessor: "action",
        className: "flex justify-center table-cell p-2",
      },
    ]
    : []),
];
const renderRow = (item: ParentList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-aamPurpleLight"
  >
    <td className="flex items-center gap-4 p-4 px-2">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="p-2">{item.students.map((item) => item.name).join(", ")}</td>
    <td className="hidden p-2 md:table-cell">{item.phone}</td>
    <td className="hidden p-2 md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center justify-center  gap-2">
        {role === "admin" && (
          <>
            <FormModel table="parent" type="update" data={item} id={parseInt(item.id)} />
            <FormModel table="parent" type="delete" id={parseInt(item.id)} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.ParentWhereInput = {
    approved: "ACCEPTED", // Add this line to filter accepted students
  };;

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.OR = [
            { name: { contains: value, mode: "insensitive" } },
            {
              students: {
                some: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
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
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.parent.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Parents</h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex w-full items-center justify-between gap-4 md:self-end">
            <h1 className="block text-sm font-semibold md:hidden">
              All Parents
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModel table="parent" type="create" />}
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

export default ParentListPage;
