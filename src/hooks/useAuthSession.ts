"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

export interface UseAuthSessionReturn {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAuthSession = (): UseAuthSessionReturn => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/api/session");
      setUser(response.data?.user || null);
    } catch (err) {
      console.error("Error fetching session:", err);
      setError("Failed to fetch session");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return {
    user,
    isLoading,
    error,
    refetch: fetchSession,
  };
};

export default useAuthSession;
