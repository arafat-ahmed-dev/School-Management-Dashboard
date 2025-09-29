"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import InputField from "../InputField";
import React, { useState } from "react";
import { toast } from "sonner";
import { createTeacher, updateTeacher, TeacherFormData, uploadTeacherImage } from "@/app/actions/teacher-actions";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .or(z.literal("")),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  img: z
    .any()
    .refine((files) => {
      // If no file is provided and it's an update, allow it
      if (!files || files.length === 0) return true;
      // If files is a FileList, check the first file
      if (files instanceof FileList) {
        return files.length > 0 && files[0] instanceof File;
      }
      // If it's already a File, it's valid
      return files instanceof File;
    }, { message: "Please select a valid image file" })
    .optional(),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split name for edit mode
  const initialFirstName = data?.name ? data.name.split(" ")[0] : data?.firstName;
  const initialLastName = data?.name ? data.name.split(" ").slice(1).join(" ") : data?.lastName;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName("");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsSubmitting(true);
      toast.loading(`${type === 'create' ? 'Creating' : 'Updating'} teacher...`);

      // Handle image upload first if a new file is selected
      let imagePath = data?.img; // Keep existing image for updates
      const fileInput = document.getElementById('img') as HTMLInputElement;
      if (fileInput?.files && fileInput.files[0]) {
        toast.loading('Uploading image...');
        const imageFormData = new FormData();
        imageFormData.append('img', fileInput.files[0]);

        const uploadResult = await uploadTeacherImage(imageFormData);
        if (uploadResult.success) {
          imagePath = uploadResult.imagePath;
          toast.success('Image uploaded successfully!');
        } else {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }
      }

      // Combine firstName and lastName for backend
      const teacherData: TeacherFormData = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        bloodType: formData.bloodType,
        birthday: formData.birthday.toISOString().split('T')[0],
        sex: formData.sex,
        img: imagePath,
      };

      // Call the appropriate server action
      let result;
      if (type === 'create') {
        result = await createTeacher(teacherData);
      } else {
        result = await updateTeacher(data.id, teacherData);
      }

      if (result.success) {
        toast.success(`Teacher ${type === 'create' ? 'created' : 'updated'} successfully!`);
        // Optionally redirect or close modal
      } else {
        throw new Error(result.error || 'Operation failed');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Error ${type === 'create' ? 'creating' : 'updating'} teacher: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  });
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update teacher"}
      </h1>
      <span className="text-xs font-medium text-gray-400">
        Authentication Information
      </span>
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
            placeholder: type === "update" ? "Leave empty to keep current password" : "••••••••",
            autoComplete: type === "update" ? "new-password" : "current-password"
          }}
        />
      </div>
      <span className="text-xs font-medium text-gray-400">
        Personal Information
      </span>
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
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={
            data?.birthday
              ? new Date(data.birthday).toISOString().split('T')[0]
              : ""
          }
          register={register}
          error={errors.birthday}
          type="date"
        />
        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col justify-center gap-2 md:w-1/4">
          <label
            className="flex cursor-pointer items-center gap-2 text-xs text-gray-500"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input
            type="file"
            id="img"
            {...register("img")}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {selectedFileName && (
            <p className="text-xs text-green-600">Selected: {selectedFileName}</p>
          )}
          {data?.img && !selectedFileName && (
            <p className="text-xs text-gray-500">Current: {data.img}</p>
          )}
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button
        className="rounded-md bg-blue-400 p-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Processing..."
          : type === "create" ? "Create" : "Update"
        }
      </button>
    </form>
  );
};

export default TeacherForm;
