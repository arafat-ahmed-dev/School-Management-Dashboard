"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState, useRef } from "react";
import { getAllLessons, createExam, updateExam } from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    title: z.string().min(1, { message: "Exam title is required!" }),
    lessonId: z.string().min(1, { message: "Lesson is required!" }),
    startTime: z.string().min(1, { message: "Start time is required!" }),
    endTime: z.string().min(1, { message: "End time is required!" }),
    examType: z.enum(["MONTHLY", "MIDTERM", "FINAL", "ASSIGNMENT"], {
        errorMap: () => ({ message: "Exam type is required!" }),
    }),
});

type Inputs = z.infer<typeof schema>;

const ExamForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
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
            lessonId: data?.lessonId || "",
            startTime: data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : "",
            endTime: data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : "",
            examType: data?.examType || "ASSIGNMENT",
        },
    });

    const selectedLesson = watch("lessonId");

    useEffect(() => {
        (async () => {
            const { lessons: fetchedLessons } = await getAllLessons();
            setLessons(fetchedLessons || []);
        })();
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (lessonDropdownRef.current && !lessonDropdownRef.current.contains(event.target as Node)) {
                setShowLessonDropdown(false);
            }
        };

        if (showLessonDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLessonDropdown]);

    const onSubmit = handleSubmit(async (formData) => {
        try {
            if (type === "create") {
                const result = await createExam(formData);
                if (result.error) {
                    console.error("Error creating exam:", result.error);
                    toast.error("Failed to create exam: " + result.error);
                } else {
                    console.log("Exam created successfully:", result.exam);
                    toast.success("Exam created successfully!");
                    // You might want to redirect or close the modal here
                }
            } else {
                const result = await updateExam(data?.id, formData);
                if (result.error) {
                    console.error("Error updating exam:", result.error);
                    toast.error("Failed to update exam: " + result.error);
                } else {
                    console.log("Exam updated successfully:", result.exam);
                    toast.success("Exam updated successfully!");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new exam" : "Update exam"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Exam Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />

                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Exam Type</label>
                    <select
                        {...register("examType")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        defaultValue={data?.examType || "ASSIGNMENT"}
                    >
                        <option value="ASSIGNMENT">Assignment</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="MIDTERM">Midterm</option>
                        <option value="FINAL">Final</option>
                    </select>
                    {errors.examType && (
                        <p className="text-xs text-red-400">{errors.examType.message as string}</p>
                    )}
                </div>
                <div className="mb-1 flex w-full flex-col">
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
                                    return lesson
                                        ? `${lesson.name} - ${lesson.subject?.name || 'No Subject'} (${lesson.class?.name || 'No Class'}) - ${lesson.teacher?.name || 'No Teacher'}`
                                        : "Select lesson";
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
                                        .filter((lesson) => {
                                            const searchTerm = lessonSearch.toLowerCase();
                                            return (
                                                lesson.name.toLowerCase().includes(searchTerm) ||
                                                lesson.subject?.name?.toLowerCase().includes(searchTerm) ||
                                                lesson.class?.name?.toLowerCase().includes(searchTerm) ||
                                                lesson.teacher?.name?.toLowerCase().includes(searchTerm)
                                            );
                                        })
                                        .map((lesson) => (
                                            <label
                                                key={lesson.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedLesson === lesson.id}
                                                    onChange={() => {
                                                        setValue("lessonId", lesson.id, {
                                                            shouldValidate: true,
                                                        });
                                                        setShowLessonDropdown(false);
                                                        setLessonSearch(""); // Clear search when lesson is selected
                                                    }}
                                                />
                                                <span className="ml-2 text-xs">
                                                    {lesson.name} - {lesson.subject?.name || 'No Subject'} ({lesson.class?.name || 'No Class'}) - {lesson.teacher?.name || 'No Teacher'}
                                                </span>
                                            </label>
                                        ))}
                                    {lessons
                                        .filter((lesson) => {
                                            const searchTerm = lessonSearch.toLowerCase();
                                            return (
                                                lesson.name.toLowerCase().includes(searchTerm) ||
                                                lesson.subject?.name?.toLowerCase().includes(searchTerm) ||
                                                lesson.class?.name?.toLowerCase().includes(searchTerm) ||
                                                lesson.teacher?.name?.toLowerCase().includes(searchTerm)
                                            );
                                        })
                                        .length === 0 && (
                                            <div className="px-2 py-1 text-xs text-gray-400">
                                                No lessons found
                                            </div>
                                        )}
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
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : ""}
                    register={register}
                    error={errors?.startTime}
                />
                <InputField
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : ""}
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

export default ExamForm;
