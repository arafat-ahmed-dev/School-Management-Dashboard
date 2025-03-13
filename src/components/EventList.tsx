import React from "react";
import prisma from "../../prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });
  return data.map((event) => (
    <div
      key={event.id}
      className="rounded-md border-2 border-t-4 border-gray-100 p-5 odd:border-t-aamSky even:border-t-aamPurple"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-600">{event.title}</h1>
        <p className="text-xs text-gray-300">
          {event.startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
      <div>
        <p className="mt-2 text-sm text-gray-400">{event.description}</p>
      </div>
    </div>
  ));
};

export default EventList;
