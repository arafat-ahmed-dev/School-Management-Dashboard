import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import EventCalenderContainer from "@/components/EventCalenderContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import prisma from "../../../../prisma";

const StudentPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const role = session?.user?.role || "student";

  // Check if user is authenticated and has student role
  if (!session || !userId) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-red-500">
              <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
              <p>Please log in to view your student dashboard.</p>
              <a href="/login" className="mt-2 inline-block text-blue-600 underline">
                Go to Login
              </a>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 xl:w-1/3">
          <EventCalenderContainer searchParams={searchParams} />
          <Announcements />
        </div>
      </div>
    );
  }

  // Check if user has student role
  if (session.user?.role !== "Student" && session.user?.role !== "student") {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-amber-600">
              <h2 className="mb-2 text-lg font-semibold">Access Denied</h2>
              <p className="mb-2">This page is only accessible to students.</p>
              <div className="text-sm text-gray-600">
                <p>Your account type: {session.user?.role || "Unknown"}</p>
                <p>If you believe this is an error, please contact your administrator.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 xl:w-1/3">
          <EventCalenderContainer searchParams={searchParams} />
          <Announcements />
        </div>
      </div>
    );
  }

  // First, fetch the current student's details including their class
  const currentStudent = await prisma.student.findUnique({
    where: {
      id: userId,
    },
    include: {
      class: {
        select: {
          id: true,
          name: true,
          grade: {
            select: {
              level: true,
            },
          },
        },
      },
    },
  });
  // If student is not found, try to find by username or email
  let studentByAlternative = null;
  if (!currentStudent && session?.user?.email) {
    studentByAlternative = await prisma.student.findFirst({
      where: {
        OR: [
          { email: session.user.email },
          { username: session.user.email }, // In case email is stored as username
        ],
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: {
              select: {
                level: true,
              },
            },
          },
        },
      },
    });
  }

  const student = currentStudent || studentByAlternative;

  // If student is not found or has no class assigned, return informative message
  if (!student) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-amber-600">
              <h2 className="mb-2 text-lg font-semibold">Student Profile Not Found</h2>
              <p className="mb-2">We couldn&apos;t find your student profile in our system.</p>
              <div className="text-sm text-gray-600">
                <p className="mb-2">This might happen if:</p>
                <ul className="mx-auto mt-2 max-w-md list-inside list-disc text-left">
                  <li>Your account is pending approval</li>
                  <li>Your student profile hasn&apos;t been created yet</li>
                  <li>There&apos;s a mismatch in your account information</li>
                  <li>You&apos;re logged in with a different account type</li>
                </ul>
                <div className="mt-4 rounded bg-gray-100 p-3">
                  <p className="text-xs text-gray-700">
                    <strong>Account Info:</strong><br />
                    Session ID: {userId}<br />
                    Email: {session?.user?.email || "Not available"}<br />
                    Role: {session?.user?.role || "Not specified"}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-medium">What you can do:</p>
                  <div className="space-y-2">
                    <a
                      href="/login"
                      className="block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Try Logging In Again
                    </a>
                    <p className="text-xs">
                      Or contact your school administrator for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 xl:w-1/3">
          <EventCalenderContainer searchParams={searchParams} />
          <Announcements />
        </div>
      </div>
    );
  }

  if (!student.class) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-blue-600">
              <h2 className="mb-2 text-lg font-semibold">Welcome, {student.name}!</h2>
              <p className="mb-2">Your student account is active, but you haven&apos;t been assigned to a class yet.</p>
              <div className="text-sm text-gray-600">
                <p>Please contact your administrator to be assigned to a class.</p>
                <p>Once assigned, you&apos;ll be able to view your schedule, assignments, and more.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 xl:w-1/3">
          <EventCalenderContainer searchParams={searchParams} />
          <Announcements />
        </div>
      </div>
    );
  }

  // Helper function to get day of week number
  const getDayOfWeekNumber = (day: string): number => {
    const dayMap: { [key: string]: number } = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };
    return dayMap[day] || 0;
  };

  // Fetch basic data for dropdowns with relationships (filtered for current student's class)
  const className = await prisma.class.findMany({
    where: {
      id: student.class.id, // Filter to only the current student's class
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch lessons for the calendar (filtered for current student's class)
  const lessons = await prisma.lesson.findMany({
    where: {
      classId: student.class.id, // Only lessons for this student's class
    },
    include: {
      subject: {
        select: {
          name: true,
        },
      },
      teacher: {
        select: {
          name: true,
        },
      },
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  // Transform lessons to CalendarEvent format
  const calendarEvents = lessons.map((lesson) => ({
    title: lesson.subject?.name || lesson.name,
    startTime: lesson.startTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }),
    endTime: lesson.endTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }),
    dayOfWeek: getDayOfWeekNumber(lesson.day),
    class: lesson.class?.name || '',
    teacher: lesson.teacher?.name || '',
  }));

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-2 md:p-4">
          <BigCalenderContainer
            type={role}
            calendarEvents={calendarEvents}
            classData={className}
          />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 xl:w-1/3">
        <EventCalenderContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
