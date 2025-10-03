"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState, useRef } from "react";
import { getAllSubjects, getAllClasses, getAllTeachers, createLesson, updateLesson } from "@/app/actions/actions";

const schema = z.object({
    name: z.string().min(1, { message: "Lesson name is required!" }),
    subjectId: z.string().min(1, { message: "Subject is required!" }),
    classId: z.string().min(1, { message: "Class is required!" }),
    teacherId: z.string().min(1, { message: "Teacher is required!" }),
    dayOfWeek: z.string().min(1, { message: "Day is required!" }),
    startTime: z.string().min(1, { message: "Start time is required!" }),
    endTime: z.string().min(1, { message: "End time is required!" }),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState("");
    const [classSearch, setClassSearch] = useState("");
    const [teacherSearch, setTeacherSearch] = useState("");

    const subjectDropdownRef = useRef<HTMLDivElement>(null);
    const classDropdownRef = useRef<HTMLDivElement>(null);
    const teacherDropdownRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || "",
            subjectId: data?.subjectId || "",
            classId: data?.classId || "",
            teacherId: data?.teacherId || "",
            dayOfWeek: data?.day ? (["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(data.day)).toString() : "",
            startTime: data?.startTime ? new Date(data.startTime).toTimeString().slice(0, 5) : "",
            endTime: data?.endTime ? new Date(data.endTime).toTimeString().slice(0, 5) : "",
        },
    });

    const selectedSubject = watch("subjectId");
    const selectedClass = watch("classId");
    const selectedTeacher = watch("teacherId");

    useEffect(() => {
        (async () => {
            setSubjects(await getAllSubjects());
            setClasses(await getAllClasses());
            setTeachers(await getAllTeachers());
        })();
    }, []);

    // Handle click outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
                setShowSubjectDropdown(false);
            }
            if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
                setShowClassDropdown(false);
            }
            if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
                setShowTeacherDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const lessonData = {
                name: formData.name,
                dayOfWeek: parseInt(formData.dayOfWeek),
                startTime: formData.startTime,
                endTime: formData.endTime,
                subjectId: formData.subjectId,
                classId: formData.classId,
                teacherId: formData.teacherId,
            };

            if (type === "create") {
                const result = await createLesson(lessonData);
                if (result.error) {
                    alert("Failed to create lesson: " + result.error);
                } else {
                    alert("Lesson created successfully!");
                }
            } else {
                const result = await updateLesson(data?.id, lessonData);
                if (result.error) {
                    alert("Failed to update lesson: " + result.error);
                } else {
                    alert("Lesson updated successfully!");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new lesson" : "Update lesson"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Lesson Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />

                {/* Subject Searchable Dropdown */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Subject</label>
                    <div className="relative" ref={subjectDropdownRef}>
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowSubjectDropdown((v) => !v)}
                        >
                            {selectedSubject
                                ? subjects.find((s) => s.id === selectedSubject)?.name || "Select subject"
                                : "Select subject"}
                        </button>
                        {showSubjectDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search subjects..."
                                    className="w-full border-b border-gray-200 p-2 text-sm focus:outline-none"
                                    value={subjectSearch}
                                    onChange={(e) => setSubjectSearch(e.target.value)}
                                />
                                <div className="max-h-40 overflow-y-auto">
                                    {subjects
                                        .filter((subject) =>
                                            subject.name.toLowerCase().includes(subjectSearch.toLowerCase())
                                        )
                                        .map((subject) => (
                                            <label
                                                key={subject.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedSubject === subject.id}
                                                    onChange={() => {
                                                        setValue("subjectId", subject.id, { shouldValidate: true });
                                                        setShowSubjectDropdown(false);
                                                        setSubjectSearch("");
                                                    }}
                                                />
                                                <span className="ml-2">{subject.name}</span>
                                            </label>
                                        ))}
                                </div>
                                <div className="flex justify-end p-2">
                                    <button
                                        type="button"
                                        className="text-xs text-blue-500 hover:underline"
                                        onClick={() => setShowSubjectDropdown(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.subjectId && (
                        <p className="text-xs text-red-400">{errors.subjectId.message as string}</p>
                    )}
                </div>

                {/* Class Searchable Dropdown */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Class</label>
                    <div className="relative" ref={classDropdownRef}>
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowClassDropdown((v) => !v)}
                        >
                            {selectedClass
                                ? classes.find((c) => c.id === selectedClass)?.name || "Select class"
                                : "Select class"}
                        </button>
                        {showClassDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search classes..."
                                    className="w-full border-b border-gray-200 p-2 text-sm focus:outline-none"
                                    value={classSearch}
                                    onChange={(e) => setClassSearch(e.target.value)}
                                />
                                <div className="max-h-40 overflow-y-auto">
                                    {classes
                                        .filter((cls) =>
                                            cls.name.toLowerCase().includes(classSearch.toLowerCase())
                                        )
                                        .map((cls) => (
                                            <label
                                                key={cls.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedClass === cls.id}
                                                    onChange={() => {
                                                        setValue("classId", cls.id, { shouldValidate: true });
                                                        setShowClassDropdown(false);
                                                        setClassSearch("");
                                                    }}
                                                />
                                                <span className="ml-2">{cls.name}</span>
                                            </label>
                                        ))}
                                </div>
                                <div className="flex justify-end p-2">
                                    <button
                                        type="button"
                                        className="text-xs text-blue-500 hover:underline"
                                        onClick={() => setShowClassDropdown(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.classId && (
                        <p className="text-xs text-red-400">{errors.classId.message as string}</p>
                    )}
                </div>

                {/* Teacher Searchable Dropdown */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Teacher</label>
                    <div className="relative" ref={teacherDropdownRef}>
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowTeacherDropdown((v) => !v)}
                        >
                            {selectedTeacher
                                ? teachers.find((t) => t.id === selectedTeacher)?.name || "Select teacher"
                                : "Select teacher"}
                        </button>
                        {showTeacherDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search teachers..."
                                    className="w-full border-b border-gray-200 p-2 text-sm focus:outline-none"
                                    value={teacherSearch}
                                    onChange={(e) => setTeacherSearch(e.target.value)}
                                />
                                <div className="max-h-40 overflow-y-auto">
                                    {teachers
                                        .filter((teacher) =>
                                            teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
                                        )
                                        .map((teacher) => (
                                            <label
                                                key={teacher.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedTeacher === teacher.id}
                                                    onChange={() => {
                                                        setValue("teacherId", teacher.id, { shouldValidate: true });
                                                        setShowTeacherDropdown(false);
                                                        setTeacherSearch("");
                                                    }}
                                                />
                                                <span className="ml-2">{teacher.name}</span>
                                            </label>
                                        ))}
                                </div>
                                <div className="flex justify-end p-2">
                                    <button
                                        type="button"
                                        className="text-xs text-blue-500 hover:underline"
                                        onClick={() => setShowTeacherDropdown(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.teacherId && (
                        <p className="text-xs text-red-400">{errors.teacherId.message as string}</p>
                    )}
                </div>

                {/* Day of Week */}
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Day of Week</label>
                    <select
                        {...register("dayOfWeek")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                    >
                        <option value="">Select day</option>
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                    </select>
                    {errors.dayOfWeek && (
                        <p className="text-xs text-red-400">{errors.dayOfWeek.message as string}</p>
                    )}
                </div>

                <InputField
                    label="Start Time"
                    name="startTime"
                    type="time"
                    defaultValue={data?.startTime ? new Date(data.startTime).toTimeString().slice(0, 5) : ""}
                    register={register}
                    error={errors?.startTime}
                />

                <InputField
                    label="End Time"
                    name="endTime"
                    type="time"
                    defaultValue={data?.endTime ? new Date(data.endTime).toTimeString().slice(0, 5) : ""}
                    register={register}
                    error={errors?.endTime}
                />
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default LessonForm;