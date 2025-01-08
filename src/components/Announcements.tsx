import Image from "next/image";

const Announcement = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    className: "bg-aamSkyLight",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    className: "bg-aamPurpleLight",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    className: "bg-aamYellowLight",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold my-4">Announcements</h1>
        <Image src="/moreDark.png" width={20} height={20} alt="more" />
      </div>
      <div className="flex flex-col gap-4">
        {Announcement.map((event) => (
          <div className={`${event.className} rounded-md p-4`} key={event.id}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{event.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {event.time}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
