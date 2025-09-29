
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    studentId: z.string().min(1, { message: "Student ID is required!" }),
    subject: z.string().min(1, { message: "Subject is required!" }),
    score: z.number({ invalid_type_error: "Score must be a number!" }).min(0, { message: "Score is required!" }),
    remarks: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update result logic
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new result" : "Update result"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Student ID"
                    name="studentId"
                    defaultValue={data?.studentId}
                    register={register}
                    error={errors?.studentId}
                />
                <InputField
                    label="Subject"
                    name="subject"
                    defaultValue={data?.subject}
                    register={register}
                    error={errors?.subject}
                />
                <InputField
                    label="Score"
                    name="score"
                    type="number"
                    defaultValue={data?.score}
                    register={register}
                    error={errors?.score}
                />
                <InputField
                    label="Remarks"
                    name="remarks"
                    defaultValue={data?.remarks}
                    register={register}
                    error={errors?.remarks}
                />
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ResultForm;
