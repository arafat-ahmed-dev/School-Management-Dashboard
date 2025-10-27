"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { type CalendarEvent } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  List,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
];

type ViewType = "list" | "week";

interface ClassItem {
  name: string;
}

export interface BigCalenderProps {
  classesName?: ClassItem[];
  initialEvents?: CalendarEvent[];
  isLoading?: boolean;
  userClass?: string; // For student role - their specific class
  userName?: string; // For teacher role - their name to filter subjects
}

export default function BigCalender({
  classesName = [],
  initialEvents = [],
  isLoading = false,
  userClass,
  userName,
}: BigCalenderProps) {
  // State management
  const [view, setView] = useState<ViewType>("week");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedClass, setSelectedClass] = useState("");

  // Initialize selectedClass based on user props
  useEffect(() => {
    if (userClass) {
      // Student view - use their specific class
      setSelectedClass(userClass);
    } else if (classesName.length > 0) {
      // Admin/teacher view - default to first class
      setSelectedClass(classesName[0]?.name || "");
    }
  }, [userClass, classesName]);

  // Sync events when initialEvents change
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  // Dynamic color assignment based on subject hash
  const getSubjectColor = useCallback((subject: string) => {
    // Predefined color palette for consistent and appealing colors
    const colorPalette = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
      "bg-cyan-100 text-cyan-800",
      "bg-emerald-100 text-emerald-800",
      "bg-amber-100 text-amber-800",
      "bg-lime-100 text-lime-800",
      "bg-indigo-100 text-indigo-800",
      "bg-violet-100 text-violet-800",
      "bg-rose-100 text-rose-800",
      "bg-sky-100 text-sky-800",
      "bg-slate-100 text-slate-800",
    ];

    // Simple hash function to consistently assign colors based on subject name
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      const char = subject.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and modulo to get consistent index
    const colorIndex = Math.abs(hash) % colorPalette.length;
    return colorPalette[colorIndex];
  }, []);

  // Filter events based on user role and permissions
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply role-based filtering using props
    if (userClass) {
      // Student view - filter by their specific class
      filtered = filtered.filter((event) => event.class === userClass);
    } else if (userName) {
      // Teacher view - filter by classes they teach
      filtered = filtered.filter((event) => event.teacher === userName);
    } else if (selectedClass) {
      // Admin view or when a class is selected
      filtered = filtered.filter((event) => event.class === selectedClass);
    }

    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, selectedClass, userClass, userName]);

  // Helper functions

  const formatTime = useCallback((time: string) => {
    // Check if time already contains AM/PM (display format)
    if (time.includes(" ")) {
      return time; // Already formatted
    }

    // Convert 24-hour format (e.g., "09:00", "13:00") to 12-hour format with AM/PM
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);

    let displayHour = hourNum;
    let meridiem = "AM";

    if (hourNum === 0) {
      displayHour = 12;
      meridiem = "AM";
    } else if (hourNum === 12) {
      displayHour = 12;
      meridiem = "PM";
    } else if (hourNum > 12) {
      displayHour = hourNum - 12;
      meridiem = "PM";
    }

    return `${displayHour}:${minutes} ${meridiem}`;
  }, []);

  const getEventForTimeSlot = useCallback(
    (dayOfWeek: number, timeSlot: string) => {
      // Convert timeSlot (e.g., "9:00 AM") to 24-hour format
      const [slotTime, slotPeriod] = timeSlot.split(" ");
      const [slotHour, slotMinute] = slotTime.split(":");
      let slotHourNum = Number.parseInt(slotHour);

      if (slotPeriod === "PM" && slotHourNum !== 12) {
        slotHourNum += 12;
      } else if (slotPeriod === "AM" && slotHourNum === 12) {
        slotHourNum = 0;
      }

      const slotTimeFormatted = `${slotHourNum.toString().padStart(2, "0")}:${slotMinute}`;

      // Filter events based on role-based filtering that was already applied
      return filteredEvents.find((event) => {
        return event.dayOfWeek === dayOfWeek && event.startTime === slotTimeFormatted;
      });
    },
    [filteredEvents],
  );

  // Get today's events for list view
  const todaysEvents = useMemo(() => {
    const today = new Date().getDay();
    return filteredEvents.filter(event => event.dayOfWeek === today);
  }, [filteredEvents]);

  // View rendering functions
  const renderListView = () => (
    <div className="space-y-4">
      {isLoading ? (
        Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="mb-2 h-6 w-1/3" />
              <Skeleton className="mb-2 h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
      ) : todaysEvents.length > 0 ? (
        todaysEvents.map((event, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg border transition-all hover:shadow-md",
              getSubjectColor(event.title),
            )}
          >
            <div className="flex items-start justify-between">
              <div className="text-lg font-bold">{event.title}</div>
              <Badge variant="outline">{event.class}</Badge>
            </div>
            <div className="mt-1 text-sm opacity-75">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </div>
            <div className="mt-2 flex items-center text-sm font-medium">
              <span className="mr-1">Teacher:</span>
              <span className="truncate" title={event.teacher}>
                {event.teacher}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          <div className="mb-2 text-xl font-semibold">No classes scheduled</div>
          <p className="mb-4">
            {userClass
              ? "You don&apos;t have any classes scheduled for today. Enjoy your free time! 📚"
              : userName
                ? "You don&apos;t have any classes to teach today. Time to prepare for tomorrow! 👨‍🏫"
                : "There are no classes scheduled for today. ✨"}
          </p>
          <div className="text-sm text-gray-400">
            {userClass
              ? "Check back tomorrow for your next classes or review your study materials."
              : userName
                ? "Use this time for lesson planning or student assessments."
                : "Students and teachers can enjoy a well-deserved break."}
          </div>
        </div>
      )}
    </div>
  );

  const renderScheduleGrid = (days: number[]) => (
    <div className="calendar-scroll w-full overflow-x-auto">
      <div
        className={cn("min-w-[1200px]", days.length === 1 && "min-w-[400px]")}
      >
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(280px, 1fr))` }}
        >
          {days.map((day) => (
            <div key={day} className="flex flex-col">
              <div className="flex h-12 items-center justify-center border-b bg-muted/30 font-semibold">
                {daysOfWeek[day]}
              </div>
              {isLoading
                ? Array(timeSlots.length)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="relative h-24 border-b border-gray-100"
                    >
                      <Skeleton className="absolute inset-1 rounded-md" />
                    </div>
                  ))
                : timeSlots.map((timeSlot, index) => {
                  const event = getEventForTimeSlot(day, timeSlot);

                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="relative h-28 border-b border-gray-100 transition-colors hover:bg-muted/10"
                    >
                      <div className="absolute left-0 top-0 p-1 text-xs font-medium text-gray-500">
                        {timeSlot}
                      </div>
                      {event ? (
                        <div
                          className={cn(
                            "absolute inset-1 p-2 rounded-md shadow-sm transition-all hover:shadow-md cursor-pointer",
                            getSubjectColor(event.title),
                          )}
                          title={`${event.title} - ${event.teacher} (${event.startTime} - ${event.endTime})`}
                        >
                          <div className="truncate text-xs font-medium">
                            {event.title}
                          </div>
                          <div className="truncate text-xs opacity-75">
                            {formatTime(event.startTime)} -{" "}
                            {formatTime(event.endTime)}
                          </div>
                          <div className="truncate text-xs opacity-75">
                            Class: {event.class}
                          </div>
                          <div className="mt-1 truncate text-xs opacity-75" title={event.teacher}>
                            {event.teacher.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-1 flex items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50/50 transition-all hover:bg-gray-100/50">
                          <div className="text-center opacity-60 hover:opacity-80">
                            <div className="text-xs font-medium text-gray-400">Free Period</div>
                            <div className="mt-1 text-xs text-gray-300">No class scheduled</div>
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
  );



  return (
    <Card className="w-full shadow-lg print:shadow-none">
      {/* Temporary debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="border-b bg-gray-50 p-2 text-xs">
          <div>Events: {events.length} | Filtered: {filteredEvents.length}</div>
          <div>User: {userName || userClass || 'Admin'} | Selected Class: {selectedClass || 'All'}</div>
          {events.length > 0 && (
            <div>Sample: {events[0].title} at {events[0].startTime} on day {events[0].dayOfWeek}</div>
          )}
        </div>
      )}

      <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center">
        <div className="flex flex-col">
          <CardTitle className="text-xl">
            {userClass
              ? `My Class Schedule - ${userClass}`
              : userName
                ? `My Teaching Schedule`
                : "Schedule Overview"
            }
          </CardTitle>
          {userClass && (
            <p className="text-sm text-muted-foreground">
              Here&apos;s your personalized class schedule for the week
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto print:hidden">
          {/* Class selector for admin view */}
          {!userClass && !userName && classesName.length > 0 && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">All Classes</option>
              {classesName.map((cls) => (
                <option key={cls.name} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          )}

          {/* View selector */}
          <div className="flex gap-1 rounded-md bg-secondary p-1">
            {(["week", "list"] as const).map((v) => (
              <Button
                key={v}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-sm hover:bg-primary/20",
                  view === v && "bg-primary text-primary-foreground",
                )}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
              >
                {v === "week" && <Grid className="size-4" />}
                {v === "list" && <List className="size-4" />}
                <span className="sr-only">{v} view</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 print:p-0">
        {view === "list" && renderListView()}
        {view === "week" && renderScheduleGrid([1, 2, 3, 4, 5])}
      </CardContent>
    </Card>
  );
}
