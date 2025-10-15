"use client";

import { useEffect, useState, useCallback } from "react";
import BigCalender, { BigCalenderProps } from "./BigCalender";
import CalendarService from "@/services/calendar-service";
import { CalendarEvent } from "@/lib/data";

interface BigCalenderContainerProps {
    type?: string;
    id?: string;
    className?: string;
    studentCalendarEvents?: CalendarEvent[];
    studentClassData?: { name: string }[];
}

export default function BigCalenderContainer({
    type,
    id,
    className = "rounded-md bg-white",
    studentCalendarEvents,
    studentClassData
}: BigCalenderContainerProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [classes, setClasses] = useState<{ name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        console.log("=== BigCalenderContainer fetchData ===");
        console.log("Type:", type, "ID:", id);

        // If student data is passed directly, use it instead of fetching
        if (type === "student" && studentCalendarEvents && studentClassData) {
            console.log("Using passed student data");
            setEvents(studentCalendarEvents);
            setClasses(studentClassData);
            setIsLoading(false);
            return;
        }

        if (!id || !type) {
            console.log("Missing type or id, skipping data fetch");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Batch all data fetches for better performance
            const [teachersData, classesData, subjectsData, scheduleEvents] = await Promise.all([
                CalendarService.getAvailableTeachers(),
                CalendarService.getAvailableClasses(),
                CalendarService.getAvailableSubjects(),
                // Determine which schedule to fetch based on type and id
                (async () => {
                    if (type === "student") {
                        console.log("Fetching student schedule for ID:", id);
                        return CalendarService.getStudentSchedule(id);
                    } else if (type === "teacher") {
                        console.log("Fetching teacher schedule for ID:", id);
                        return CalendarService.getTeacherSchedule(id);
                    }
                    console.log("No specific schedule type, returning empty array");
                    return [];
                })()
            ]);

            console.log("=== Calendar Data Debug ===");
            console.log("Type:", type, "ID:", id);
            console.log("Teachers:", teachersData?.length || 0, "items");
            console.log("Classes:", classesData?.length || 0, "items");
            console.log("Subjects:", subjectsData?.length || 0, "items");
            console.log("Schedule Events:", scheduleEvents?.length || 0, "items");

            // Log first few items for debugging
            if (teachersData?.length > 0) {
                console.log("First teacher:", teachersData[0]);
            }
            if (classesData?.length > 0) {
                console.log("First class:", classesData[0]);
            }
            if (subjectsData?.length > 0) {
                console.log("First subject:", subjectsData[0]);
            }
            if (scheduleEvents?.length > 0) {
                console.log("First schedule event:", scheduleEvents[0]);
            }
            console.log("=========================");

            // Update state in single batch to reduce re-renders
            setClasses(classesData || []);
            setEvents(scheduleEvents || []);
        } catch (err) {
            console.error("Error fetching calendar data:", err);
            setError("Failed to load schedule data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [id, type, studentCalendarEvents, studentClassData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Get user-specific props based on type
    const getUserProps = (): Partial<BigCalenderProps> => {
        if (type === "student") {
            // For students, extract class name from events or use a default
            const userClass = events.length > 0 ? events[0].class : "No Class Assigned";
            return {
                userClass,
            };
        }

        if (type === "teacher") {
            // For teacher, extract teacher name from events
            const teacherName = events.length > 0 ? events[0].teacher : undefined;
            return {
                userName: teacherName,
            };
        }

        // For admin or class view, return empty props to show all data
        return {};
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className={className}>
                <BigCalender
                    classesName={[]}
                    initialEvents={[]}
                    isLoading={true}
                />
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className={`${className} p-4`}>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
                    <p className="font-semibold">Error Loading Schedule</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 rounded bg-red-100 px-3 py-1 text-sm hover:bg-red-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <BigCalender
                classesName={classes}
                initialEvents={events}
                isLoading={false}
                {...getUserProps()}
            />
        </div>
    );
}
