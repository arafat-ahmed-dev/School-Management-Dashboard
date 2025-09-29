
"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useMemo } from "react";


const schema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    phone: z.string().min(1, { message: "Phone is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
    img: z.any().optional(),
});

type Inputs = z.infer<typeof schema>;



const ParentForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    // Split name into firstName and lastName for edit
    const initialFirstName = useMemo(() => {
        if (data?.firstName) return data.firstName;
        if (data?.name) return data.name.split(" ")[0] || "";
        return "";
    }, [data]);
    
    const initialLastName = useMemo(() => {
        if (data?.lastName) return data.lastName;
        if (data?.name) return data.name.split(" ").slice(1).join(" ") || "";
        return "";
    }, [data]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...data,
            firstName: initialFirstName,
            lastName: initialLastName,
        },
    });

    const onSubmit = handleSubmit((formData) => {
        // Combine firstName and lastName into name
        const submitData = {
            ...formData,
            name: formData.firstName + (formData.lastName ? " " + formData.lastName : ""),
        };
        delete (submitData as any).firstName;
        delete (submitData as any).lastName;
        // TODO: handle create/update parent logic
        console.log(submitData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new parent" : "Update parent"}</h1>
            <span className="text-xs font-medium text-gray-400">Authentication Information</span>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                    inputProps={{
                        autoComplete: type === "update" ? "new-password" : "current-password"
                    }}
                />
            </div>
            <span className="text-xs font-medium text-gray-400">Personal Information</span>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="First Name"
                    name="firstName"
                    defaultValue={initialFirstName}
                    register={register}
                    error={errors.firstName}
                />
                <InputField
                    label="Last Name"
                    name="lastName"
                    defaultValue={initialLastName}
                    register={register}
                    error={errors.lastName}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <div className="flex w-full flex-col justify-center gap-2 md:w-1/4">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500" htmlFor="img">
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden" />
                    {errors.img?.message && (
                        <p className="text-xs text-red-400">{errors.img.message.toString()}</p>
                    )}
                </div>
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ParentForm;
