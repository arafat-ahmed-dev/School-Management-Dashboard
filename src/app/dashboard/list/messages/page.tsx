import React from "react"; // Add this import
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { messagesData, role } from "@/lib/data";
import Image from "next/image";
import FormModel from "@/components/FormModal";

type Message = {
  id: number;
  sender: string;
  receiver: string;
  message: string;
  date: string;
};

const columns = [
  {
    header: "Sender",
    accessor: "sender",
  },
  {
    header: "Receiver",
    accessor: "receiver",
  },
  {
    header: "Message",
    accessor: "message",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell p-2",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const MessageListPage = () => {
  const renderRow = (item: Message) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 px-2">{item.sender}</td>
      <td>{item.receiver}</td>
      <td className="hidden md:table-cell p-2">{item.message}</td>
      <td className="hidden md:table-cell p-2">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "Admin" && (
            <>
              <FormModel table="message" type="update" />
              <FormModel table="message" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 justify-between md:self-end w-full">
            <h1 className="md:hidden block text-sm font-semibold">
              All Messages
            </h1>
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "Admin" && <FormModel table="message" type="create" />}
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={messagesData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default MessageListPage;
