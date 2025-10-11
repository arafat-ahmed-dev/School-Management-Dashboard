"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

interface LessonData {
    id: string;
    name: string;
    day: string;
    startTime: Date;
    endTime: Date;
    subject: {
        name: string;
    } | null;
    teacher: {
        name: string;
    } | null;
    class: {
        name: string;
    } | null;
}

interface ScheduleBlock {
    time: string;
    subject: string;
    teacher?: string;
    className?: string;
    lessonName?: string;
}

interface DaySchedule {
    date: string;
    day: string;
    blocks: ScheduleBlock[];
}

interface IndividualBigCalendarProps {
    lessons?: LessonData[];
    type?: 'student' | 'teacher';
}

const colors: { [key: string]: string } = {
    Math: "bg-blue-50",
    Biology: "bg-green-50",
    Physics: "bg-purple-50",
    English: "bg-pink-50",
    Chemistry: "bg-amber-50",
    History: "bg-gray-50",
    Science: "bg-teal-50",
    Geography: "bg-orange-50",
    default: "bg-gray-50",
};

const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
];

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatTimeRange(startTime: Date, endTime: Date): string {
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

export default function IndividualBigCalendar({ lessons = [], type = 'student' }: IndividualBigCalendarProps) {
    const [view, setView] = useState<"week" | "day">("week");
    const [currentDayIndex] = useState(0);

    // Convert lessons to schedule format
    const schedule: DaySchedule[] = [];

    // Initialize all days of the week
    dayNames.forEach((day, index) => {
        schedule.push({
            date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            day,
            blocks: []
        });
    });

    // Populate schedule with lessons
    lessons.forEach(lesson => {
        const dayIndex = dayNames.indexOf(lesson.day);
        if (dayIndex !== -1) {
            const timeRange = formatTimeRange(lesson.startTime, lesson.endTime);
            const subjectName = lesson.subject?.name || 'Unknown Subject';

            const block: ScheduleBlock = {
                time: timeRange,
                subject: subjectName,
                lessonName: lesson.name,
            };

            // Add teacher or class info based on type
            if (type === 'student') {
                block.teacher = lesson.teacher?.name;
            } else if (type === 'teacher') {
                block.className = lesson.class?.name;
            }

            schedule[dayIndex].blocks.push(block);
        }
    });

    // Filter to show only weekdays (Monday to Friday)
    const weekdaySchedule = schedule.slice(1, 6);
    const currentSchedule = view === "week" ? weekdaySchedule : [weekdaySchedule[currentDayIndex]];

    // Default fallback schedule if no lessons
    const defaultSchedule: DaySchedule[] = [
        {
            date: "No lessons",
            day: "MONDAY",
            blocks: []
        }
    ];

    const displaySchedule = lessons.length > 0 ? currentSchedule : defaultSchedule;

    return (
        <div className="max-w-full">
            <div className="p-2">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:justify-end">
                    <div className="flex w-fit justify-end gap-1 rounded-lg bg-purple-100 p-1">
                        <Button
                            variant="ghost"
                            className={cn("rounded", view === "week" && "bg-white")}
                            size="sm"
                            onClick={() => setView("week")}
                        >
                            Work Week
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn("rounded", view === "day" && "bg-white")}
                            size="sm"
                            onClick={() => setView("day")}
                        >
                            Day
                        </Button>
                    </div>
                </div>

                {lessons.length === 0 ? (
                    <div className="flex h-48 items-center justify-center text-gray-500">
                        <div className="text-center">
                            <p className="text-lg font-medium">No schedule available</p>
                            <p className="text-sm">No lessons have been assigned yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex">
                        <div className="w-16 shrink-0">
                            {timeSlots.map((time) => (
                                <div
                                    key={time}
                                    className="flex h-24 items-start border border-gray-200"
                                >
                                    <span className="p-1 text-xs text-gray-500">{time}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <div
                                className={cn(
                                    "grid",
                                    view === "week" ? "min-w-[600px] grid-cols-5" : "grid-cols-1"
                                )}
                            >
                                {displaySchedule.map((day, dayIndex) => (
                                    <div key={dayIndex} className="relative">
                                        <div className="absolute -top-8 left-0 w-full truncate text-xs font-medium text-gray-700">
                                            {view === "week" ? day.day.slice(0, 3) : day.day}
                                        </div>
                                        <div className="absolute -top-6 left-0 text-xs text-gray-500">
                                            {day.date}
                                        </div>
                                        {timeSlots.map((timeSlot, slotIndex) => {
                                            const block = day.blocks.find((b) =>
                                                b.time.startsWith(timeSlot)
                                            );

                                            return (
                                                <div
                                                    key={`${dayIndex}-${slotIndex}`}
                                                    className="relative h-24 border-y border-r"
                                                >
                                                    {block && (
                                                        <div
                                                            className={cn(
                                                                "absolute inset-0 p-1.5 flex flex-col justify-between rounded-sm",
                                                                colors[block.subject] || colors.default
                                                            )}
                                                        >
                                                            <div>
                                                                <div className="mb-1 text-[10px] leading-tight text-gray-500">
                                                                    {block.time}
                                                                </div>
                                                                <span className="text-xs font-medium leading-tight">
                                                                    {block.subject}
                                                                </span>
                                                            </div>
                                                            <div className="text-[9px] leading-tight text-gray-600">
                                                                {type === 'student' && block.teacher && (
                                                                    <div>Teacher: {block.teacher}</div>
                                                                )}
                                                                {type === 'teacher' && block.className && (
                                                                    <div>Class: {block.className}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {lessons.length > 0 && (
                <div className="mt-5 flex items-center justify-center">
                    <Button className="w-fit bg-blue-500 hover:bg-blue-600">
                        <DownloadIcon className="mr-2 size-4" />
                        Download PDF
                    </Button>
                </div>
            )}
        </div>
    );
}