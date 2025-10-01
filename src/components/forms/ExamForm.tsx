"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState } from "react";
import { getAllSubjects, getAllClasses, getAllTeachers } from "@/app/actions/actions";

const schema = z.object({
    title: z.string().min(1, { message: "Exam title is required!" }),
    subject: z.string().min(1, { message: "Subject is required!" }),
    class: z.string().min(1, { message: "Class is required!" }),
    teacher: z.string().min(1, { message: "Teacher is required!" }),
    date: z.string().min(1, { message: "Date is required!" }),
});

type Inputs = z.infer<typeof schema>;

const ExamForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            subject: data?.subject?.id || "",
            class: data?.class?.id || "",
            teacher: data?.teacher?.id || "",
        },
    });

    useEffect(() => {
        (async () => {
            setSubjects(await getAllSubjects());
            setClasses(await getAllClasses());
            setTeachers(await getAllTeachers());
        })();
    }, []);

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update exam logic
        console.log(formData);
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
                    <label className="mb-1 text-xs text-gray-500">Subject</label>
                    <select
                        {...register("subject")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        defaultValue={data?.subject?.id || ""}
                    >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subject && (
                        <p className="text-xs text-red-400">{errors.subject.message as string}</p>
                    )}
                </div>
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Class</label>
                    <select
                        {...register("class")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        defaultValue={data?.class?.id || ""}
                    >
                        <option value="">Select class</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                    {errors.class && (
                        <p className="text-xs text-red-400">{errors.class.message as string}</p>
                    )}
                </div>
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Teacher</label>
                    <select
                        {...register("teacher")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        defaultValue={data?.teacher?.id || ""}
                    >
                        <option value="">Select teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                    {errors.teacher && (
                        <p className="text-xs text-red-400">{errors.teacher.message as string}</p>
                    )}
                </div>
                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={data?.date}
                    register={register}
                    error={errors?.date}
                />
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ExamForm;
