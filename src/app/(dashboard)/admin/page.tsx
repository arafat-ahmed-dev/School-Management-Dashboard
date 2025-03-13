import Announcements from "@/components/Announcements";
import CountChartContainer from "@/components/CountChartContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import EventCalenderContainer from "@/components/EventCalenderContainer";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:flex-row md:p-4">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex flex-wrap justify-between gap-4">
          <UserCard type="admin" />
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
        </div>
        {/* MIDDLE CHART */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-h-[450px] w-full lg:w-1/3">
            <CountChartContainer />
          </div>
          <div className="min-h-[450px] w-full lg:w-2/3">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="size-full min-h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        {/* CALENDER */}
        <EventCalenderContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
