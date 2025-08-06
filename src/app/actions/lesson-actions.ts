"use server";

import { revalidatePath } from "next/cache";

import { numberToDay } from "@/lib/types";
import prisma from "../../../prisma";

export async function getLessons() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        subject: true,
        class: true,
        teacher: true,
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

export async function getClasses() {
  try {
    const classes = await prisma.class.findMany({
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

export async function getTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
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

export async function getSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
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
}

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

    // Parse time strings to Date objects
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
  input: Partial<CreateLessonInput>,
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
