import Announcements from "@/components/Announcements";
import IndividualBigCalendar from "@/components/IndividualBigCalendar";
import IndividualPerformance from "@/components/IndividualPerformance";
import { getTeacherData, getTeacherLessons } from "@/lib/individual-data-service";
import { getTeacherPageShortcuts, canViewPerformance } from "@/lib/access-control";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const SingleTeacherPage = async ({ params }: { params: { id: string } }) => {
  const teacherId = params.id;

  // Check authentication and authorization
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Additional URL-level access control
  const { id: currentUserId, role } = session.user;

  // Define access rules for direct URL access
  if (role === "teacher" && currentUserId !== teacherId) {
    // Teachers can only access their own page
    redirect(`/list/teachers/${currentUserId}`);
  }

  if (role === "student") {
    // Students should not access teacher detail pages directly
    // They can see teacher info through their own classes/lessons
    redirect("/student");
  }

  if (role === "parent") {
    // Parents should access through their dashboard
    redirect("/parent");
  }

  // Admins can access any teacher page

  try {
    // Fetch teacher data and lessons (authorization happens in data service)
    const [teacherData, lessons] = await Promise.all([
      getTeacherData(teacherId),
      getTeacherLessons(teacherId),
    ]);

    // Get role-based shortcuts
    const shortcuts = getTeacherPageShortcuts(teacherId, role as any);
    const showPerformance = canViewPerformance(role as any, 'teacher');

    // Format birthday
    const birthdayFormatted = teacherData.birthday
      ? new Date(teacherData.birthday).toLocaleDateString('en-US', {
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
                  src={teacherData.img || "/default-profile.png"}
                  alt={teacherData.name}
                  width={144}
                  height={144}
                  className="size-36 rounded-full object-cover object-top sm:object-left-top"
                />
              </div>
              <div className="flex w-2/3 flex-col justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold">{teacherData.name}</h1>
                </div>
                <p className="text-sm text-gray-500">
                  {teacherData.subjects.length > 0
                    ? `Teaching: ${teacherData.subjects.map(s => s.name).join(', ')}`
                    : "No subjects assigned"
                  }
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                    <span>{teacherData.bloodType || "Unknown"}</span>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <span>{birthdayFormatted}</span>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span>{teacherData.email}</span>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span>{teacherData.phone || "No phone"}</span>
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
                  <h1 className="text-xl font-semibold">{teacherData.attendancePercentage}%</h1>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>
              {/* SUBJECTS CARD */}
              <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{teacherData.subjects.length}</h1>
                  <span className="text-sm text-gray-400">Subjects</span>
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
                  <h1 className="text-xl font-semibold">{teacherData.totalLessons}</h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>
              {/* CLASSES CARD */}
              <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{teacherData.classes.length}</h1>
                  <span className="text-sm text-gray-400">Classes</span>
                </div>
              </div>
            </div>
          </div>
          {/* BOTTOM */}
          <div className="mt-4 min-h-[800px] rounded-md bg-white p-4">
            <h1 className="text-center font-semibold md:text-left">
              {teacherData.name}&apos;s Schedule
            </h1>
            <Suspense fallback={<div className="h-[400px] animate-pulse rounded bg-gray-100"></div>}>
              <IndividualBigCalendar lessons={lessons} type="teacher" />
            </Suspense>
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex w-full flex-col gap-4 xl:w-1/3">
          <div className="rounded-md bg-white p-4">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              {shortcuts.map((action, index) => (
                <Link
                  key={index}
                  className="rounded-md bg-aamSkyLight p-3"
                  href={action.href}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
          {showPerformance && (
            <IndividualPerformance
              type="teacher"
              data={{
                averageScore: 0, // Teachers don't have scores like students
                attendancePercentage: teacherData.attendancePercentage || 100,
              }}
              teacherId={teacherId}
            />
          )}
          <Announcements />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading teacher page:", error);
    redirect("/list/teachers");
  }
};

export default SingleTeacherPage;
