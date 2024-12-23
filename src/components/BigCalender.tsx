"use client";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalender = () => {
  const [view, setView] = useState<View>("work_week");

  const handleOnChange = (selectedView:View) => {
    setView(selectedView);
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "95vh"}}
        views={["work_week", "day"]}
        view={view}
        onView={handleOnChange}
        min={new Date(2021, 10, 0, 9, 0, 0)}
        max={new Date(2021, 10, 31, 18, 0, 0)}
      />
    </div>
  );
};

export default BigCalender;
