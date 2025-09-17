"use client";

import { useSession } from "next-auth/react";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

export interface UseSessionDataReturn {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Enhanced hook that uses NextAuth's useSession with better typing
 */
export const useSessionData = (): UseSessionDataReturn => {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
  };
};

export default useSessionData;
