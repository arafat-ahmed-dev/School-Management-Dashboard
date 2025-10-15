import Announcements from "@/components/Announcements";
import EventCalender from "@/components/EventCalender";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

const TeacherPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-2 md:p-4">
          <BigCalenderContainer
            type="teacher"
            id={userId}
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

export default TeacherPage;
