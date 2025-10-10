"use server";

import prisma from "../../../prisma";
import { Day } from "@prisma/client";
import { CalendarEvent } from "@/lib/data";

// Helper function to convert dayOfWeek string to Day enum
function getDayEnum(dayOfWeekStr: string): Day {
  const dayMap: Record<string, Day> = {
    Sunday: Day.SUNDAY,
    Monday: Day.MONDAY,
    Tuesday: Day.TUESDAY,
    Wednesday: Day.WEDNESDAY,
    Thursday: Day.THURSDAY,
    Friday: Day.FRIDAY,
    Saturday: Day.SATURDAY,
  };
  return dayMap[dayOfWeekStr];
}

// Helper function to convert Day enum to dayOfWeek number
function getDayOfWeekNumber(day: Day): number {
  const dayMap: Record<Day, number> = {
    [Day.SUNDAY]: 0,
    [Day.MONDAY]: 1,
    [Day.TUESDAY]: 2,
    [Day.WEDNESDAY]: 3,
    [Day.THURSDAY]: 4,
    [Day.FRIDAY]: 5,
    [Day.SATURDAY]: 6,
  };
  return dayMap[day];
}

// Helper function to parse time string to Date
function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export async function createLessonAction(
  lessonData: Omit<CalendarEvent, "dayOfWeek"> & { dayOfWeek: string }
) {
  try {
    // Validate time inputs
    const startTime = parseTime(lessonData.startTime);
    const endTime = parseTime(lessonData.endTime);

    if (endTime <= startTime) {
      throw new Error("End time must be after start time");
    }

    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (duration < 30) {
      throw new Error("Lesson duration must be at least 30 minutes");
    }
    if (duration > 180) {
      throw new Error("Lesson duration cannot exceed 3 hours");
    }

    // Find the class
    const classData = await prisma.class.findFirst({
      where: { name: lessonData.class },
    });

    if (!classData) {
      throw new Error("Class not found");
    }

    // Find the subject with teacher relationships
    const subjectData = await prisma.subject.findFirst({
      where: { name: lessonData.title },
      include: {
        teachers: {
          select: { name: true },
        },
      },
    });

    if (!subjectData) {
      throw new Error("Subject not found");
    }

    // Find the teacher with subject relationships
    const teacherData = await prisma.teacher.findFirst({
      where: { name: lessonData.teacher },
      include: {
        subjects: {
          select: { name: true },
        },
      },
    });

    if (!teacherData) {
      throw new Error("Teacher not found");
    }

    // Validate teacher can teach this subject
    const canTeachSubject = teacherData.subjects.some(
      (subject) => subject.name === lessonData.title
    );

    if (!canTeachSubject) {
      throw new Error(
        `${lessonData.teacher} is not qualified to teach ${lessonData.title}`
      );
    }

    // Validate subject can be taught by this teacher
    const teacherCanTeachSubject = subjectData.teachers.some(
      (teacher) => teacher.name === lessonData.teacher
    );

    if (!teacherCanTeachSubject) {
      throw new Error(
        `${lessonData.title} cannot be taught by ${lessonData.teacher}`
      );
    }

    // Check for scheduling conflicts
    const dayEnum = getDayEnum(lessonData.dayOfWeek);
    const conflictingLessons = await prisma.lesson.findMany({
      where: {
        day: dayEnum,
        OR: [
          // Teacher conflict
          {
            teacherId: teacherData.id,
            AND: [
              { startTime: { lte: endTime } },
              { endTime: { gte: startTime } },
            ],
          },
          // Class conflict
          {
            classId: classData.id,
            AND: [
              { startTime: { lte: endTime } },
              { endTime: { gte: startTime } },
            ],
          },
        ],
      },
      include: {
        teacher: { select: { name: true } },
        class: { select: { name: true } },
        subject: { select: { name: true } },
      },
    });

    if (conflictingLessons.length > 0) {
      const conflict = conflictingLessons[0];
      if (conflict.teacherId === teacherData.id) {
        throw new Error(
          `${lessonData.teacher} is already scheduled to teach ${conflict.subject?.name} at this time`
        );
      } else {
        throw new Error(
          `${lessonData.class} already has ${conflict.subject?.name} scheduled at this time`
        );
      }
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        name: `${lessonData.title} - ${lessonData.class}`,
        day: dayEnum,
        startTime,
        endTime,
        classId: classData.id,
        teacherId: teacherData.id,
        subjectId: subjectData.id,
      },
      include: {
        subject: { select: { name: true } },
        teacher: { select: { name: true } },
        class: { select: { name: true } },
      },
    });

    // Return the lesson in CalendarEvent format
    const calendarEvent: CalendarEvent = {
      title: lesson.subject?.name || lesson.name,
      startTime: lesson.startTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: lesson.endTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      dayOfWeek: getDayOfWeekNumber(lesson.day),
      class: lesson.class?.name || "",
      teacher: lesson.teacher?.name || "",
    };

    return { success: true, data: calendarEvent };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lesson",
    };
  }
}
