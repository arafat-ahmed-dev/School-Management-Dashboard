"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState } from "react";
import {
    getAllGrades,
    getAllTeachers,
    createClass,
    updateClass,
} from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    name: z.string().min(1, { message: "Class name is required!" }),
    classId: z.string().min(1, { message: "Class ID is required!" }),
    capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
    gradeId: z.string().min(1, { message: "Grade is required!" }),
    supervisorId: z.string().min(1, { message: "Supervisor is required!" }),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({
    type,
    data,
    onClose,
}: {
    type: "create" | "update";
    data?: any;
    onClose?: () => void;
}) => {
    const [grades, setGrades] = useState<{ id: string; level: number }[]>([]);
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
    const [gradeSearch, setGradeSearch] = useState("");
    const [teacherSearch, setTeacherSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || "",
            classId: data?.classId || "",
            capacity: data?.capacity || "",
            gradeId: data?.grade?.id || "",
            supervisorId: data?.supervisor?.id || "",
        },
    });

    const selectedGrade = watch("gradeId");
    const selectedSupervisor = watch("supervisorId");
    const watchAllFields = watch();

    // Reset form on data change
    useEffect(() => {
        if (data && type === "update") {
            reset({
                name: data.name || "",
                classId: data.classId || "",
                capacity: data.capacity || "",
                gradeId: data.grade?.id || "",
                supervisorId: data.supervisor?.id || "",
            });
        }
    }, [data, type, reset]);

    // Fetch grades and teachers
    useEffect(() => {
        (async () => {
            try {
                const [gradesResult, teachersResult] = await Promise.all([
                    getAllGrades(),
                    getAllTeachers(),
                ]);
                setGrades(gradesResult || []);
                setTeachers(teachersResult || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load form data");
            }
        })();
    }, []);

    const onSubmit = handleSubmit(async (formData: Inputs) => {
        try {
            if (type === "create") {
                const result = await createClass(formData);
                if (result.success) {
                    toast.success("Class created successfully!");
                    onClose?.();
                } else {
                    toast.error(result.error || "Failed to create class");
                }
            } else {
                const result = await updateClass(
                    data.id,
                    formData.name,
                    formData.gradeId,
                    formData.supervisorId,
                    formData.capacity.toString(),
                    formData.classId
                );
                if (result.success) {
                    toast.success("Class updated successfully!");
                    onClose?.();
                } else {
                    toast.error(result.error || "Failed to update Class");
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    });

    // Check if update should be disabled
    const isUpdateDisabled =
        type === "update" &&
        data &&
        data.name === watchAllFields.name &&
        data.classId === watchAllFields.classId &&
        data.capacity === watchAllFields.capacity &&
        data.grade?.id === watchAllFields.gradeId &&
        data.supervisor?.id === watchAllFields.supervisorId;

    return (
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new class" : "Update class"}
            </h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                    label="Class Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                    className="w-full"
                />
                <InputField
                    label="Class ID"
                    name="classId"
                    defaultValue={data?.classId}
                    register={register}
                    error={errors?.classId}
                    className="w-full"
                />
                <InputField
                    label="Capacity"
                    name="capacity"
                    type="number"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
                    className="w-full"
                />

                {/* Grade Dropdown */}
                <div className="col-span-1 flex flex-col">
                    <label className="mb-1 text-xs font-medium text-gray-600">
                        Grade
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowGradeDropdown((v) => !v)}
                        >
                            {selectedGrade
                                ? (grades.find((g) => g.id === selectedGrade)?.level ??
                                    "Select grade")
                                : "Select grade"}
                        </button>
                        {showGradeDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search grades..."
                                    className="w-full border-b border-gray-200 p-2 text-sm focus:outline-none"
                                    value={gradeSearch}
                                    onChange={(e) => setGradeSearch(e.target.value)}
                                />
                                <div className="max-h-40 overflow-y-auto">
                                    {grades
                                        .filter((g) => String(g.level).includes(gradeSearch))
                                        .map((grade) => (
                                            <label
                                                key={grade.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedGrade === grade.id}
                                                    onChange={() => {
                                                        setValue("gradeId", grade.id, {
                                                            shouldValidate: true,
                                                        });
                                                        setShowGradeDropdown(false);
                                                    }}
                                                />
                                                <span className="ml-2">{grade.level}</span>
                                            </label>
                                        ))}
                                    {grades.filter((g) => String(g.level).includes(gradeSearch))
                                        .length === 0 && (
                                            <div className="px-2 py-1 text-xs text-gray-400">
                                                No grades found
                                            </div>
                                        )}
                                </div>
                                <div className="flex justify-end p-2">
                                    <button
                                        type="button"
                                        className="text-xs text-blue-500 hover:underline"
                                        onClick={() => setShowGradeDropdown(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.gradeId && (
                        <p className="text-xs text-red-400">
                            {errors.gradeId.message as string}
                        </p>
                    )}
                </div>

                {/* Supervisor Dropdown */}
                <div className="col-span-1 flex flex-col">
                    <label className="mb-1 text-xs font-medium text-gray-600">
                        Supervisor
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowTeacherDropdown((v) => !v)}
                        >
                            {selectedSupervisor
                                ? (teachers.find((t) => t.id === selectedSupervisor)?.name ??
                                    "Select supervisor")
                                : "Select supervisor"}
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
                                        .filter((t) =>
                                            t.name.toLowerCase().includes(teacherSearch.toLowerCase())
                                        )
                                        .map((teacher) => (
                                            <label
                                                key={teacher.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedSupervisor === teacher.id}
                                                    onChange={() => {
                                                        setValue("supervisorId", teacher.id, {
                                                            shouldValidate: true,
                                                        });
                                                        setShowTeacherDropdown(false);
                                                    }}
                                                />
                                                <span className="ml-2">{teacher.name}</span>
                                            </label>
                                        ))}
                                    {teachers.filter((t) =>
                                        t.name.toLowerCase().includes(teacherSearch.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-2 py-1 text-xs text-gray-400">
                                                No teachers found
                                            </div>
                                        )}
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
                    {errors.supervisorId && (
                        <p className="text-xs text-red-400">
                            {errors.supervisorId.message as string}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isUpdateDisabled || isSubmitting}
                    className={`rounded-md px-6 py-2 text-white transition ${isUpdateDisabled || isSubmitting
                            ? "cursor-not-allowed bg-gray-300"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {isSubmitting ? "Saving..." : type === "create" ? "Create" : "Update"}
                </button>
            </div>
        </form>
    );
};

export default ClassForm;
