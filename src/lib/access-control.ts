import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

/**
 * Utility functions for role-based access control and UI filtering
 */

export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface SessionInfo {
  userId: string;
  role: UserRole;
  isAuthenticated: boolean;
}

/**
 * Get current user session info
 */
export async function getCurrentUserInfo(): Promise<SessionInfo> {
  const session = await getServerSession(authOptions);

  return {
    userId: session?.user?.id || "",
    role: (session?.user?.role as UserRole) || "student",
    isAuthenticated: !!session?.user,
  };
}

/**
 * Check if current user can access student data
 */
export async function canAccessStudent(studentId: string): Promise<boolean> {
  const { userId, role } = await getCurrentUserInfo();

  if (role === "admin") return true;
  if (role === "student") return userId === studentId;

  // Additional checks for teacher/parent can be added here if needed
  return false;
}

/**
 * Check if current user can access teacher data
 */
export async function canAccessTeacher(teacherId: string): Promise<boolean> {
  const { userId, role } = await getCurrentUserInfo();

  if (role === "admin") return true;
  if (role === "teacher") return userId === teacherId;

  return false;
}

/**
 * Filter shortcuts based on user role and permissions
 */
export function filterShortcuts(
  shortcuts: Array<{
    label: string;
    href: string;
    bgColor: string;
    allowedRoles?: UserRole[];
    requiresSpecificAccess?: boolean;
  }>,
  userRole: UserRole
): Array<{
  label: string;
  href: string;
  bgColor: string;
}> {
  return shortcuts
    .filter((shortcut) => {
      // If no role restrictions, allow all
      if (!shortcut.allowedRoles) return true;

      // Check if user role is in allowed roles
      return shortcut.allowedRoles.includes(userRole);
    })
    .map(({ allowedRoles, requiresSpecificAccess, ...rest }) => rest);
}

/**
 * Get student page shortcuts based on user role
 */
export function getStudentPageShortcuts(studentId: string, userRole: UserRole) {
  const allShortcuts = [
    {
      label: "Student's Teachers",
      href: `/list/teachers?studentId=${studentId}`,
      bgColor: "bg-aamPurpleLight",
      allowedRoles: ["admin", "teacher", "student"] as UserRole[],
    },
    {
      label: "Student's Lessons",
      href: `/list/lessons?studentId=${studentId}`,
      bgColor: "bg-aamSkyLight",
      allowedRoles: ["admin", "teacher", "student"] as UserRole[],
    },
    {
      label: "Student's Exams",
      href: `/list/exams?studentId=${studentId}`,
      bgColor: "bg-pink-50",
      allowedRoles: ["admin", "teacher", "student"] as UserRole[],
    },
    {
      label: "Student's Assignments",
      href: `/list/assignments?studentId=${studentId}`,
      bgColor: "bg-aamSkyLight",
      allowedRoles: ["admin", "teacher", "student"] as UserRole[],
    },
    {
      label: "Student's Results",
      href: `/list/results?studentId=${studentId}`,
      bgColor: "bg-aamYellowLight",
      allowedRoles: ["admin", "teacher", "student"] as UserRole[],
    },
  ];

  return filterShortcuts(allShortcuts, userRole);
}

/**
 * Get teacher page shortcuts based on user role
 */
export function getTeacherPageShortcuts(teacherId: string, userRole: UserRole) {
  const allShortcuts = [
    {
      label: "Teacher's Classes",
      href: `/list/classes?teacherId=${teacherId}`,
      bgColor: "bg-aamSkyLight",
      allowedRoles: ["admin", "teacher"] as UserRole[],
    },
    {
      label: "Teacher's Students",
      href: `/list/students?teacherId=${teacherId}`,
      bgColor: "bg-aamPurpleLight",
      allowedRoles: ["admin", "teacher"] as UserRole[],
    },
    {
      label: "Teacher's Lessons",
      href: `/list/lessons?teacherId=${teacherId}`,
      bgColor: "bg-aamYellowLight",
      allowedRoles: ["admin", "teacher"] as UserRole[],
    },
    {
      label: "Teacher's Exams",
      href: `/list/exams?teacherId=${teacherId}`,
      bgColor: "bg-pink-50",
      allowedRoles: ["admin", "teacher"] as UserRole[],
    },
    {
      label: "Teacher's Assignments",
      href: `/list/assignments?teacherId=${teacherId}`,
      bgColor: "bg-aamSkyLight",
      allowedRoles: ["admin", "teacher"] as UserRole[],
    },
  ];

  return filterShortcuts(allShortcuts, userRole);
}

/**
 * Check if user has permission to view performance data
 */
export function canViewPerformance(
  userRole: UserRole,
  targetType: "student" | "teacher"
): boolean {
  if (userRole === "admin") return true;

  if (targetType === "student") {
    return ["admin", "teacher", "student"].includes(userRole);
  }

  if (targetType === "teacher") {
    return ["admin", "teacher"].includes(userRole);
  }

  return false;
}

/**
 * Get safe redirect path based on user role
 */
export function getSafeRedirectPath(userRole: UserRole): string {
  switch (userRole) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    case "parent":
      return "/parent";
    default:
      return "/";
  }
}
