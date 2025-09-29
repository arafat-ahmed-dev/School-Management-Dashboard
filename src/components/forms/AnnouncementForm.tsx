
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required!" }),
    content: z.string().min(1, { message: "Content is required!" }),
    date: z.string().min(1, { message: "Date is required!" }),
});

type Inputs = z.infer<typeof schema>;

const AnnouncementForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update announcement logic
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new announcement" : "Update announcement"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                <InputField
                    label="Content"
                    name="content"
                    defaultValue={data?.content}
                    register={register}
                    error={errors?.content}
                />
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

export default AnnouncementForm;
