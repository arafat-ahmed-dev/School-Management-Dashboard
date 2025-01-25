"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface ClientComponentProps {
  item: {
    id: number;
    name: string;
    class?: { name: string };
    subjects?: { name: string }[];
    students?: { name: string }[];
    createdAt?: string;
    approved: string;
  };
  role: "student" | "teacher" | "parent" | "admin";
}

const ClientComponent = ({ item, role }: ClientComponentProps) => {
  const [approved, setApproved] = useState(item.approved);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (id: number, action: "ACCEPTED" | "CANCEL") => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/approval", {
        id,
        action,
        role,
      });

      if (response.status === 200) {
        if (action === "ACCEPTED") {
          setApproved("ACCEPTED");
          toast.success("User approved successfully");
        } else {
          setDeleted(true);
          toast.success("User cancelled successfully");
        }
      } else {
        toast.error(
          `Failed to ${action === "ACCEPTED" ? "approve" : "cancel"} user`
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (deleted) {
    return null;
  }

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-aamPurpleLight"
    >
      <td className="flex items-center gap-4 text-xs md:text-sm md:p-4 p-2 md:px-2">
        {item.name}
      </td>
      {role !== "admin" && (
        <td className="text-xs md:text-sm">
          {item.class?.name ||
            item.subjects?.map((subject) => subject.name).join(", ") ||
            item.students?.map((student) => student.name).join(", ")}
        </td>
      )}
      <td className="hidden md:table-cell text-xs p-2">
        {new Intl.DateTimeFormat("en-US").format(
          new Date(item.createdAt || Date.now())
        )}
      </td>
      <td className="hidden md:table-cell text-xs p-2">{approved}</td>
      <td>
        <div className="flex items-center gap-2 justify-center flex-col md:flex-row">
          {approved === "PENDING" && (
            <>
              <button
                className="bg-green-500 w-[60px] md:w-[75px] text-[11px] md:text-sm text-white px-2 py-1 rounded"
                onClick={() => handleAction(item.id, "ACCEPTED")}
                disabled={loading}
              >
                {loading ? "Loading..." : "Approve"}
              </button>
              <button
                className="bg-red-500 w-[60px] md:w-[75px] text-[11px] md:text-sm text-white px-2 py-1 rounded"
                onClick={() => handleAction(item.id, "CANCEL")}
                disabled={loading}
              >
                {loading ? "Loading..." : "Cancel"}
              </button>
            </>
          )}
          {approved === "ACCEPTED" && (
            <Image
              src="/approvement2.png"
              width={20}
              height={20}
              alt="checkmark"
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default ClientComponent;
