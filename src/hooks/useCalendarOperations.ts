import { useState, useCallback } from "react";
import { CalendarEvent } from "@/lib/data";
import { createLessonAction } from "@/app/actions/calendar-actions";

export function useCalendarOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLesson = useCallback(
    async (
      lessonData: Omit<CalendarEvent, "dayOfWeek"> & { dayOfWeek: string }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createLessonAction(lessonData);

        if (!result.success) {
          throw new Error(result.error || "Failed to create lesson");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createLesson,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
