import Announcements from "@/components/Announcements";
import EventCalender from "@/components/EventCalender";
import BigCalenderContainer from "@/components/BigCalenderContainer";

const StudentPage = () => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-2 md:p-4">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalenderContainer
            type={"teacherId"}
            id={"67d27fa6d428b94e4852d887"}
          />
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
