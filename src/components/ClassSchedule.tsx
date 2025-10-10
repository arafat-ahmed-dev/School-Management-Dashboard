"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { type CalendarEvent, calendarEvents } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  List,
  Grid,
  Search,
  Printer,
  Download,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateScheduleModal } from "./create-schedule-modal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendarOperations } from "@/hooks/useCalendarOperations";

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

type ViewType = "list" | "week" | "all";
interface TeacherItem {
  name: string;
  subjects: { name: string }[];
}
interface ClassItem {
  name: string;
}
interface SubjectItem {
  name: string;
  teachers: { name: string }[];
}

export interface ClassScheduleProps {
  teacherName: TeacherItem[];
  classesName: ClassItem[];
  subjectName: SubjectItem[];
  initialEvents?: CalendarEvent[];
  isLoading?: boolean;
}

export default function ClassSchedule({
  teacherName,
  classesName,
  subjectName,
  initialEvents = [],
  isLoading = false,
}: ClassScheduleProps) {
  // Hooks
  const { createLesson } = useCalendarOperations();

  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents.length > 0 ? initialEvents : calendarEvents);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(
    classesName[0]?.name || "Class 7",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [preFillData, setPreFillData] = useState<{
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    class?: string;
  }>({});

  // Sync events when initialEvents change
  useEffect(() => {
    if (initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  const subjectColors: Record<string, string> = {
    // Math subjects
    Math: "bg-blue-100 text-blue-800",
    Mathematics: "bg-blue-100 text-blue-800",
    "Advanced Math": "bg-blue-200 text-blue-900",

    // English subjects
    English: "bg-green-100 text-green-800",
    "English-1": "bg-green-100 text-green-800",
    "English-2": "bg-green-200 text-green-900",
    "English Literature": "bg-green-200 text-green-900",

    // Bangla subjects
    "Bangla-1": "bg-teal-100 text-teal-800",
    "Bangla-2": "bg-teal-200 text-teal-900",

    // Sciences
    Biology: "bg-yellow-100 text-yellow-800",
    Physics: "bg-purple-100 text-purple-800",
    "Physics Lab": "bg-purple-200 text-purple-900",
    Chemistry: "bg-pink-100 text-pink-800",
    "General Science": "bg-lime-100 text-lime-800",

    // Social Studies
    History: "bg-orange-100 text-orange-800",
    Geography: "bg-amber-100 text-amber-800",
    "Bangladesh and Global Studies": "bg-amber-200 text-amber-900",
    Civics: "bg-slate-100 text-slate-800",
    "Islamic History and Culture": "bg-orange-200 text-orange-900",

    // Commerce subjects
    Economics: "bg-emerald-100 text-emerald-800",
    Accounting: "bg-emerald-200 text-emerald-900",
    "Business Organization and Management": "bg-emerald-300 text-emerald-900",

    // Technology and Others
    "Computer Science": "bg-cyan-100 text-cyan-800",
    ICT: "bg-cyan-200 text-cyan-900",
    "Information and Communication Technology": "bg-cyan-200 text-cyan-900",
    Religion: "bg-violet-100 text-violet-800",
    "Social Studies": "bg-indigo-100 text-indigo-800",
  };
  // Derived state with memoization for performance
  const filteredEvents = useMemo(() => {
    const filtered = events.filter(
      (event) =>
        event.dayOfWeek === currentDate.getDay() &&
        event.class === selectedClass &&
        (searchQuery === "" ||
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.teacher.toLowerCase().includes(searchQuery.toLowerCase())),
    );
    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, currentDate, selectedClass, searchQuery]);

  // Helper functions
  const changeDate = useCallback((days: number) => {
    setCurrentDate((date) => new Date(date.setDate(date.getDate() + days)));
  }, []);

  const formatTime = useCallback((time: string) => {
    // Split the time into the numeric part and the meridiem ("AM" or "PM")
    const [timePart, meridiem] = time.split(" ");
    const [hours, minutes] = timePart.split(":");
    let hourNum = parseInt(hours, 10);

    // Convert to 24-hour format
    if (meridiem === "PM" && hourNum !== 12) {
      hourNum += 12;
    }
    if (meridiem === "AM" && hourNum === 12) {
      hourNum = 0;
    }

    // Create a formatted time string in 24-hour format (HH:mm)
    const formattedTime = `${hourNum.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    // Create a date using a fixed date and the formatted time
    const date = new Date(`1970-01-01T${formattedTime}:00`);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getEventForTimeSlot = useCallback(
    (dayOfWeek: number, timeSlot: string, className?: string) => {
      const [slotHour, slotPeriod] = timeSlot.split(/:| /);
      const slotHourNum =
        Number.parseInt(slotHour) +
        (slotPeriod === "PM" && slotHour !== "12" ? 12 : 0);

      return events.find((event) => {
        if (
          event.dayOfWeek !== dayOfWeek ||
          (className && event.class !== className)
        )
          return false;

        const [eventStartHour, eventStartPeriod] = event.startTime.split(/:| /);
        const eventHourNum =
          Number.parseInt(eventStartHour) +
          (eventStartPeriod === "PM" && eventStartHour !== "12" ? 12 : 0);

        return eventHourNum === slotHourNum;
      });
    },
    [events],
  );

  const handleCreateSchedule = useCallback(
    async (
      scheduleData: Omit<CalendarEvent, "dayOfWeek"> & { dayOfWeek: string },
    ) => {
      // Call the server action to create the lesson
      const newEvent = await createLesson(scheduleData);

      // Only add to local state if newEvent is defined
      if (newEvent) {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }

      // Modal will close itself on success
    },
    [createLesson],
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = [
      "Subject",
      "Day",
      "Start Time",
      "End Time",
      "Class",
      "Teacher",
    ];
    const csvData = events
      .map((event) =>
        [
          event.title,
          daysOfWeek[event.dayOfWeek],
          event.startTime,
          event.endTime,
          event.class,
          event.teacher,
        ].join(","),
      )
      .join("\n");

    const csvContent = [headers.join(","), csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `class-schedule-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();
  }, [events]);

  // Helper function to convert AM/PM time to 24-hour format
  const convertTo24Hour = useCallback((timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, []);

  // Helper function to suggest end time (1 hour later)
  const suggestEndTime = useCallback((startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = hours + 1;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, []);

  // Function to handle time slot click with pre-fill data
  const handleTimeSlotClick = useCallback((timeSlot: string, dayOfWeek: number, className?: string) => {
    const startTime24 = convertTo24Hour(timeSlot);
    const endTime24 = suggestEndTime(startTime24);
    
    const dayName = daysOfWeek[dayOfWeek];
    
    setPreFillData({
      dayOfWeek: dayName,
      startTime: startTime24,
      endTime: endTime24,
      class: className || selectedClass,
    });
    
    setIsCreateModalOpen(true);
  }, [convertTo24Hour, suggestEndTime, selectedClass]);

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
      ) : filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg border transition-all hover:shadow-md",
              subjectColors[event.title] || "bg-gray-100",
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
              <span className="mr-1">Teacher:</span> {event.teacher}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          <div className="mb-2 text-xl font-semibold">No classes scheduled</div>
          <p>
            There are no classes scheduled for this day or your search criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2 size-4" />
            Add a class
          </Button>
        </div>
      )}
    </div>
  );

  const renderScheduleGrid = (days: number[]) => (
    <div className="w-full overflow-x-auto">
      <div
        className={cn("min-w-[600px]", days.length === 1 && "min-w-[300px]")}
      >
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
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
                : timeSlots.map((timeSlot) => {
                  type ClassSchedule = {
                    title: string;
                    startTime: string;
                    endTime: string;
                    dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
                    class: string;
                    teacher: string;
                  };
                  const event: ClassSchedule | null =
                    getEventForTimeSlot(day, timeSlot, selectedClass) || null;

                  if (event) {
                    console.log(event);
                    // const title = event.title;
                    // const start = formatTime(event.startTime);
                    // const end = formatTime(event.endTime);
                    // console.log(title, "--------- > ", start, "--", end);
                  } else {
                    console.log("No event found for this time slot.");
                  }
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="relative h-24 border-b border-gray-100 transition-colors hover:bg-muted/10"
                    >
                      <div className="absolute left-0 top-0 p-1 text-xs text-gray-500">
                        {timeSlot}
                      </div>
                      {event ? (
                        <div
                          className={cn(
                            "absolute inset-1 p-2 rounded-md shadow-sm transition-all hover:shadow-md",
                            subjectColors[event.title]
                              ? subjectColors[event.title]
                              : "bg-gray-100 text-gray-800",
                          )}
                        >
                          <div className="text-xs font-medium">
                            {event.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {formatTime(event.startTime)} -{" "}
                            {formatTime(event.endTime)}
                          </div>
                          <div className="truncate text-xs">
                            Class: {event.class}
                          </div>
                          <div className="mt-1 truncate text-xs">
                            Teacher: {event.teacher}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTimeSlotClick(timeSlot, day, selectedClass)}
                          className="absolute inset-1 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                        >
                          <PlusCircle className="mr-1 size-4" />
                          <span className="text-xs">Add</span>
                        </button>
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

  const renderAllClassesView = () => {
    const allClasses = classesName.map((c) => c.name);
    const dayEvents = events.filter(
      (event) => event.dayOfWeek === currentDate.getDay(),
    );

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="sticky left-0 z-10 border bg-background p-2 text-left font-semibold">
                  Time
                </th>
                {allClasses.map((className) => (
                  <th
                    key={className}
                    className="border p-2 text-center font-semibold"
                  >
                    {className}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(timeSlots.length)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td className="sticky left-0 border bg-background p-2 font-medium">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      {allClasses.map((className, j) => (
                        <td key={`${i}-${j}`} className="border p-1">
                          <Skeleton className="h-16 w-full rounded-md" />
                        </td>
                      ))}
                    </tr>
                  ))
                : timeSlots.map((timeSlot) => {
                  const [slotHour, slotPeriod] = timeSlot.split(/:| /);
                  const slotHourNum =
                    Number.parseInt(slotHour) +
                    (slotPeriod === "PM" && slotHour !== "12" ? 12 : 0);

                  return (
                    <tr key={timeSlot} className="hover:bg-muted/10">
                      <td className="sticky left-0 z-10 border bg-background p-2 font-medium">
                        {timeSlot}
                      </td>
                      {allClasses.map((className) => {
                        const classEvent = dayEvents.find((event) => {
                          if (event.class !== className) return false;

                          const [eventStartHour, eventStartPeriod] =
                            event.startTime.split(/:| /);
                          const eventHourNum =
                            Number.parseInt(eventStartHour) +
                            (eventStartPeriod === "PM" &&
                              eventStartHour !== "12"
                              ? 12
                              : 0);

                          return eventHourNum === slotHourNum;
                        });

                        return (
                          <td
                            key={`${className}-${timeSlot}`}
                            className="relative min-h-[80px] border p-1"
                          >
                            {classEvent ? (
                              <div
                                className={cn(
                                  "p-2 rounded-md h-full transition-all hover:shadow-md",
                                  subjectColors[classEvent.title] ||
                                  "bg-gray-100",
                                )}
                              >
                                <div className="text-xs font-medium">
                                  {classEvent.title}
                                </div>
                                <div className="text-xs opacity-75">
                                  {formatTime(classEvent.startTime)} -{" "}
                                  {formatTime(classEvent.endTime)}
                                </div>
                                <div className="mt-1 truncate text-xs">
                                  Teacher: {classEvent.teacher}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleTimeSlotClick(timeSlot, currentDate.getDay(), className)}
                                className="flex h-16 w-full items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                              >
                                <PlusCircle className="mr-1 size-3" />
                                <span className="text-xs">Add</span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg print:shadow-none">
      <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center">
        <div className="flex flex-col">
          <CardTitle className="text-xl">Class Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            {view === "week"
              ? `Weekly schedule for ${selectedClass}`
              : `Schedule for ${daysOfWeek[currentDate.getDay()]}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 sm:ml-auto sm:justify-end md:flex-nowrap print:hidden">
          {/* Search and filters */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:w-[200px]"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchQuery("")}>
                  Clear filters
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="mr-2 size-4" />
                  Print schedule
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV}>
                  <Download className="mr-2 size-4" />
                  Export to CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDate(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="min-w-24 text-center text-sm font-medium">
              {daysOfWeek[currentDate.getDay()]},{" "}
              {currentDate.toLocaleDateString()}
            </div>
            <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Class selector */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="cursor-pointer rounded-md border p-2 text-sm"
            aria-label="Select class"
          >
            {classesName.length > 0 ? (
              classesName.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))
            ) : (
              <option value="Class 7">Class 7</option>
            )}
          </select>

          {/* Add button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2 size-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          {/* View selector */}
          <div className="flex gap-1 rounded-md bg-secondary p-1">
            {(["week", "list", "all"] as const).map((v) => (
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
                {v === "all" && <span className="text-xs">All</span>}
                <span className="sr-only">{v} view</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 print:p-0">
        {view === "list" && renderListView()}
        {view === "week" && renderScheduleGrid([1, 2, 3, 4, 5])}
        {view === "all" && renderAllClassesView()}
      </CardContent>

      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setPreFillData({}); // Clear pre-fill data when modal closes
        }}
        onCreateSchedule={handleCreateSchedule}
        classOptions={classesName.map((c) => c.name)}
        teacherOptions={teacherName}
        subjectOptions={subjectName}
        isLoading={isLoading}
        preFillData={preFillData}
      />
    </Card>
  );
}
