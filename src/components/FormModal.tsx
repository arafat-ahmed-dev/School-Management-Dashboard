"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useTransition } from "react";

import * as actions from "@/app/actions/actions";
import { toast } from "sonner";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MessageForm = dynamic(() => import("./forms/MessageForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "message"
  | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-aamYellow"
      : type === "update"
        ? "bg-aamSky"
        : "bg-aamPurple";

  const forms: {
    [key: string]: (type: "create" | "update", data?: any, onSuccess?: () => void) => React.JSX.Element;
  } = {
    teacher: (type, data, onSuccess) => <TeacherForm type={type} data={data} />,
    student: (type, data, onSuccess) => <StudentForm type={type} data={data} />,
    parent: (type, data, onSuccess) => <ParentForm type={type} data={data} />,
    subject: (type, data, onSuccess) => <SubjectForm type={type} data={data} />,
    class: (type, data, onSuccess) => <ClassForm type={type} data={data} />,
    lesson: (type, data, onSuccess) => <LessonForm type={type} data={data} />,
    exam: (type, data, onSuccess) => <ExamForm type={type} data={data} />,
    assignment: (type, data, onSuccess) => <AssignmentForm type={type} data={data} />,
    result: (type, data, onSuccess) => <ResultForm type={type} data={data} onSuccess={onSuccess} />,
    attendance: (type, data, onSuccess) => <AttendanceForm type={type} data={data} />,
    event: (type, data, onSuccess) => <EventForm type={type} data={data} onSuccess={onSuccess} />,
    message: (type, data, onSuccess) => <MessageForm type={type} data={data} />,
    announcement: (type, data, onSuccess) => <AnnouncementForm type={type} data={data} onSuccess={onSuccess} />,
  };

  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const deleteActionMap: { [key: string]: (id: string) => Promise<any> } = {
    teacher: actions.deleteTeacher,
    student: actions.deleteStudent,
    parent: actions.deleteParent,
    subject: actions.deleteSubject,
    class: actions.deleteClass,
    lesson: actions.deleteLesson,
    exam: actions.deleteExam,
    assignment: actions.deleteAssignment,
    result: actions.deleteResult,
    attendance: actions.deleteAttendance,
    event: actions.deleteEvent,
    message: actions.deleteMessage,
    announcement: actions.deleteAnnouncement,
  };

  // Import toast if not already imported

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!id) return;
    console.log(id);

    const deleteFn = deleteActionMap[table];
    if (!deleteFn) {
      setError("Delete function not found.");
      toast.error("Delete function not found.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await deleteFn(String(id));
        if (res?.success) {
          setOpen(false);
          toast.success(`${table.charAt(0).toUpperCase() + table.slice(1)} deleted successfully.`);
        } else {
          setError(res?.error || "Delete failed.");
          toast.error(res?.error || "Delete failed.");
        }
      } catch (err: any) {
        setError(err?.message || "Delete failed.");
        toast.error(err?.message || "Delete failed.");
      }
    });
  };

  const Form = () => {
    console.log(`Rendering form for table: ${table}, type: ${type}, id: ${id}`);

    const handleSuccess = () => {
      setOpen(false);
    };

    return type === "delete" && id ? (
      <form onSubmit={handleDelete} className="flex flex-col gap-4 p-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        {error && <span className="text-center text-red-600">{error}</span>}
        <button
          type="submit"
          disabled={isPending}
          className="w-max self-center rounded-md border-none bg-red-700 px-4 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, handleSuccess)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60">
          <div className="relative w-[90%] rounded-md bg-white p-4 md:w-[70%] lg:w-3/5 xl:w-1/2 2xl:w-2/5">
            <Form />
            <div
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
