import React from "react";

export const EventsSection: React.FC = () => {
  return (
    <section className="events bg-white p-8">
      <h2 className="text-2xl">Upcoming Events</h2>
      <ul className="mt-4">
        <li>Science Fair - June 20</li>
        <li>Art Exhibition - July 15</li>
        <li>Sports Day - August 10</li>
      </ul>
    </section>
  );
};
