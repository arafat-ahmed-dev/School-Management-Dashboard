"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import React, { useEffect, useState } from "react";
import { getAllGrades, getAllTeachers } from "@/app/actions/actions";

const schema = z.object({
    name: z.string().min(1, { message: "Class name is required!" }),
    code: z.string().min(1, { message: "Class code is required!" }),
    capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
    grade: z.string().min(1, { message: "Grade is required!" }),
    supervisor: z.string().min(1, { message: "Supervisor is required!" }),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const [grades, setGrades] = useState<{ id: string; level: number }[]>([]);
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            grade: data?.grade?.id || "",
            supervisor: data?.supervisor?.id || "",
        },
    });

    useEffect(() => {
        (async () => {
            setGrades(await getAllGrades());
            setTeachers(await getAllTeachers());
        })();
    }, []);

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update class logic
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new class" : "Update class"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Class Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Class Code"
                    name="code"
                    defaultValue={data?.code}
                    register={register}
                    error={errors?.code}
                />
                <InputField
                    label="Capacity"
                    name="capacity"
                    type="number"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
                />
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Grade</label>
                    <select
                        {...register("grade")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        defaultValue={data?.grade?.id || ""}
                    >
                        <option value="">Select grade</option>
                        {grades.map((grade) => (
                            <option key={grade.id} value={grade.id}>
                                {grade.level}
                            </option>
                        ))}
                    </select>
                    {errors.grade && (
                        <p className="text-xs text-red-400">{errors.grade.message as string}</p>
                    )}
                </div>
                <div className="mb-1 flex w-full flex-col md:w-1/2">
                    <label className="mb-1 text-xs text-gray-500">Supervisor</label>
                    <select
                        {...register("supervisor")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        defaultValue={data?.supervisor?.id || ""}
                    >
                        <option value="">Select supervisor</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                    {errors.supervisor && (
                        <p className="text-xs text-red-400">{errors.supervisor.message as string}</p>
                    )}
                </div>
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ClassForm;
