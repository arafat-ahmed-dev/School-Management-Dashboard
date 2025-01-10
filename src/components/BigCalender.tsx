"use client";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import { useState } from "react";
import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";

const localizer = momentLocalizer(moment);

const BigCalender = () => {
  const [view, setView] = useState<View>("work_week");

  const handleOnChange = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "95vh" }}
        views={["work_week", "day"]}
        view={view}
        onView={handleOnChange}
        min={new Date(2021, 10, 0, 9, 0, 0)}
        max={new Date(2021, 10, 31, 18, 0, 0)}
      />
      <div className="flex items-center justify-center mt-5">
        <Button
          className="bg-blue-500 hover:bg-blue-600 w-fit"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>
    </div>
  );
};

export default BigCalender;
