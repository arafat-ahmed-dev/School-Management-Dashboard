
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    recipient: z.string().min(1, { message: "Recipient is required!" }),
    subject: z.string().min(1, { message: "Subject is required!" }),
    content: z.string().min(1, { message: "Message content is required!" }),
});

type Inputs = z.infer<typeof schema>;

const MessageForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update message logic
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new message" : "Update message"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Recipient"
                    name="recipient"
                    defaultValue={data?.recipient}
                    register={register}
                    error={errors?.recipient}
                />
                <InputField
                    label="Subject"
                    name="subject"
                    defaultValue={data?.subject}
                    register={register}
                    error={errors?.subject}
                />
                <InputField
                    label="Message Content"
                    name="content"
                    defaultValue={data?.content}
                    register={register}
                    error={errors?.content}
                />
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default MessageForm;
