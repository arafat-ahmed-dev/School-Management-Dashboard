import Announcements from "@/components/Announcements";
import BigCalender from "@/components/BigCalender";
import EventCalender from "@/components/EventCalender";

const StudentPage = () => {
  return (
    <div className="md:p-4 flex gap-4 flex-col xl:flex-row p-2">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white md:p-4 rounded-md p-2">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalender />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
