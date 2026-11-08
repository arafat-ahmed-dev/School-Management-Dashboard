import { Suspense } from "react";
import Announcements from "@/components/Announcements";
import CountChartContainer from "@/components/CountChartContainer";
import UserCardsContainer from "@/components/UserCardsContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import EventCalenderContainer from "@/components/EventCalenderContainer";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

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
        <Suspense
          fallback={
            <div className="flex flex-wrap justify-between gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 min-w-[130px] flex-1 rounded-2xl" />
              ))}
            </div>
          }
        >
          <UserCardsContainer />
        </Suspense>
        {/* MIDDLE CHART */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-h-[450px] w-full lg:w-1/3">
            <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-xl" />}>
              <CountChartContainer />
            </Suspense>
          </div>
          <div className="min-h-[450px] w-full lg:w-2/3">
            <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-xl" />}>
              <AttendanceChartContainer />
            </Suspense>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        {/* CALENDER */}
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-md" />}>
          <EventCalenderContainer searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-md" />}>
          <Announcements />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminPage;
