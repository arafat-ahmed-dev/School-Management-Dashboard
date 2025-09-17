"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../prisma";
import { hashPassword } from "@/lib/argon2";
import { writeFile } from "fs/promises";
import { join } from "path";

export type TeacherFormData = {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  birthday: string; // ISO date string
  sex: "male" | "female";
  img?: string; // Only string paths for images
};

async function handleImageUpload(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`;
  const uploadsDir = join(process.cwd(), "public", "uploads");
  const path = join(uploadsDir, fileName);

  // Ensure the uploads directory exists
  const fs = require("fs");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  await writeFile(path, buffer);
  return `/uploads/${fileName}`;
}

export async function uploadTeacherImage(
  formData: FormData
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
  try {
    const file = formData.get("img") as File;

    if (!file || !(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File size too large. Maximum 5MB allowed",
      };
    }

    const imagePath = await handleImageUpload(file);
    return { success: true, imagePath };
  } catch (error) {
    console.error("Image upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function createTeacher(formData: TeacherFormData) {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(formData.password!);

    // Combine firstName and lastName into name
    const fullName = `${formData.firstName} ${formData.lastName}`;

    // Convert birthday string to Date
    const birthday = new Date(formData.birthday);

    const teacher = await prisma.teacher.create({
      data: {
        username: formData.username,
        password: hashedPassword,
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        img: formData.img,
        bloodType: formData.bloodType,
        birthday,
        sex: formData.sex.toUpperCase() as "MALE" | "FEMALE",
        approved: "PENDING",
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, data: teacher };
  } catch (error) {
    console.error("Error creating teacher:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("username")) {
        return { success: false, error: "Username already exists" };
      }
      if (error.message.includes("email")) {
        return { success: false, error: "Email already exists" };
      }
      if (error.message.includes("phone")) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    return { success: false, error: "Failed to create teacher" };
  }
}

export async function updateTeacher(id: string, formData: TeacherFormData) {
  try {
    // Prepare update data
    const updateData: any = {
      username: formData.username,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      bloodType: formData.bloodType,
      birthday: new Date(formData.birthday),
      sex: formData.sex.toUpperCase() as "MALE" | "FEMALE",
    };

    // Only update image if provided
    if (formData.img) {
      updateData.img = formData.img;
    }

    // Only update password if provided
    if (formData.password && formData.password.trim() !== "") {
      updateData.password = await hashPassword(formData.password);
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/list/teachers");
    return { success: true, data: teacher };
  } catch (error) {
    console.error("Error updating teacher:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("username")) {
        return { success: false, error: "Username already exists" };
      }
      if (error.message.includes("email")) {
        return { success: false, error: "Email already exists" };
      }
      if (error.message.includes("phone")) {
        return { success: false, error: "Phone number already exists" };
      }
    }

    return { success: false, error: "Failed to update teacher" };
  }
}

export async function getTeacherById(id: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: true,
      },
    });

    if (!teacher) {
      return { success: false, error: "Teacher not found" };
    }

    // Transform data for the form
    const [firstName, ...lastNameParts] = teacher.name.split(" ");
    const formData = {
      ...teacher,
      firstName,
      lastName: lastNameParts.join(" "),
      birthday: teacher.birthday?.toISOString().split("T")[0] || "",
      sex: teacher.sex?.toLowerCase() as "male" | "female",
    };

    return { success: true, data: formData };
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return { success: false, error: "Failed to fetch teacher" };
  }
}

export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({
      where: { id },
    });

    revalidatePath("/list/teachers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { success: false, error: "Failed to delete teacher" };
  }
}
