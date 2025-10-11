import prisma from "../../prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

/**
 * Service for fetching individual student and teacher data
 * with all necessary relationships and calculated metrics
 * Includes proper authorization and access control
 */

export interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  img: string | null;
  bloodType: string | null;
  birthDate: Date | null;
  address: string | null;
  sex: string | null;
  class: {
    id: string;
    name: string;
    grade: {
      level: number;
    };
  } | null;
  Parent: {
    name: string;
    phone: string | null;
  } | null;
  attendancePercentage: number;
  totalLessons: number;
  averageScore: number | null;
  totalResults: number;
}

export interface TeacherData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  img: string | null;
  bloodType: string | null;
  birthday: Date | null;
  address: string | null;
  sex: string | null;
  subjects: {
    id: string;
    name: string;
    code: string;
  }[];
  classes: {
    id: string;
    name: string;
    capacity: number;
    studentsCount: number;
  }[];
  totalLessons: number;
  attendancePercentage: number;
}

/**
 * Check if user has permission to access student data
 */
async function checkStudentAccess(studentId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return false;
  }

  const { id: currentUserId, role } = session.user;

  // Admin can access any student
  if (role === "admin") {
    return true;
  }

  // Students can only access their own data
  if (role === "student") {
    return currentUserId === studentId;
  }

  // Teachers can access students in their classes
  if (role === "teacher") {
    const studentInTeacherClass = await prisma.student.findFirst({
      where: {
        id: studentId,
        class: {
          lessons: {
            some: {
              teacherId: currentUserId,
            },
          },
        },
      },
    });
    return !!studentInTeacherClass;
  }

  // Parents can access their own children
  if (role === "parent") {
    const studentWithParent = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentId: currentUserId,
      },
    });
    return !!studentWithParent;
  }

  return false;
}

/**
 * Check if user has permission to access teacher data
 */
async function checkTeacherAccess(teacherId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return false;
  }

  const { id: currentUserId, role } = session.user;

  // Admin can access any teacher
  if (role === "admin") {
    return true;
  }

  // Teachers can only access their own data
  if (role === "teacher") {
    return currentUserId === teacherId;
  }

  // Students can access their teachers
  if (role === "student") {
    const teacherOfStudent = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
        lessons: {
          some: {
            class: {
              students: {
                some: {
                  id: currentUserId,
                },
              },
            },
          },
        },
      },
    });
    return !!teacherOfStudent;
  }

  // Parents can access their children's teachers
  if (role === "parent") {
    const teacherOfParentChild = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
        lessons: {
          some: {
            class: {
              students: {
                some: {
                  parentId: currentUserId,
                },
              },
            },
          },
        },
      },
    });
    return !!teacherOfParentChild;
  }

  return false;
}

/**
 * Fetch individual student data with all relationships and calculated metrics
 * Includes authorization check
 */
export async function getStudentData(studentId: string): Promise<StudentData> {
  try {
    // Check access permissions first
    const hasAccess = await checkStudentAccess(studentId);
    if (!hasAccess) {
      notFound();
    }

    // Fetch student with all necessary relationships
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
        approved: "ACCEPTED",
      },
      include: {
        class: {
          include: {
            grade: true,
          },
        },
        Parent: {
          select: {
            name: true,
            phone: true,
          },
        },
        attendances: {
          select: {
            present: true,
          },
        },
        result: {
          select: {
            score: true,
            maxScore: true,
          },
        },
      },
    });

    if (!student) {
      notFound();
    }

    // Calculate attendance percentage
    const totalAttendanceRecords = student.attendances.length;
    const presentRecords = student.attendances.filter((a) => a.present).length;
    const attendancePercentage =
      totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 0;

    // Calculate average score
    let averageScore: number | null = null;
    if (student.result.length > 0) {
      const totalPercentages = student.result.reduce((sum, result) => {
        return sum + (result.score / result.maxScore) * 100;
      }, 0);
      averageScore = Math.round(totalPercentages / student.result.length);
    }

    // Get total lessons count for this student's class
    const totalLessons = await prisma.lesson.count({
      where: {
        classId: student.classId || undefined,
      },
    });

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      img: student.img,
      bloodType: student.bloodType,
      birthDate: student.birthDate,
      address: student.address,
      sex: student.sex,
      class: student.class,
      Parent: student.Parent,
      attendancePercentage,
      totalLessons,
      averageScore,
      totalResults: student.result.length,
    };
  } catch (error) {
    console.error("Error fetching student data:", error);
    notFound();
  }
}

/**
 * Fetch individual teacher data with all relationships and calculated metrics
 * Includes authorization check
 */
export async function getTeacherData(teacherId: string): Promise<TeacherData> {
  try {
    // Check access permissions first
    const hasAccess = await checkTeacherAccess(teacherId);
    if (!hasAccess) {
      notFound();
    }

    // Fetch teacher with all necessary relationships
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
        approved: "ACCEPTED",
      },
      include: {
        subjects: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            capacity: true,
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!teacher) {
      notFound();
    }

    // Get attendance data for teacher's lessons
    const attendanceData = await prisma.attendance.findMany({
      where: {
        lesson: {
          teacherId,
        },
      },
      select: {
        present: true,
      },
    });

    // Calculate attendance percentage for teacher's classes
    const totalAttendanceRecords = attendanceData.length;
    const presentRecords = attendanceData.filter((a) => a.present).length;
    const attendancePercentage =
      totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 0;

    // Transform classes data to include student count
    const classes = teacher.classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      capacity: cls.capacity,
      studentsCount: cls._count.students,
    }));

    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      img: teacher.img,
      bloodType: teacher.bloodType,
      birthday: teacher.birthday,
      address: teacher.address,
      sex: teacher.sex,
      subjects: teacher.subjects,
      classes,
      totalLessons: teacher.lessons.length,
      attendancePercentage,
    };
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    notFound();
  }
}

/**
 * Get lessons/schedule data for a student
 * Includes authorization check
 */
export async function getStudentLessons(studentId: string) {
  try {
    // Check access permissions first
    const hasAccess = await checkStudentAccess(studentId);
    if (!hasAccess) {
      return [];
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classId: true },
    });

    if (!student?.classId) {
      return [];
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        classId: student.classId,
      },
      include: {
        subject: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching student lessons:", error);
    return [];
  }
}

/**
 * Get lessons/schedule data for a teacher
 * Includes authorization check
 */
export async function getTeacherLessons(teacherId: string) {
  try {
    // Check access permissions first
    const hasAccess = await checkTeacherAccess(teacherId);
    if (!hasAccess) {
      return [];
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId,
      },
      include: {
        subject: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching teacher lessons:", error);
    return [];
  }
}

/**
 * Get performance data for a student
 * Includes authorization check
 */
export async function getStudentPerformance(studentId: string) {
  try {
    // Check access permissions first
    const hasAccess = await checkStudentAccess(studentId);
    if (!hasAccess) {
      return {
        results: [],
        performanceData: [],
        overallAverage: 0,
      };
    }

    const results = await prisma.result.findMany({
      where: {
        studentId,
      },
      include: {
        exam: {
          include: {
            lesson: {
              include: {
                subject: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              include: {
                subject: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 10, // Get latest 10 results
    });

    // Calculate performance metrics
    const subjectPerformance: Record<
      string,
      { scores: number[]; total: number }
    > = {};

    results.forEach((result) => {
      const percentage = (result.score / result.maxScore) * 100;
      const subjectName =
        result.exam?.lesson?.subject?.name ||
        result.assignment?.lesson?.subject?.name ||
        "Unknown";

      if (!subjectPerformance[subjectName]) {
        subjectPerformance[subjectName] = { scores: [], total: 0 };
      }

      subjectPerformance[subjectName].scores.push(percentage);
      subjectPerformance[subjectName].total++;
    });

    // Calculate average per subject
    const performanceData = Object.entries(subjectPerformance).map(
      ([subject, data]) => ({
        subject,
        average: Math.round(
          data.scores.reduce((sum, score) => sum + score, 0) / data.total
        ),
        count: data.total,
      })
    );

    return {
      results,
      performanceData,
      overallAverage:
        results.length > 0
          ? Math.round(
              results.reduce(
                (sum, result) => sum + (result.score / result.maxScore) * 100,
                0
              ) / results.length
            )
          : 0,
    };
  } catch (error) {
    console.error("Error fetching student performance:", error);
    return {
      results: [],
      performanceData: [],
      overallAverage: 0,
    };
  }
}
