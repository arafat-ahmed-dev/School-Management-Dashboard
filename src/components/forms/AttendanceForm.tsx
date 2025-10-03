
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState, useRef } from "react";
import { getAllStudents, getAllLessons, createAttendance, updateAttendance } from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    date: z.string().min(1, { message: "Date is required!" }),
    present: z.string(),
    studentId: z.string().min(1, { message: "Student is required!" }),
    lessonId: z.string().min(1, { message: "Lesson is required!" }),
});

type Inputs = z.infer<typeof schema>;

const AttendanceForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const [students, setStudents] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [showLessonDropdown, setShowLessonDropdown] = useState(false);
    const [studentSearch, setStudentSearch] = useState("");
    const [lessonSearch, setLessonSearch] = useState("");

    const studentDropdownRef = useRef<HTMLDivElement>(null);
    const lessonDropdownRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            date: data?.date ? new Date(data.date).toISOString().split('T')[0] : "",
            present: data?.present !== undefined ? String(data.present) : "true",
            studentId: data?.studentId || "",
            lessonId: data?.lessonId || "",
        },
    });

    const selectedStudent = watch("studentId");
    const selectedLesson = watch("lessonId");

    useEffect(() => {
        (async () => {
            const [studentsData, lessonsResult] = await Promise.all([
                getAllStudents({ class: true }),
                getAllLessons({ subject: true, class: true })
            ]);
            // Filter students to only include those with assigned classes
            const studentsWithClasses = studentsData.filter(student => student.class);
            setStudents(studentsWithClasses);
            if (lessonsResult.lessons) {
                setLessons(lessonsResult.lessons);
            }
        })();
    }, []);

    // Handle click outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
                setShowStudentDropdown(false);
            }
            if (lessonDropdownRef.current && !lessonDropdownRef.current.contains(event.target as Node)) {
                setShowLessonDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const attendanceData = {
                date: formData.date,
                present: formData.present === "true",
                studentId: formData.studentId,
                lessonId: formData.lessonId,
            };

            if (type === "create") {
                const result = await createAttendance(attendanceData);
                if (result.error) {
                    toast.error("Failed to create attendance: " + result.error);
                } else {
                    toast.success("Attendance created successfully!");
                }
            } else {
                const result = await updateAttendance(data?.id, attendanceData);
                if (result.error) {
                    toast.error("Failed to update attendance: " + result.error);
                } else {
                    toast.success("Attendance updated successfully!");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new attendance record" : "Update attendance record"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={data?.date ? new Date(data.date).toISOString().split('T')[0] : ""}
                    register={register}
                    error={errors?.date}
                />

                {/* Student Searchable Dropdown */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Student</label>
                    <div className="relative" ref={studentDropdownRef}>
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowStudentDropdown((v) => !v)}
                        >
                            {selectedStudent
                                ? (() => {
                                    const student = students.find((s) => s.id === selectedStudent);
                                    return student ? `${student.name} (${student.class.name})` : "Select student";
                                })()
                                : "Select student"}
                        </button>
                        {showStudentDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="w-full border-b border-gray-200 p-2 text-sm focus:outline-none"
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                />
                                <div className="max-h-40 overflow-y-auto">
                                    {students
                                        .filter((student) =>
                                            student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                            student.class.name.toLowerCase().includes(studentSearch.toLowerCase())
                                        )
                                        .map((student) => (
                                            <label
                                                key={student.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedStudent === student.id}
                                                    onChange={() => {
                                                        setValue("studentId", student.id, { shouldValidate: true });
                                                        setShowStudentDropdown(false);
                                                        setStudentSearch("");
                                                    }}
                                                />
                                                <div className="ml-2">
                                                    <div className="font-medium">{student.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Class: {student.class.name}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                </div>
                                <div className="flex justify-end p-2">
                                    <button
                                        type="button"
                                        className="text-xs text-blue-500 hover:underline"
                                        onClick={() => setShowStudentDropdown(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.studentId && (
                        <p className="text-xs text-red-400">{errors.studentId.message as string}</p>
                    )}
                </div>

                {/* Lesson Searchable Dropdown */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Lesson</label>
                    <div className="relative" ref={lessonDropdownRef}>
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowLessonDropdown((v) => !v)}
                        >
                            {selectedLesson
                                ? (() => {
                                    const lesson = lessons.find((l) => l.id === selectedLesson);
                                    return lesson ? `${lesson.name} (${lesson.subject?.name} - ${lesson.class?.name})` : "Select lesson";
                                })()
                                : "Select lesson"}
                        </button>
                        {showLessonDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search lessons..."
                                    className="w-full border-b border-gray-200 p-2 text-sm focus:outline-none"
                                    value={lessonSearch}
                                    onChange={(e) => setLessonSearch(e.target.value)}
                                />
                                <div className="max-h-40 overflow-y-auto">
                                    {lessons
                                        .filter((lesson) =>
                                            lesson.name.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                                            lesson.subject?.name.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                                            lesson.class?.name.toLowerCase().includes(lessonSearch.toLowerCase())
                                        )
                                        .map((lesson) => (
                                            <label
                                                key={lesson.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedLesson === lesson.id}
                                                    onChange={() => {
                                                        setValue("lessonId", lesson.id, { shouldValidate: true });
                                                        setShowLessonDropdown(false);
                                                        setLessonSearch("");
                                                    }}
                                                />
                                                <div className="ml-2">
                                                    <div className="font-medium">{lesson.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {lesson.subject?.name} - {lesson.class?.name}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                </div>
                                <div className="flex justify-end p-2">
                                    <button
                                        type="button"
                                        className="text-xs text-blue-500 hover:underline"
                                        onClick={() => setShowLessonDropdown(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.lessonId && (
                        <p className="text-xs text-red-400">{errors.lessonId.message as string}</p>
                    )}
                </div>

                {/* Attendance Status */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Status</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="true"
                                {...register("present")}
                                defaultChecked={data?.present !== false}
                                className="mr-2"
                            />
                            Present
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="false"
                                {...register("present")}
                                defaultChecked={data?.present === false}
                                className="mr-2"
                            />
                            Absent
                        </label>
                    </div>
                    {errors.present && (
                        <p className="text-xs text-red-400">{errors.present.message as string}</p>
                    )}
                </div>
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default AttendanceForm;
