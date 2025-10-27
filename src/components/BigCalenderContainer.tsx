"use client";

import BigCalender, { BigCalenderProps } from "./BigCalender";
import { CalendarEvent } from "@/lib/data";

interface BigCalenderContainerProps {
    type: string;
    className?: string;
    calendarEvents: CalendarEvent[]; // Always required - calendar events data
    classData: { name: string }[]; // Always required - class data
}

export default function BigCalenderContainer({
    type,
    className = "rounded-md bg-white",
    calendarEvents,
    classData
}: BigCalenderContainerProps) {
    // Get user-specific props based on type
    const getUserProps = (): Partial<BigCalenderProps> => {
        if (type === "student") {
            // For students, extract class name from events or use a default
            const userClass = calendarEvents.length > 0 ? calendarEvents[0].class : "No Class Assigned";
            return {
                userClass,
            };
        }

        if (type === "teacher") {
            // For teacher, extract teacher name from events
            const teacherName = calendarEvents.length > 0 ? calendarEvents[0].teacher : undefined;
            return {
                userName: teacherName,
            };
        }

        if (type === "parent" || type === "Parent") {
            // For parents, extract class name from their child's events
            const userClass = calendarEvents.length > 0 ? calendarEvents[0].class : "No Class Assigned";
            return {
                userClass,
            };
        }

        // For admin or class view, return empty props to show all data
        return {};
    };
    // console.log("What's going on",calendarEvents);
    
    return (
        <div className={className}>
            <BigCalender
                classesName={classData}
                initialEvents={calendarEvents}
                isLoading={false}
                {...getUserProps()}
            />
        </div>
    );
}
