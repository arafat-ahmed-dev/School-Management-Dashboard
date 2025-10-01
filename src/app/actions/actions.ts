"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../prisma";
import { numberToDay } from "@/lib/types";
import { hashPassword } from "@/lib/argon2";
import { writeFile } from "fs/promises";
import { join } from "path";

// --- Get ALL Data Actions ---
export async function getAllGrades(props?: Record<string, boolean>) {
  return await prisma.grade.findMany({
    select: { id: true, level: true, ...(props ?? {}) },
    orderBy: { level: "asc" },
  });
}

export async function getAllTeachers(props?: Record<string, boolean>) {
  return await prisma.teacher.findMany({
    select: { id: true, name: true, ...(props ?? {}) },
    orderBy: { name: "asc" },
  });
}

export async function getAllSubjects(props?: Record<string, boolean>) {
  const includeClasses = props?.classes;
  const otherProps = { ...props };
  delete otherProps.classes;

  return await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
      ...(includeClasses ? { classes: { select: { id: true } } } : {}),
      ...otherProps,
    },
    orderBy: { name: "asc" },
  });
}

export async function getAllClasses(props?: Record<string, boolean>) {
  return await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      classId: true,
      ...(props ?? {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getAllLessons(props?: Record<string, boolean>) {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        subject: true,
        class: true,
        teacher: true,
        ...(props ?? {}),
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return { lessons, error: null };
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    return { lessons: [], error: "Failed to fetch lessons. Please try again." };
  }
}

/* export async function getClasses(props?: Record<string, boolean>) {
  try {
    const classes = await prisma.class.findMany({
      select: { id: true, name: true, ...(props ?? {}) },
      orderBy: {
        name: "asc",
      },
    });
    return { classes, error: null };
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return { classes: [], error: "Failed to fetch classes. Please try again." };
  }
}

export async function getTeachers(props?: Record<string, boolean>) {
  try {
    const teachers = await prisma.teacher.findMany({
      select: { id: true, name: true, ...(props ?? {}) },
      orderBy: {
        name: "asc",
      },
    });
    return { teachers, error: null };
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return {
      teachers: [],
      error: "Failed to fetch teachers. Please try again.",
    };
  }
}

export async function getSubjects(props?: Record<string, boolean>) {
  try {
    const subjects = await prisma.subject.findMany({
      select: { id: true, name: true, ...(props ?? {}) },
      orderBy: {
        name: "asc",
      },
    });
    return { subjects, error: null };
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return {
      subjects: [],
      error: "Failed to fetch subjects. Please try again.",
    };
  }
} */

// --- Lesson Actions ---
type CreateLessonInput = {
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  classId: string;
  teacherId: string;
};

export async function createLesson(input: CreateLessonInput) {
  try {
    const {
      name,
      dayOfWeek,
      startTime,
      endTime,
      subjectId,
      classId,
      teacherId,
    } = input;
    const startDate = new Date();
    const [startHour, startMinute] = startTime.split(":").map(Number);
    startDate.setHours(startHour, startMinute, 0, 0);
    const endDate = new Date();
    const [endHour, endMinute] = endTime.split(":").map(Number);
    endDate.setHours(endHour, endMinute, 0, 0);
    const day = numberToDay[dayOfWeek];
    const lesson = await prisma.lesson.create({
      data: {
        name,
        day,
        startTime: startDate,
        endTime: endDate,
        subjectId,
        classId,
        teacherId,
      },
    });
    revalidatePath("/schedule");
    return { lesson, error: null };
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return {
      lesson: null,
      error: "Failed to create lesson. Please try again.",
    };
  }
}

export async function deleteLesson(id: string) {
  try {
    await prisma.lesson.delete({
      where: { id },
    });
    revalidatePath("/schedule");
    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    return {
      success: false,
      error: "Failed to delete lesson. Please try again.",
    };
  }
}

export async function updateLesson(
  id: string,
  input: Partial<CreateLessonInput>
) {
  try {
    const {
      name,
      dayOfWeek,
      startTime,
      endTime,
      subjectId,
      classId,
      teacherId,
    } = input;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (dayOfWeek !== undefined) {
      updateData.day = numberToDay[dayOfWeek];
    }
    if (startTime) {
      const startDate = new Date();
      const [startHour, startMinute] = startTime.split(":").map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);
      updateData.startTime = startDate;
    }
    if (endTime) {
      const endDate = new Date();
      const [endHour, endMinute] = endTime.split(":").map(Number);
      endDate.setHours(endHour, endMinute, 0, 0);
      updateData.endTime = endDate;
    }
    if (subjectId) updateData.subjectId = subjectId;
    if (classId) updateData.classId = classId;
    if (teacherId) updateData.teacherId = teacherId;
    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/schedule");
    return { lesson, error: null };
  } catch (error) {
    console.error("Failed to update lesson:", error);
    return {
      lesson: null,
      error: "Failed to update lesson. Please try again.",
    };
  }
}

// --- Teacher Actions ---
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
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`;
  const uploadsDir = join(process.cwd(), "public", "uploads");
  const path = join(uploadsDir, fileName);
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
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }
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
    const hashedPassword = await hashPassword(formData.password!);
    const fullName = `${formData.firstName} ${formData.lastName}`;
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
    if (formData.img) {
      updateData.img = formData.img;
    }
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

// --- Subject Actions ---
export async function createSubject(
  name: string,
  code: string,
  subjectId: string,
  classIds: string[] | string,
  teacherIds: string[]
) {
  try {
    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        subjectId,
        teachers: {
          connect: teacherIds.map((id) => ({ id })),
        },
        classes: {
          connect: (Array.isArray(classIds) ? classIds : [classIds]).map(
            (id) => ({ id })
          ),
        },
      },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            classId: true,
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, data: subject };
  } catch (error) {
    console.error("Error creating subject:", error);
    if (error instanceof Error) {
      if (error.message.includes("code")) {
        return { success: false, error: "Subject code already exists" };
      }
      if (error.message.includes("subjectId")) {
        return { success: false, error: "Subject ID already exists" };
      }
    }
    return { success: false, error: "Failed to create subject" };
  }
}

export async function updateSubject(
  id: string,
  name: string,
  code: string,
  classIds: string[],
  teacherIds: string[]
) {
  console.log(id, name, code, classIds, teacherIds);

  try {
    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        code,
        teachers: {
          set: teacherIds.map((id) => ({ id })),
        },
        classes: {
          set: classIds.map((id) => ({ id })),
        },
      },
      include: {
        teachers: true,
        classes: {
          include: {
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, data: subject };
  } catch (error) {
    console.error("Error updating subject:", error);
    return { success: false, error: "Failed to update subject" };
  }
}

export async function deleteSubject(id: string) {
  try {
    await prisma.exam.deleteMany({
      where: { lesson: { subjectId: id } },
    });
    await prisma.assignment.deleteMany({
      where: { lesson: { subjectId: id } },
    });

    await prisma.attendance.deleteMany({
      where: { lesson: { subjectId: id } },
    });

    await prisma.lesson.deleteMany({
      where: { subjectId: id },
    });

    await prisma.subject.delete({
      where: { id },
    });
    revalidatePath("/list/subjects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error: "Failed to delete subject" };
  }
}

// --- Class Actions ---
export type CreateClassInput = {
  id?: string;
  name: string;
  gradeId: string;
  supervisorId: string;
  capacity: string | number;
  classId: string;
};
export async function createClass({
  name,
  gradeId,
  supervisorId,
  capacity,
  classId,
}: CreateClassInput) {
  try {
    await prisma.class.create({
      data: {
        name,
        grade: { connect: { id: gradeId } },
        supervisor: { connect: { id: supervisorId } },
        capacity: Number(capacity),
        classId,
      },
    });
    revalidatePath("/list/classes");
    return { success: true };
  } catch (error) {
    console.error("Error creating class:", error);
    return { success: false, error: "Failed to create class" };
  }
}
export async function updateClass(
  id: string,
  name: string,
  gradeId: string,
  supervisorId: string,
  capacity: string,
  classId: string
) {
  try {
    console.log("updateClass args:", {
      id,
      name,
      gradeId,
      supervisorId,
      capacity,
      classId,
    });
    await prisma.class.update({
      where: { id },
      data: {
        name,
        grade: { connect: { id: gradeId } },
        supervisor: { connect: { id: supervisorId } },
        capacity: Number(capacity),
        classId,
      },
    });
    revalidatePath("/list/classes");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating class:", error);
    return {
      success: false,
      error: error?.message || "Failed to update class",
    };
  }
}
export async function deleteClass(id: string) {
  try {
    await prisma.exam.deleteMany({
      where: { lesson: { classId: id } },
    });
    await prisma.assignment.deleteMany({
      where: { lesson: { classId: id } },
    });
    await prisma.attendance.deleteMany({
      where: { lesson: { classId: id } },
    });
    await prisma.lesson.deleteMany({
      where: { classId: id },
    });
    await prisma.class.delete({
      where: { id },
    });
    revalidatePath("/list/classes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting class:", error);
    return { success: false, error: "Failed to delete class" };
  }
}

// make all the deleted functions above available for import from this file
export async function deleteStudent(id: string) {}
export async function deleteParent(id: string) {}
export async function deleteExam(id: string) {}
export async function deleteAssignment(id: string) {}
export async function deleteResult(id: string) {}
export async function deleteAttendance(id: string) {}
export async function deleteEvent(id: string) {}
export async function deleteMessage(id: string) {}
export async function deleteAnnouncement(id: string) {}
