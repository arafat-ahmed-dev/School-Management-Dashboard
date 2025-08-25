"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

interface ScheduleBlock {
  time: string;
  subject: string;
}

interface DaySchedule {
  date: string;
  blocks: ScheduleBlock[];
}

const colors: { [key: string]: string } = {
  Math: "bg-blue-50",
  Biology: "bg-green-50",
  Physics: "bg-purple-50",
  English: "bg-pink-50",
  Chemistry: "bg-amber-50",
  History: "bg-gray-50",
};

const schedule: DaySchedule[] = [
  {
    date: "January 27",
    blocks: [
      { time: "9:00 AM – 9:50 AM", subject: "Math" },
      { time: "10:00 AM – 10:50 AM", subject: "Biology" },
      { time: "11:00 AM – 11:50 AM", subject: "Physics" },
      { time: "12:00 PM – 12:50 PM", subject: "English" },
      { time: "1:00 PM – 1:50 PM", subject: "Chemistry" },
      { time: "2:00 PM – 2:50 PM", subject: "History" },
    ],
  },
  {
    date: "January 28",
    blocks: [
      { time: "9:00 AM – 9:50 AM", subject: "English" },
      { time: "10:00 AM – 10:50 AM", subject: "Biology" },
      { time: "11:00 AM – 11:50 AM", subject: "Physics" },
      { time: "2:00 PM – 2:50 PM", subject: "History" },
    ],
  },
  {
    date: "January 29",
    blocks: [
      { time: "9:00 AM – 9:50 AM", subject: "Math" },
      { time: "10:00 AM – 10:50 AM", subject: "Biology" },
      { time: "2:00 PM – 2:50 PM", subject: "History" },
    ],
  },
  {
    date: "January 30",
    blocks: [
      { time: "9:00 AM – 9:50 AM", subject: "English" },
      { time: "10:00 AM – 10:50 AM", subject: "Biology" },
      { time: "11:00 AM – 11:50 AM", subject: "Physics" },
      { time: "2:00 PM – 2:50 PM", subject: "History" },
    ],
  },
  {
    date: "January 31",
    blocks: [
      { time: "9:00 AM – 9:50 AM", subject: "Math" },
      { time: "11:00 AM – 11:50 AM", subject: "Physics" },
      { time: "1:00 PM – 1:50 PM", subject: "Chemistry" },
      { time: "2:00 PM – 2:50 PM", subject: "History" },
    ],
  },
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

function formatTimeRange(timeRange: string) {
  const [start, end] = timeRange.split("–").map((t) => t.trim());
  return { start, end };
}

export default function Schedule() {
  const [view, setView] = useState<"week" | "day">("week");
  const [currentDayIndex] = useState(0);

  const currentSchedule =
    view === "week" ? schedule : [schedule[currentDayIndex]];

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

        <div className="flex">
          <div className="w-16 flex-shrink-0">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-24 flex items-start border border-gray-200"
              >
                <span className="text-xs text-gray-500 p-1">{time}</span>
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
              {currentSchedule.map((day, dayIndex) => (
                <div key={dayIndex} className="relative">
                  {view === "week" && (
                    <div className="absolute -top-6 left-0 text-xs text-gray-500">
                      {day.date.split(" ")[1]}
                    </div>
                  )}
                  {view === "day" && (
                    <div className="absolute w-[80%] -top-6 left-0 overflow-hidden text-xs text-gray-500">
                      {day.date.split(" ")[1]}
                    </div>
                  )}
                  {timeSlots.map((timeSlot, slotIndex) => {
                    const block = day.blocks.find((b) =>
                      b.time.startsWith(timeSlot)
                    );
                    const times = block ? formatTimeRange(block.time) : null;
                    return (
                      <div
                        key={`${dayIndex}-${slotIndex}`}
                        className="h-24 border-t border-r border-b relative"
                      >
                        {block && (
                          <div
                            className={cn(
                              "absolute inset-0 p-1.5 flex flex-col",
                              colors[block.subject]
                            )}
                          >
                            <div className="text-[10px] leading-tight text-gray-500">
                              {times?.start} - {times?.end}
                            </div>
                            <span className="text-xs font-medium mt-1">
                              {block.subject}
                            </span>
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
      </div>
      <div className="flex items-center justify-center mt-5">
        <Button className="bg-blue-500 hover:bg-blue-600 w-fit">
          <DownloadIcon className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>
    </div>
  );
}
