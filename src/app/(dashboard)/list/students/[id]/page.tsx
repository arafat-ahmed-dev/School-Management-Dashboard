import Announcements from "@/components/Announcements";
import IndividualBigCalendar from "@/components/IndividualBigCalendar";
import IndividualPerformance from "@/components/IndividualPerformance";
import { getStudentData, getStudentLessons, getStudentPerformance } from "@/lib/individual-data-service";
import { getStudentPageShortcuts, canViewPerformance } from "@/lib/access-control";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const SingleStudentPage = async ({ params }: { params: { id: string } }) => {
  const studentId = params.id;

  // Check authentication and authorization
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Additional URL-level access control
  const { id: currentUserId, role } = session.user;

  // Define access rules for direct URL access
  if (role === "student" && currentUserId !== studentId) {
    // Students can only access their own page
    redirect(`/list/students/${currentUserId}`);
  }

  if (role === "parent") {
    // Parents should access through their dashboard, not direct student URLs
    redirect("/parent");
  }

  // Teachers and admins can access any student (but data service will filter appropriately)

  try {
    // Fetch all student data (authorization happens in data service)
    const [studentData, lessons, performance] = await Promise.all([
      getStudentData(studentId),
      getStudentLessons(studentId),
      getStudentPerformance(studentId),
    ]);

    // Get role-based shortcuts
    const shortcuts = getStudentPageShortcuts(studentId, role as any);
    const showPerformance = canViewPerformance(role as any, 'student');

    // Format birth date
    const birthDateFormatted = studentData.birthDate
      ? new Date(studentData.birthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      })
      : "Not provided";

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          {/* TOP */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* USER INFO CARD */}
            <div className="flex flex-1 gap-4 rounded-md bg-aamSky px-4 py-6">
              <div className="w-1/3">
                <Image
                  src={studentData.img || "/default-profile.png"}
                  alt={studentData.name}
                  width={144}
                  height={144}
                  className="size-36 rounded-full object-cover"
                />
              </div>
              <div className="flex w-2/3 flex-col justify-between gap-4">
                <h1 className="text-xl font-semibold">{studentData.name}</h1>
                <p className="text-sm text-gray-500">
                  {studentData.class
                    ? `Grade ${studentData.class.grade.level} - Class ${studentData.class.name}`
                    : "No class assigned"
                  }
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                    <span>{studentData.bloodType || "Unknown"}</span>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <span>{birthDateFormatted}</span>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span>{studentData.email}</span>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span>{studentData.phone || "No phone"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* SMALL CARDS */}
            <div className="flex flex-1 flex-wrap justify-between gap-4">
              {/* ATTENDANCE CARD */}
              <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleAttendance.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{studentData.attendancePercentage}%</h1>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>
              {/* GRADE CARD */}
              <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">
                    {studentData.class ? `${studentData.class.grade.level}th` : "N/A"}
                  </h1>
                  <span className="text-sm text-gray-400">Grade</span>
                </div>
              </div>
              {/* LESSONS CARD */}
              <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{studentData.totalLessons}</h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>
              {/* CLASS CARD */}
              <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">
                    {studentData.class?.name || "No Class"}
                  </h1>
                  <span className="text-sm text-gray-400">Class</span>
                </div>
              </div>
            </div>
          </div>
          {/* BOTTOM */}
          <div className="mt-4 h-fit rounded-md bg-white p-4">
            <h1>{studentData.name}&apos;s Schedule</h1>
            <Suspense fallback={<div className="h-[400px] animate-pulse rounded bg-gray-100"></div>}>
              <IndividualBigCalendar lessons={lessons} type="student" />
            </Suspense>
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex w-full flex-col gap-4 xl:w-1/3">
          <div className="rounded-md bg-white p-4">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              {shortcuts.map((shortcut, index) => (
                <Link
                  key={index}
                  className={`rounded-md ${shortcut.bgColor} p-3`}
                  href={shortcut.href}
                >
                  {shortcut.label}
                </Link>
              ))}
            </div>
          </div>
          {showPerformance && (
            <IndividualPerformance
              type="student"
              data={{
                averageScore: performance.overallAverage,
                attendancePercentage: studentData.attendancePercentage,
              }}
              studentId={studentId}
            />
          )}
          <Announcements />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading student page:", error);
    // If data service throws notFound(), it will handle the 404
    // If other error, redirect to safe page
    redirect("/list/students");
  }
}; export default SingleStudentPage;
