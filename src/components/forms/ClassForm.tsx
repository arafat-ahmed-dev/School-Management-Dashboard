
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    name: z.string().min(1, { message: "Class name is required!" }),
    code: z.string().min(1, { message: "Class code is required!" }),
    description: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

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
                    label="Description"
                    name="description"
                    defaultValue={data?.description}
                    register={register}
                    error={errors?.description}
                />
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ClassForm;
