import Announcements from "@/components/Announcements";
import BigCalender from "@/components/BigCalender";
import EventCalender from "@/components/EventCalender";

const StudentPage = () => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-2 md:p-4 ">
          <div>
            <h1 className="text-xl font-semibold">Schedule ( Jone Lew )</h1>
            <BigCalender />
          </div>
          <div className="mt-4 border-t border-gray-600 pt-6">
            <h1 className="text-xl font-semibold">Schedule ( Jone Lew )</h1>
            <BigCalender />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 xl:w-1/3">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
