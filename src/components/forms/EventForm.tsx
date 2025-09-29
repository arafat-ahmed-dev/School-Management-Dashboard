
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    title: z.string().min(1, { message: "Event title is required!" }),
    date: z.string().min(1, { message: "Date is required!" }),
    location: z.string().min(1, { message: "Location is required!" }),
    description: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const EventForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update event logic
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new event" : "Update event"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Event Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={data?.date}
                    register={register}
                    error={errors?.date}
                />
                <InputField
                    label="Location"
                    name="location"
                    defaultValue={data?.location}
                    register={register}
                    error={errors?.location}
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

export default EventForm;
