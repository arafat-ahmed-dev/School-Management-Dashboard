"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../prisma";
import { numberToDay } from "@/lib/types";
import { hashPassword } from "@/lib/hash";
import { writeFile } from "fs/promises";
import { join } from "path";
import { requireServerRole } from "@/lib/access-control";

// --- Get ALL Data Actions ---
export async function getAllGrades(props?: Record<string, boolean>) {
  const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
  if (!auth.authorized) return [];

  return await prisma.grade.findMany({
    select: { id: true, level: true, ...(props ?? {}) },
    orderBy: { level: "asc" },
  });
}

export async function getAllTeachers(props?: Record<string, boolean>) {
  const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
  if (!auth.authorized) return [];

  return await prisma.teacher.findMany({
    select: { id: true, name: true, ...(props ?? {}) },
    orderBy: { name: "asc" },
  });
}

export async function getAllSubjects(props?: Record<string, boolean>) {
  const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
  if (!auth.authorized) return [];

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
  const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
  if (!auth.authorized) return [];

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

export async function getAllStudents(props?: Record<string, boolean>) {
  const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
  if (!auth.authorized) return [];

  return await prisma.student.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      class: {
        select: {
          id: true,
          name: true,
        },
      },
      ...(props ?? {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getAllLessons(props?: Record<string, boolean>) {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return { lessons: [], error: auth.error };

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

export async function getAllExams(props?: Record<string, boolean>) {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return { exams: [], error: auth.error };

  try {
    const exams = await prisma.exam.findMany({
      include: {
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
        ...(props ?? {}),
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return { exams, error: null };
  } catch (error) {
    console.error("Failed to fetch exams:", error);
    return { exams: [], error: "Failed to fetch exams. Please try again." };
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
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { lesson: null, error: auth.error };

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
        createdAt: new Date(),
        updatedAt: new Date(),
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
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid lesson ID provided.",
      };
    }

    // First check if the lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        exams: true,
        assignments: true,
        attendances: true,
      },
    });

    if (!existingLesson) {
      return {
        success: false,
        error: "Lesson not found.",
      };
    }

    await prisma.exam.deleteMany({ where: { lessonId: id } });
    await prisma.assignment.deleteMany({ where: { lessonId: id } });
    await prisma.attendance.deleteMany({ where: { lessonId: id } });

    // If no related records, proceed with deletion
    await prisma.lesson.delete({
      where: { id },
    });

    revalidatePath("/schedule");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Failed to delete lesson:", error);

    if (error.code === "P2025") {
      return {
        success: false,
        error: "Lesson not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid lesson ID format.",
      };
    }

    if (error.code === "P2014") {
      return {
        success: false,
        error:
          "Cannot delete lesson. It has related records that must be deleted first.",
      };
    }

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
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { lesson: null, error: auth.error };

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

    // Always update the updatedAt field
    updateData.updatedAt = new Date();

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };
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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };
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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
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
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

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
export async function deleteStudent(id: string) {
  try {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };
    await prisma.student.delete({ where: { id } });
    revalidatePath("/list/students");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}
export async function deleteParent(id: string) {
  try {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };
    await prisma.parent.delete({ where: { id } });
    revalidatePath("/list/parents");
    return { success: true };
  } catch (error) {
    console.error("Error deleting parent:", error);
    return { success: false, error: "Failed to delete parent" };
  }
}
export async function deleteMessage(id: string) {
  try {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete message" };
  }
}

// --- Result Actions ---
type CreateResultInput = {
  score: number;
  maxScore: number;
  examId: string; // Made required since we focus on exams for Bangladesh system
  studentId: string;
};

export async function getAllResults() {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return [];

  try {
    const results = await prisma.result.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        exam: {
          include: {
            lesson: {
              include: {
                subject: true,
                class: true,
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              include: {
                subject: true,
                class: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return results;
  } catch (error) {
    console.error("Failed to fetch results:", error);
    return [];
  }
}

export async function createResult(input: CreateResultInput) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { result: null, error: auth.error };

  try {
    // Validate that examId is provided
    if (!input.examId) {
      return {
        result: null,
        error: "Exam must be selected.",
      };
    }

    // Validate student exists
    const student = await prisma.student.findUnique({
      where: { id: input.studentId },
    });

    if (!student) {
      return {
        result: null,
        error: "Selected student not found.",
      };
    }

    // Validate exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: input.examId },
    });

    if (!exam) {
      return {
        result: null,
        error: "Selected exam not found.",
      };
    }

    // Check if result already exists for this student and exam
    const existingResult = await prisma.result.findFirst({
      where: {
        studentId: input.studentId,
        examId: input.examId,
      },
    });

    if (existingResult) {
      return {
        result: null,
        error: "Result already exists for this student and exam.",
      };
    }

    // Validate score
    if (input.score < 0) {
      return {
        result: null,
        error: "Score cannot be negative.",
      };
    }

    if (input.score > input.maxScore) {
      return {
        result: null,
        error: "Score cannot exceed maximum score.",
      };
    }

    const result = await prisma.result.create({
      data: {
        score: input.score,
        maxScore: input.maxScore,
        studentId: input.studentId,
        examId: input.examId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        exam: {
          include: {
            lesson: {
              include: {
                subject: true,
                class: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/list/results");
    return {
      result,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create result:", error);
    return {
      result: null,
      error: "Failed to create result. Please try again.",
    };
  }
}

export async function updateResult(
  id: string,
  input: Partial<CreateResultInput>
) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { result: null, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        result: null,
        error: "Invalid result ID provided.",
      };
    }

    // First check if the result exists
    const existingResult = await prisma.result.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return {
        result: null,
        error: "Result not found.",
      };
    }

    const updateData: any = {};

    // Validate score if provided
    if (input.score !== undefined) {
      if (input.score < 0) {
        return {
          result: null,
          error: "Score cannot be negative.",
        };
      }
      updateData.score = input.score;
    }

    // Validate maxScore if provided
    if (input.maxScore !== undefined) {
      if (input.maxScore <= 0) {
        return {
          result: null,
          error: "Maximum score must be greater than zero.",
        };
      }
      updateData.maxScore = input.maxScore;
    }

    // Validate that score doesn't exceed maxScore
    const finalScore =
      input.score !== undefined ? input.score : existingResult.score;
    const finalMaxScore =
      input.maxScore !== undefined ? input.maxScore : existingResult.maxScore;

    if (finalScore > finalMaxScore) {
      return {
        result: null,
        error: "Score cannot exceed maximum score.",
      };
    }

    // Validate student if provided
    if (input.studentId) {
      const student = await prisma.student.findUnique({
        where: { id: input.studentId },
      });

      if (!student) {
        return {
          result: null,
          error: "Selected student not found.",
        };
      }
      updateData.studentId = input.studentId;
    }

    // Validate exam if provided
    if (input.examId) {
      const exam = await prisma.exam.findUnique({
        where: { id: input.examId },
      });

      if (!exam) {
        return {
          result: null,
          error: "Selected exam not found.",
        };
      }
      updateData.examId = input.examId;
    }

    const result = await prisma.result.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        exam: {
          include: {
            lesson: {
              include: {
                subject: true,
                class: true,
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              include: {
                subject: true,
                class: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/list/results");
    return {
      result,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        result: null,
        error: "Result not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        result: null,
        error: "Invalid result ID format.",
      };
    }

    console.error("Failed to update result:", error);
    return {
      result: null,
      error: "Failed to update result. Please try again.",
    };
  }
}

export async function deleteResult(id: string) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid result ID provided.",
      };
    }

    // First check if the result exists
    const existingResult = await prisma.result.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return {
        success: false,
        error: "Result not found.",
      };
    }

    // Delete the result
    await prisma.result.delete({
      where: { id },
    });

    revalidatePath("/list/results");
    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Result not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid result ID format.",
      };
    }

    console.error("Failed to delete result:", error);
    return {
      success: false,
      error: "Failed to delete result. Please try again.",
    };
  }
}

// --- Event Actions ---
type CreateEventInput = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  classId?: string;
};

export async function getAllEvents() {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return [];

  try {
    const events = await prisma.event.findMany({
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function createEvent(input: CreateEventInput) {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { event: null, error: auth.error };

  try {
    // Validate dates
    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return {
        event: null,
        error: "Invalid date format provided.",
      };
    }

    if (startTime >= endTime) {
      return {
        event: null,
        error: "Start time must be before end time.",
      };
    }

    // Validate class if provided
    if (input.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: input.classId },
      });

      if (!classExists) {
        return {
          event: null,
          error: "Selected class not found.",
        };
      }
    }

    const event = await prisma.event.create({
      data: {
        title: input.title,
        description: input.description,
        startTime,
        endTime,
        ...(input.classId && { classId: input.classId }),
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/list/events");
    return {
      event,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create event:", error);
    return {
      event: null,
      error: "Failed to create event. Please try again.",
    };
  }
}

export async function updateEvent(
  id: string,
  input: Partial<CreateEventInput>
) {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { event: null, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        event: null,
        error: "Invalid event ID provided.",
      };
    }

    // First check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return {
        event: null,
        error: "Event not found.",
      };
    }

    const updateData: any = {};

    // Validate and update dates if provided
    if (input.startTime) {
      const startTime = new Date(input.startTime);
      if (isNaN(startTime.getTime())) {
        return {
          event: null,
          error: "Invalid start time format.",
        };
      }
      updateData.startTime = startTime;
    }

    if (input.endTime) {
      const endTime = new Date(input.endTime);
      if (isNaN(endTime.getTime())) {
        return {
          event: null,
          error: "Invalid end time format.",
        };
      }
      updateData.endTime = endTime;
    }

    // Validate that start time is before end time
    const finalStartTime = input.startTime
      ? new Date(input.startTime)
      : existingEvent.startTime;
    const finalEndTime = input.endTime
      ? new Date(input.endTime)
      : existingEvent.endTime;

    if (finalStartTime >= finalEndTime) {
      return {
        event: null,
        error: "Start time must be before end time.",
      };
    }

    // Update other fields
    if (input.title) updateData.title = input.title;
    if (input.description !== undefined)
      updateData.description = input.description;

    // Validate class if provided
    if (input.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: input.classId },
      });

      if (!classExists) {
        return {
          event: null,
          error: "Selected class not found.",
        };
      }
      updateData.classId = input.classId;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/list/events");
    return {
      event,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        event: null,
        error: "Event not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        event: null,
        error: "Invalid event ID format.",
      };
    }

    console.error("Failed to update event:", error);
    return {
      event: null,
      error: "Failed to update event. Please try again.",
    };
  }
}

export async function deleteEvent(id: string) {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid event ID provided.",
      };
    }

    // First check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return {
        success: false,
        error: "Event not found.",
      };
    }

    // Delete the event
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/list/events");
    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Event not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid event ID format.",
      };
    }

    console.error("Failed to delete event:", error);
    return {
      success: false,
      error: "Failed to delete event. Please try again.",
    };
  }
}

// --- Announcement Actions ---
type CreateAnnouncementInput = {
  title: string;
  description: string;
  date: string;
  classId?: string;
};

export async function getAllAnnouncements() {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return [];

  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return announcements;
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return [];
  }
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { announcement: null, error: auth.error };

  try {
    // Validate date
    const date = new Date(input.date);
    if (isNaN(date.getTime())) {
      return {
        announcement: null,
        error: "Invalid date format provided.",
      };
    }

    // Validate class if provided
    if (input.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: input.classId },
      });

      if (!classExists) {
        return {
          announcement: null,
          error: "Selected class not found.",
        };
      }
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: input.title,
        description: input.description,
        date,
        ...(input.classId && { classId: input.classId }),
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/list/announcements");
    return {
      announcement,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return {
      announcement: null,
      error: "Failed to create announcement. Please try again.",
    };
  }
}

export async function updateAnnouncement(
  id: string,
  input: Partial<CreateAnnouncementInput>
) {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { announcement: null, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        announcement: null,
        error: "Invalid announcement ID provided.",
      };
    }

    // First check if the announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      return {
        announcement: null,
        error: "Announcement not found.",
      };
    }

    const updateData: any = {};

    // Validate and update date if provided
    if (input.date) {
      const date = new Date(input.date);
      if (isNaN(date.getTime())) {
        return {
          announcement: null,
          error: "Invalid date format.",
        };
      }
      updateData.date = date;
    }

    // Update other fields
    if (input.title) updateData.title = input.title;
    if (input.description !== undefined)
      updateData.description = input.description;

    // Validate class if provided
    if (input.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: input.classId },
      });

      if (!classExists) {
        return {
          announcement: null,
          error: "Selected class not found.",
        };
      }
      updateData.classId = input.classId;
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/list/announcements");
    return {
      announcement,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        announcement: null,
        error: "Announcement not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        announcement: null,
        error: "Invalid announcement ID format.",
      };
    }

    console.error("Failed to update announcement:", error);
    return {
      announcement: null,
      error: "Failed to update announcement. Please try again.",
    };
  }
}

export async function deleteAnnouncement(id: string) {
    const auth = await requireServerRole(["admin"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid announcement ID provided.",
      };
    }

    // First check if the announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      return {
        success: false,
        error: "Announcement not found.",
      };
    }

    // Delete the announcement
    await prisma.announcement.delete({
      where: { id },
    });

    revalidatePath("/list/announcements");
    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Announcement not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid announcement ID format.",
      };
    }

    console.error("Failed to delete announcement:", error);
    return {
      success: false,
      error: "Failed to delete announcement. Please try again.",
    };
  }
}

export async function getNotificationCounts() {
  const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
  if (!auth.authorized) return { announcements: 0, messages: 0 };

  try {
    // Get recent announcements count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAnnouncementsCount = await prisma.announcement.count({
      where: {
        date: {
          gte: sevenDaysAgo,
        },
      },
    });

    // For now, messages count is 0 since Message model doesn't exist yet
    // You can implement this when the Message model is added to the schema
    const messagesCount = 0;

    return {
      announcements: recentAnnouncementsCount,
      messages: messagesCount,
    };
  } catch (error) {
    console.error("Failed to fetch notification counts:", error);
    return {
      announcements: 0,
      messages: 0,
    };
  }
}

// --- Exam Actions ---
type CreateExamInput = {
  title: string;
  startTime: string;
  endTime: string;
  lessonId: string;
  examType: "MONTHLY" | "MIDTERM" | "FINAL" | "ASSIGNMENT";
};

export async function createExam(input: CreateExamInput) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { exam: null, error: auth.error };

  try {
    // Validate the lessonId exists
    if (!input.lessonId || input.lessonId.trim() === "") {
      return {
        exam: null,
        error: "Lesson selection is required.",
      };
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
    });

    if (!lesson) {
      return {
        exam: null,
        error: "The selected lesson does not exist.",
      };
    }

    const exam = await prisma.exam.create({
      data: {
        title: input.title,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        lessonId: input.lessonId,
        examType: input.examType,
      },
    });
    return { exam, error: null };
  } catch (error: any) {
    console.error("Failed to create exam:", error);

    // Handle foreign key constraint errors
    if (error.code === "P2003") {
      return {
        exam: null,
        error: "The selected lesson does not exist.",
      };
    }

    // Handle invalid ObjectId format
    if (error.code === "P2023") {
      return {
        exam: null,
        error: "Invalid lesson ID format.",
      };
    }

    return {
      exam: null,
      error: "Failed to create exam. Please try again.",
    };
  }
}

export async function updateExam(id: string, input: CreateExamInput) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { exam: null, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        exam: null,
        error: "Invalid exam ID provided.",
      };
    }

    // First check if the exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      return {
        exam: null,
        error: "Exam not found. It may have been deleted.",
      };
    }

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        title: input.title,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        lessonId: input.lessonId,
        examType: input.examType,
      },
    });
    return { exam, error: null };
  } catch (error: any) {
    console.error("Failed to update exam:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        exam: null,
        error: "Exam not found. It may have been deleted.",
      };
    }

    // Handle invalid ObjectId format
    if (error.code === "P2023") {
      return {
        exam: null,
        error: "Invalid exam ID format.",
      };
    }

    // Handle foreign key constraint errors (invalid lessonId)
    if (error.code === "P2003") {
      return {
        exam: null,
        error: "The selected lesson does not exist.",
      };
    }

    return {
      exam: null,
      error: "Failed to update exam. Please try again.",
    };
  }
}

export async function deleteExam(id: string) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid exam ID provided.",
      };
    }

    // First check if the exam exists and has related records
    const existingExam = await prisma.exam.findUnique({
      where: { id },
      include: {
        results: true,
      },
    });

    if (!existingExam) {
      return {
        success: false,
        error: "Exam not found.",
      };
    }

    // Check for related results that would prevent deletion
    if (existingExam.results.length > 0) {
      return {
        success: false,
        error: `Cannot delete exam. It has ${existingExam.results.length} result record(s). Please delete these results first.`,
      };
    }

    // If no related records, proceed with deletion
    await prisma.exam.delete({
      where: { id },
    });

    // Revalidate the exam list page to update the UI
    revalidatePath("/list/exams");

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Failed to delete exam:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Exam not found. It may have already been deleted.",
      };
    }

    // Handle invalid ObjectId format (common with MongoDB)
    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid exam ID format.",
      };
    }

    // Handle foreign key constraint violations
    if (error.code === "P2014") {
      return {
        success: false,
        error:
          "Cannot delete exam. It has related records that must be deleted first.",
      };
    }

    return {
      success: false,
      error: "Failed to delete exam. Please try again.",
    };
  }
}

// --- Assignment Actions ---
type CreateAssignmentInput = {
  title: string;
  startDate: string;
  dueDate: string;
  lessonId: string;
};

export async function getAllAssignments() {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return [];

  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
    return assignments;
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    return [];
  }
}

export async function createAssignment(input: CreateAssignmentInput) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { assignment: null, error: auth.error };

  try {
    const startDate = new Date(input.startDate);
    const dueDate = new Date(input.dueDate);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(dueDate.getTime())) {
      return {
        assignment: null,
        error: "Invalid date format provided.",
      };
    }

    if (dueDate <= startDate) {
      return {
        assignment: null,
        error: "Due date must be after start date.",
      };
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
    });

    if (!lesson) {
      return {
        assignment: null,
        error: "Selected lesson not found.",
      };
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: input.title,
        startDate,
        dueDate,
        lessonId: input.lessonId,
      },
      include: {
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
    });

    return {
      assignment,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create assignment:", error);
    return {
      assignment: null,
      error: "Failed to create assignment. Please try again.",
    };
  }
}

export async function updateAssignment(
  id: string,
  input: Partial<CreateAssignmentInput>
) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { assignment: null, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        assignment: null,
        error: "Invalid assignment ID provided.",
      };
    }

    // First check if the assignment exists
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      return {
        assignment: null,
        error: "Assignment not found.",
      };
    }

    const updateData: any = {};

    if (input.title) updateData.title = input.title;
    if (input.startDate) {
      const startDate = new Date(input.startDate);
      if (isNaN(startDate.getTime())) {
        return {
          assignment: null,
          error: "Invalid start date format.",
        };
      }
      updateData.startDate = startDate;
    }
    if (input.dueDate) {
      const dueDate = new Date(input.dueDate);
      if (isNaN(dueDate.getTime())) {
        return {
          assignment: null,
          error: "Invalid due date format.",
        };
      }
      updateData.dueDate = dueDate;
    }
    if (input.lessonId) {
      // Check if lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: input.lessonId },
      });

      if (!lesson) {
        return {
          assignment: null,
          error: "Selected lesson not found.",
        };
      }
      updateData.lessonId = input.lessonId;
    }

    // Validate dates if both are provided
    if (updateData.startDate && updateData.dueDate) {
      if (updateData.dueDate <= updateData.startDate) {
        return {
          assignment: null,
          error: "Due date must be after start date.",
        };
      }
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
    });

    return {
      assignment,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        assignment: null,
        error: "Assignment not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        assignment: null,
        error: "Invalid assignment ID format.",
      };
    }

    console.error("Failed to update assignment:", error);
    return {
      assignment: null,
      error: "Failed to update assignment. Please try again.",
    };
  }
}

export async function deleteAssignment(id: string) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid assignment ID provided.",
      };
    }

    // First check if the assignment exists and has related records
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        results: true,
      },
    });

    if (!existingAssignment) {
      return {
        success: false,
        error: "Assignment not found.",
      };
    }

    // Check for related results that would prevent deletion
    if (existingAssignment.results.length > 0) {
      return {
        success: false,
        error: `Cannot delete assignment. It has ${existingAssignment.results.length} result record(s). Please delete these results first.`,
      };
    }

    // If no related records, proceed with deletion
    await prisma.assignment.delete({
      where: { id },
    });

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Assignment not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid assignment ID format.",
      };
    }

    if (error.code === "P2014") {
      return {
        success: false,
        error:
          "Cannot delete assignment. It has related records that must be deleted first.",
      };
    }

    return {
      success: false,
      error: "Failed to delete assignment. Please try again.",
    };
  }
}

// --- Attendance Actions ---
type CreateAttendanceInput = {
  date: string;
  present: boolean;
  studentId: string;
  lessonId: string;
};

export async function getAllAttendances() {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return [];

  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        student: true,
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return attendances;
  } catch (error) {
    console.error("Failed to fetch attendances:", error);
    return [];
  }
}

export async function createAttendance(input: CreateAttendanceInput) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { attendance: null, error: auth.error };

  try {
    const date = new Date(input.date);

    // Validate date
    if (isNaN(date.getTime())) {
      return {
        attendance: null,
        error: "Invalid date format provided.",
      };
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: input.studentId },
      include: { class: true },
    });

    if (!student) {
      return {
        attendance: null,
        error: "Selected student not found.",
      };
    }

    if (!student.class) {
      return {
        attendance: null,
        error: "Selected student is not assigned to any class.",
      };
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
    });

    if (!lesson) {
      return {
        attendance: null,
        error: "Selected lesson not found.",
      };
    }

    // Check if attendance already exists for this student and lesson on this date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: input.studentId,
        lessonId: input.lessonId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });

    if (existingAttendance) {
      return {
        attendance: null,
        error:
          "Attendance already recorded for this student and lesson on this date.",
      };
    }

    const attendance = await prisma.attendance.create({
      data: {
        date,
        present: input.present,
        studentId: input.studentId,
        lessonId: input.lessonId,
      },
      include: {
        student: true,
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
    });

    revalidatePath("/list/attendance");
    return {
      attendance,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create attendance:", error);
    return {
      attendance: null,
      error: "Failed to create attendance. Please try again.",
    };
  }
}

export async function updateAttendance(
  id: string,
  input: Partial<CreateAttendanceInput>
) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { attendance: null, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        attendance: null,
        error: "Invalid attendance ID provided.",
      };
    }

    // First check if the attendance exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!existingAttendance) {
      return {
        attendance: null,
        error: "Attendance record not found.",
      };
    }

    const updateData: any = {};

    if (input.date) {
      const date = new Date(input.date);
      if (isNaN(date.getTime())) {
        return {
          attendance: null,
          error: "Invalid date format.",
        };
      }
      updateData.date = date;
    }
    if (input.present !== undefined) updateData.present = input.present;
    if (input.studentId) {
      // Check if student exists
      const student = await prisma.student.findUnique({
        where: { id: input.studentId },
        include: { class: true },
      });

      if (!student) {
        return {
          attendance: null,
          error: "Selected student not found.",
        };
      }

      if (!student.class) {
        return {
          attendance: null,
          error: "Selected student is not assigned to any class.",
        };
      }
      updateData.studentId = input.studentId;
    }
    if (input.lessonId) {
      // Check if lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: input.lessonId },
      });

      if (!lesson) {
        return {
          attendance: null,
          error: "Selected lesson not found.",
        };
      }
      updateData.lessonId = input.lessonId;
    }

    const attendance = await prisma.attendance.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
    });

    revalidatePath("/list/attendance");
    return {
      attendance,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        attendance: null,
        error: "Attendance record not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        attendance: null,
        error: "Invalid attendance ID format.",
      };
    }

    console.error("Failed to update attendance:", error);
    return {
      attendance: null,
      error: "Failed to update attendance. Please try again.",
    };
  }
}

export async function deleteAttendance(id: string) {
    const auth = await requireServerRole(["admin", "teacher"]);
    if (!auth.authorized) return { success: false, error: auth.error };

  try {
    // Validate the ID format
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "Invalid attendance ID provided.",
      };
    }

    // First check if the attendance exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!existingAttendance) {
      return {
        success: false,
        error: "Attendance record not found.",
      };
    }

    // Delete the attendance
    await prisma.attendance.delete({
      where: { id },
    });

    revalidatePath("/list/attendance");
    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Attendance record not found.",
      };
    }

    if (error.code === "P2023") {
      return {
        success: false,
        error: "Invalid attendance ID format.",
      };
    }

    return {
      success: false,
      error: "Failed to delete attendance. Please try again.",
    };
  }
}

// --- User Settings Actions ---
export async function updateUserProfile(data: {
  userId: string;
  role: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
}) {
  try {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return { success: false, error: auth.error };
    if (auth.role !== "admin" && auth.userId !== data.userId) {
      return { success: false, error: "Forbidden: You can only update your own profile." };
    }
    const { userId, role, name, username, email, phone, address, img } = data;
    let updatedUser: any = null;

    if (role === "admin") {
      updatedUser = await prisma.admin.update({
        where: { id: userId },
        data: { name, username, email, phone: phone || null },
      });
    } else if (role === "teacher") {
      updatedUser = await prisma.teacher.update({
        where: { id: userId },
        data: { name, username, email, phone: phone || null, address: address || null, ...(img ? { img } : {}) },
      });
    } else if (role === "student") {
      updatedUser = await prisma.student.update({
        where: { id: userId },
        data: { name, username, email, phone: phone || null, address: address || null, ...(img ? { img } : {}) },
      });
    } else if (role === "parent") {
      updatedUser = await prisma.parent.update({
        where: { id: userId },
        data: { name, username, email, phone: phone || null, address: address || null, ...(img ? { img } : {}) },
      });
    } else {
      return { success: false, error: "Unknown user role" };
    }

    revalidatePath("/list/settings");
    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error?.code === "P2002") {
      return { success: false, error: "Username or Email already in use." };
    }
    return { success: false, error: error?.message || "Failed to update profile" };
  }
}

export async function changeUserPassword(data: {
  userId: string;
  role: string;
  currentPassword?: string;
  newPassword: string;
}) {
  try {
    const auth = await requireServerRole(["admin", "teacher", "student", "parent"]);
    if (!auth.authorized) return { success: false, error: auth.error };
    if (auth.role !== "admin" && auth.userId !== data.userId) {
      return { success: false, error: "Forbidden: You can only change your own password." };
    }
    const { userId, role, newPassword } = data;
    const newHashedPassword = await hashPassword(newPassword);

    if (role === "admin") {
      await prisma.admin.update({ where: { id: userId }, data: { password: newHashedPassword } });
    } else if (role === "teacher") {
      await prisma.teacher.update({ where: { id: userId }, data: { password: newHashedPassword } });
    } else if (role === "student") {
      await prisma.student.update({ where: { id: userId }, data: { password: newHashedPassword } });
    } else if (role === "parent") {
      await prisma.parent.update({ where: { id: userId }, data: { password: newHashedPassword } });
    } else {
      return { success: false, error: "Unknown user role" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return { success: false, error: error?.message || "Failed to change password" };
  }
}

