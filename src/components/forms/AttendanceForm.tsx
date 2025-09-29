
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    studentId: z.string().min(1, { message: "Student ID is required!" }),
    date: z.string().min(1, { message: "Date is required!" }),
    status: z.enum(["present", "absent", "late"], { message: "Status is required!" }),
    remarks: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const AttendanceForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle create/update attendance logic
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new attendance record" : "Update attendance record"}</h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Student ID"
                    name="studentId"
                    defaultValue={data?.studentId}
                    register={register}
                    error={errors?.studentId}
                />
                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={data?.date}
                    register={register}
                    error={errors?.date}
                />
                <div className="flex w-full flex-col gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Status</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register("status")}
                        defaultValue={data?.status}
                    >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                    </select>
                    {errors.status?.message && (
                        <p className="text-xs text-red-400">{errors.status.message.toString()}</p>
                    )}
                </div>
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

export default AttendanceForm;
