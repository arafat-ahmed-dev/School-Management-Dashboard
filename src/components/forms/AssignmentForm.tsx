
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState, useRef } from "react";
import { getAllLessons, createAssignment, updateAssignment } from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    title: z.string().min(1, { message: "Assignment title is required!" }),
    startDate: z.string().min(1, { message: "Start date is required!" }),
    dueDate: z.string().min(1, { message: "Due date is required!" }),
    lessonId: z.string().min(1, { message: "Lesson is required!" }),
});

type Inputs = z.infer<typeof schema>;

const AssignmentForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [showLessonDropdown, setShowLessonDropdown] = useState(false);
    const [lessonSearch, setLessonSearch] = useState("");

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
            title: data?.title || "",
            startDate: data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
            dueDate: data?.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : "",
            lessonId: data?.lessonId || "",
        },
    });

    const selectedLesson = watch("lessonId");

    useEffect(() => {
        (async () => {
            const result = await getAllLessons({ subject: true, class: true });
            if (result.lessons) {
                setLessons(result.lessons);
            }
        })();
    }, []);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (lessonDropdownRef.current && !lessonDropdownRef.current.contains(event.target as Node)) {
                setShowLessonDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const assignmentData = {
                title: formData.title,
                startDate: formData.startDate,
                dueDate: formData.dueDate,
                lessonId: formData.lessonId,
            };

            if (type === "create") {
                const result = await createAssignment(assignmentData);
                if (result.error) {
                    toast.error("Failed to create assignment: " + result.error);
                } else {
                    toast.success("Assignment created successfully!");
                }
            } else {
                const result = await updateAssignment(data?.id, assignmentData);
                if (result.error) {
                    toast.error("Failed to update assignment: " + result.error);
                } else {
                    toast.success("Assignment updated successfully!");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new assignment" : "Update assignment"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Assignment Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />

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

                <InputField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    defaultValue={data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : ""}
                    register={register}
                    error={errors?.startDate}
                />

                <InputField
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    defaultValue={data?.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : ""}
                    register={register}
                    error={errors?.dueDate}
                />
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default AssignmentForm;
