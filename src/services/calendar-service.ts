import { PrismaClient, Day } from "@prisma/client";
import { CalendarEvent } from "@/lib/data";

// Global Prisma client instance with connection handling
declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var __prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

/**
 * Calendar Service - Fetch real schedule data from database
 */

// Map database Day enum to JavaScript day numbers (0 = Sunday, 6 = Saturday)
const dayMapping: Record<Day, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// Helper function to format time from DateTime to 12-hour format string
function formatTimeFromDate(date: Date): string {
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  // Convert to format expected by the component (e.g., "09:00 AM")
  return timeStr.replace(/(\d{1,2}):(\d{2})\s?(AM|PM)/i, "$1:$2 $3");
}

/**
 * Get schedule events for a specific student by their class
 */
export async function getStudentSchedule(
  studentId: string
): Promise<CalendarEvent[]> {
  
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true },
    });

    if (!student?.classId) {
      return [];
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        classId: student.classId,
      },
      include: {
        subject: true,
        teacher: true,
        class: true,
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });
    
    const data =  lessons.map((lesson) => ({
      title: lesson.subject?.name || lesson.name,
      startTime: formatTimeFromDate(lesson.startTime),
      endTime: formatTimeFromDate(lesson.endTime),
      dayOfWeek: dayMapping[lesson.day],
      class: lesson.class.name,
      teacher: lesson.teacher.name,
    }));
    console.log(data);
    
    return data;
  } catch (error) {
    console.error("Error fetching student schedule:", error);
    return [];
  }
}

/**
 * Get schedule events for a specific teacher
 */
export async function getTeacherSchedule(
  teacherId: string
): Promise<CalendarEvent[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId,
      },
      include: {
        subject: true,
        teacher: true,
        class: true,
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return lessons.map((lesson) => ({
      title: lesson.subject?.name || lesson.name,
      startTime: formatTimeFromDate(lesson.startTime),
      endTime: formatTimeFromDate(lesson.endTime),
      dayOfWeek: dayMapping[lesson.day],
      class: lesson.class.name,
      teacher: lesson.teacher.name,
    }));
  } catch (error) {
    console.error("Error fetching teacher schedule:", error);
    return [];
  }
}

/**
 * Get all schedule events for admin view
 */
export async function getAllScheduleEvents(): Promise<CalendarEvent[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        subject: true,
        teacher: true,
        class: true,
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return lessons.map((lesson) => ({
      title: lesson.subject?.name || lesson.name,
      startTime: formatTimeFromDate(lesson.startTime),
      endTime: formatTimeFromDate(lesson.endTime),
      dayOfWeek: dayMapping[lesson.day],
      class: lesson.class.name,
      teacher: lesson.teacher.name,
    }));
  } catch (error) {
    console.error("Error fetching all schedule events:", error);
    return [];
  }
}

/**
 * Get schedule events for a specific class
 */
export async function getClassSchedule(
  classId: string
): Promise<CalendarEvent[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        classId,
      },
      include: {
        subject: true,
        teacher: true,
        class: true,
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return lessons.map((lesson) => ({
      title: lesson.subject?.name || lesson.name,
      startTime: formatTimeFromDate(lesson.startTime),
      endTime: formatTimeFromDate(lesson.endTime),
      dayOfWeek: dayMapping[lesson.day],
      class: lesson.class.name,
      teacher: lesson.teacher.name,
    }));
  } catch (error) {
    console.error("Error fetching class schedule:", error);
    return [];
  }
}

/**
 * Get available classes for dropdowns/selectors
 */
export async function getAvailableClasses() {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return classes.map((cls) => ({ name: cls.name }));
  } catch (error) {
    console.error("Error fetching available classes:", error);
    return [];
  }
}

/**
 * Get available teachers with their subjects
 */
export async function getAvailableTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        name: true,
        subjects: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return teachers.map((teacher) => ({
      name: teacher.name,
      subjects: teacher.subjects,
    }));
  } catch (error) {
    console.error("Error fetching available teachers:", error);
    return [];
  }
}

/**
 * Get available subjects with their teachers
 */
export async function getAvailableSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        teachers: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return subjects.map((subject) => ({
      name: subject.name,
      teachers: subject.teachers,
    }));
  } catch (error) {
    console.error("Error fetching available subjects:", error);
    return [];
  }
}

/**
 * Get student's class information
 */
export async function getStudentClass(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return student?.class || null;
  } catch (error) {
    console.error("Error fetching student class:", error);
    return null;
  }
}

/**
 * Get teacher information with subjects
 */
export async function getTeacherInfo(teacherId: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        name: true,
        subjects: {
          select: {
            name: true,
          },
        },
      },
    });

    return teacher || null;
  } catch (error) {
    console.error("Error fetching teacher info:", error);
    return null;
  }
}

const CalendarService = {
  getStudentSchedule,
  getTeacherSchedule,
  getAllScheduleEvents,
  getClassSchedule,
  getAvailableClasses,
  getAvailableTeachers,
  getAvailableSubjects,
  getStudentClass,
  getTeacherInfo,
};

export default CalendarService;
