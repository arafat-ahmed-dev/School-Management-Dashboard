import React from "react";
import EventCalender from "@/components/EventCalender";
import EventList from "@/components/EventList";

const EventCalenderContainer = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="rounded-md bg-white p-4">
      <EventCalender />
      <div className="flex items-center justify-between">
        <h1 className="my-4 text-xl font-semibold">Events</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalenderContainer;
