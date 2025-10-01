"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState } from "react";
import { getAllTeachers, getAllSubjects, getAllClasses, createSubject, updateSubject } from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    name: z.string().min(1, { message: "Subject name is required!" }),
    code: z.string().min(1, { message: "Subject code is required!" }),
    subjectId: z.string().min(1, { message: "Subject ID is required!" }),
    teachers: z.array(z.string()).min(1, { message: "Select at least one teacher!" }),
    classes: z.array(z.string()).min(1, { message: "Select at least one class!" }),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
    type,
    data,
    onClose
}: {
    type: "create" | "update";
    data?: any;
    onClose?: () => void;
}) => {
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
    const [classes, setClasses] = useState<{ id: string; name: string; classId: string }[]>([]);
    const [subjects, setSubjects] = useState<{
        id: string;
        name: string;
        code: string;
        subjectId: string;
        classIds: string[];
    }[]>([]);
    const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const [teacherSearch, setTeacherSearch] = useState("");
    const [classSearch, setClassSearch] = useState("");
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
            teachers: data?.teachers?.map((t: any) => t.id) || [],
            classes: data?.classes?.map((c: any) => c.id) || [],
            name: data?.name || "",
            code: data?.code || "",
            subjectId: data?.subjectId || "",
        },
    });

    const selectedTeachers = watch("teachers");
    const selectedClasses = watch("classes");
    const watchAllFields = watch();
    
    // Reset form when data changes (important for edit mode)
    useEffect(() => {
        if (data && type === "update") {
            reset({
                teachers: data.teachers?.map((t: any) => t.id) || [],
                classes: data.classes?.map((c: any) => c.id) || [],
                name: data.name || "",
                code: data.code || "",
                subjectId: data.subjectId || "",
            });
        }
    }, [data, type, reset]);

    // Fetch all data on mount
    useEffect(() => {
        (async () => {
            try {
                const [teachersResult, classesResult, subjectsResult] = await Promise.all([
                    getAllTeachers({ email: true }),
                    getAllClasses({
                        classId: true,
                    }),
                    getAllSubjects({
                        code: true,
                        subjectId: true,
                        classes: true
                    }),
                ]);                
                setTeachers(teachersResult || []);
                setClasses((classesResult || []).map((cls: any) => ({
                    id: cls.id,
                    name: cls.name,
                    classId: cls.classId || '',
                })));
                setSubjects(
                    (subjectsResult || []).map((subject: any) => ({
                        id: subject.id,
                        name: subject.name,
                        code: subject.code ?? "",
                        subjectId: subject.subjectId ?? "",
                        classIds: subject.classes?.map((c: any) => c.id) || [],
                    }))
                );
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load form data");
            }
        })();
    }, []);

    const onSubmit = handleSubmit(async (formData) => {
        setIsSubmitting(true);
        console.log("Form Data:", formData);

        try {
            if (type === "create") {
                const result = await createSubject(
                    formData.name,
                    formData.code,
                    formData.subjectId,
                    formData.classes,
                    formData.teachers
                );

                if (result.success) {
                    toast.success("Subject created successfully!");
                    onClose?.();
                } else {
                    toast.error(result.error || "Failed to create subject");
                }
            } else {
                const result = await updateSubject(
                    data.id,
                    formData.name,
                    formData.code,
                    formData.classes,
                    formData.teachers
                );

                if (result.success) {
                    toast.success("Subject updated successfully!");
                    onClose?.();
                } else {
                    toast.error(result.error || "Failed to update subject");
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    });

    // Check if anything changed in update mode
    const isUpdateDisabled =
        type === "update" &&
        data &&
        data.name === watchAllFields.name &&
        data.code === watchAllFields.code &&
        data.subjectId === watchAllFields.subjectId &&
        JSON.stringify(data.teachers?.map((t: any) => t.id)?.sort() || []) ===
        JSON.stringify(watchAllFields.teachers?.sort() || []) &&
        JSON.stringify(data.classes?.map((c: any) => c.id)?.sort() || []) ===
        JSON.stringify(watchAllFields.classes?.sort() || []);

    return (
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new subject" : "Update subject"}
            </h1>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Subject Name / Selector */}
                {type === "create" ? (
                    <>
                        <InputField
                            label="Subject Name"
                            name="name"
                            defaultValue={data?.name}
                            register={register}
                            error={errors?.name}
                            className="w-full"
                        />
                        <InputField
                            label="Subject ID"
                            name="subjectId"
                            defaultValue={data?.subjectId}
                            register={register}
                            error={errors?.subjectId}
                            className="w-full"
                        />
                    </>
                ) : (
                        <div className="col-span-1 flex flex-col">
                            <label className="mb-1 text-xs font-medium text-gray-600">Subject</label>
                            <select
                                value={watch("name")}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => {
                                    const selected = subjects.find((s) => s.name === e.target.value);
                                    if (selected) {
                                        setValue("name", selected.name, { shouldValidate: true });
                                        setValue("code", selected.code, { shouldValidate: true });
                                        setValue("subjectId", selected.subjectId, { shouldValidate: true });
                                        setValue("classes", selected.classIds, { shouldValidate: true });
                                        setValue("teachers", data.teachers?.map((t: any) => t.id) || [], { shouldValidate: true });
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    Select a subject
                                </option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                            {errors.name && (
                                <p className="text-xs text-red-400">{errors.name.message as string}</p>
                            )}
                        </div>
                )}

                {/* Subject Code */}
                <InputField
                    label="Subject Code"
                    name="code"
                    defaultValue={data?.code}
                    register={register}
                    error={errors?.code}
                />
                <InputField
                    label="Subject ID"
                    name="subjectId"
                    defaultValue={data?.subjectId}
                    register={register}
                    error={errors?.code}
                />

                {/* Classes Dropdown */}
                <div className="col-span-1 flex flex-col md:col-span-2">
                    <label className="mb-1 text-xs font-medium text-gray-600">
                        Classes <span className="text-xs text-gray-400">(Students will be auto-assigned)</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowClassDropdown((v) => !v)}
                        >
                            {selectedClasses && selectedClasses.length > 0
                                ? classes
                                    .filter((c) => selectedClasses.includes(c.id))
                                    .map((c) => c.name)
                                    .join(", ")
                                : "Select class(es)"}
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
                                        .filter((c) =>
                                            c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
                                            c.classId.toLowerCase().includes(classSearch.toLowerCase())
                                        )
                                        .map((cls) => (
                                            <label
                                                key={cls.id}
                                                className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClasses?.includes(cls.id) || false}
                                                    onChange={(e) => {
                                                        let newSelected = selectedClasses ? [...selectedClasses] : [];
                                                        if (e.target.checked) {
                                                            newSelected.push(cls.id);
                                                        } else {
                                                            newSelected = newSelected.filter((id) => id !== cls.id);
                                                        }
                                                        setValue("classes", newSelected, {
                                                            shouldValidate: true,
                                                        });
                                                    }}
                                                />
                                                <span className="ml-2">{cls.name} ({cls.classId})</span>
                                            </label>
                                        ))}

                                    {classes.filter((c) =>
                                        c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
                                        c.classId.toLowerCase().includes(classSearch.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-2 py-1 text-xs text-gray-400">
                                                No classes found
                                            </div>
                                        )}
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
                    {errors.classes && (
                        <p className="text-xs text-red-400">{errors.classes.message as string}</p>
                    )}
                </div>

                {/* Teachers Dropdown */}
                <div className="col-span-1 flex flex-col md:col-span-2">
                    <label className="mb-1 text-xs font-medium text-gray-600">Teachers</label>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setShowTeacherDropdown((v) => !v)}
                        >
                            {selectedTeachers && selectedTeachers.length > 0
                                ? teachers
                                    .filter((t) => selectedTeachers.includes(t.id))
                                    .map((t) => t.name)
                                    .join(", ")
                                : "Select teacher(s)"}
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
                                                    type="checkbox"
                                                    checked={selectedTeachers?.includes(teacher.id) || false}
                                                    onChange={(e) => {
                                                        let newSelected = selectedTeachers ? [...selectedTeachers] : [];
                                                        if (e.target.checked) {
                                                            newSelected.push(teacher.id);
                                                        } else {
                                                            newSelected = newSelected.filter((id) => id !== teacher.id);
                                                        }
                                                        setValue("teachers", newSelected, {
                                                            shouldValidate: true,
                                                        });
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
                    {errors.teachers && (
                        <p className="text-xs text-red-400">{errors.teachers.message as string}</p>
                    )}
                </div>
            </div>

            {/* Footer */}
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
                    {isSubmitting
                        ? "Saving..."
                        : type === "create"
                            ? "Create"
                            : "Update"
                    }
                </button>
            </div>
        </form>
    );
};

export default SubjectForm;