"use client";

import { useState } from "react";
import { type CalendarEvent, calendarEvents } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Calendar,
  List,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateScheduleModal } from "./CreateScheduleModal";

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
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
];

const classNames = [
  "Class 7",
  "Class 8",
  "Class 9-(S)",
  "Class 9-(A)",
  "Class 9-(C)",
  "Class 10-(S)",
  "Class 10-(A)",
  "Class 10-(C)",
  "Class 11-(S)",
  "Class 11-(A)",
  "Class 11-(C)",
  "Class 12-(S)",
  "Class 12-(A)",
  "Class 12-(C)",
];

const subjectColors: Record<string, string> = {
  Math: "bg-blue-100 text-blue-800",
  English: "bg-green-100 text-green-800",
  Biology: "bg-yellow-100 text-yellow-800",
  Physics: "bg-purple-100 text-purple-800",
  Chemistry: "bg-pink-100 text-pink-800",
  History: "bg-orange-100 text-orange-800",
};

type ViewType = "list" | "week" | "day";
export default function ClassSchedule(
  teacherName: any,
  className: Array<{ name: string }>
) {
  console.log(className);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Class 7");

  const filteredEvents = events.filter(
    (event) => event.dayOfWeek === currentDate.getDay()
  );
  const sortedEvents = filteredEvents.sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const changeDate = (days: number) => {
    setCurrentDate((date) => new Date(date.setDate(date.getDate() + days)));
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventForTimeSlot = (dayOfWeek: number, timeSlot: string) => {
    return events.find(
      (event) =>
        event.dayOfWeek === dayOfWeek &&
        formatTime(event.startTime) === timeSlot
    );
  };

  const handleCreateSchedule = (
    scheduleData: Omit<CalendarEvent, "dayOfWeek"> & { dayOfWeek: string }
  ) => {
    const newEvent: CalendarEvent = {
      ...scheduleData,
      dayOfWeek: daysOfWeek.indexOf(scheduleData.dayOfWeek),
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const renderListView = () => (
    <div className="space-y-4">
      {sortedEvents.length > 0 ? (
        sortedEvents.map((event, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg",
              subjectColors[event.title] || "bg-gray-100"
            )}
          >
            <div className="font-bold text-lg">{event.title}</div>
            <div className="text-sm opacity-75">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </div>
            <div className="text-sm">Class: {event.class}</div>
            <div className="text-sm">Teacher: {event.teacher}</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No classes scheduled for this day.
        </div>
      )}
    </div>
  );

  const renderScheduleGrid = (days: number[]) => (
    <div className="w-full overflow-x-auto">
      <div
        className={cn("min-w-[600px]", days.length === 1 && "min-w-[300px]")}
      >
        <div className={`grid grid-cols-${days.length} gap-1`}>
          {/* Days columns */}
          {days.map((day) => (
            <div key={day} className="flex flex-col">
              <div className="h-12 border-b flex items-center justify-center font-semibold">
                {daysOfWeek[day]}
              </div>

              {timeSlots.map((timeSlot) => {
                const event = getEventForTimeSlot(day, timeSlot);
                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="h-24 border-b border-gray-100 relative"
                  >
                    {event ? (
                      <div
                        className={cn(
                          "absolute inset-1 p-2 rounded-md shadow-sm",
                          subjectColors[event.title] || "bg-gray-100"
                        )}
                      >
                        <div className="text-xs font-medium">{event.title}</div>
                        <div className="text-xs opacity-75">
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </div>
                        <div className="text-xs truncate">
                          Class: {event.class}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-center text-gray-500"></div>
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
    <Card className="w-full shadow-lg">
      <CardHeader
        className={`${
          view === "week" ? "justify-end" : "justify-between"
        } flex flex-col sm:flex-row items-center  gap-4 pb-2`}
      >
        <div
          className={`${
            view !== "week" ? "" : "hidden"
          } flex items-center gap-2`}
        >
          <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">
            {daysOfWeek[currentDate.getDay()]}
          </div>
          <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap justify-center sm:justify-end">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded-md cursor-pointer text-sm"
          >
            {className.length > 0
              ? className.map(({name}) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))
              : null}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create</span>
          </Button>
          <div className="bg-secondary rounded-md p-1 flex gap-1">
            {(["week", "day", "list"] as const).map((v) => (
              <Button
                key={v}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-sm hover:bg-primary/20",
                  view === v && "bg-primary text-primary-foreground"
                )}
                onClick={() => setView(v)}
              >
                {v === "week" && <Grid className="h-4 w-4" />}
                {v === "day" && <Calendar className="h-4 w-4" />}
                {v === "list" && <List className="h-4 w-4" />}
                <span className="sr-only">{v} view</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === "list" && renderListView()}
        {view === "week" && renderScheduleGrid([1, 2, 3, 4, 5])}
        {view === "day" && renderScheduleGrid([currentDate.getDay()])}
      </CardContent>
      <CreateScheduleModal
        teacherName={teacherName.teacherName}
        // className={className}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSchedule={handleCreateSchedule}
      />
    </Card>
  );
}
