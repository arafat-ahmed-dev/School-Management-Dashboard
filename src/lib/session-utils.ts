import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export interface SessionData {
  userId: string | null;
  userRole: string | null;
  userName: string | null;
  userEmail: string | null;
}

/**
 * Server-side session utility to get current user data
 * Use this in server components and API routes
 */
export async function getSessionData(): Promise<SessionData> {
  const session = await getServerSession(authOptions);

  return {
    userId: session?.user?.id || null,
    userRole: session?.user?.role || null,
    userName: session?.user?.name || null,
    userEmail: session?.user?.email || null,
  };
}

/**
 * Get current user role (defaults to 'admin' if no session)
 * @deprecated Use getSessionData instead for proper type safety
 */
export async function getCurrentRole(): Promise<string> {
  const { userRole } = await getSessionData();
  return userRole || "admin";
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await getSessionData();
  return userId;
}
