import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import EventCalenderContainer from "@/components/EventCalenderContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import prisma from "../../../../prisma";

const TeacherPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const role = session?.user?.role || "teacher";

  // Check if user is authenticated
  if (!session || !userId) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-red-500">
              <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
              <p>Please log in to view your teacher dashboard.</p>
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

  // Check if user has teacher role
  if (session.user?.role !== "Teacher" && session.user?.role !== "teacher") {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-amber-600">
              <h2 className="mb-2 text-lg font-semibold">Access Denied</h2>
              <p className="mb-2">This page is only accessible to teachers.</p>
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

  // Fetch the current teacher's details including their subjects
  const currentTeacher = await prisma.teacher.findUnique({
    where: {
      id: userId,
    },
    include: {
      subjects: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  // If teacher is not found, try to find by username or email
  let teacherByAlternative = null;
  if (!currentTeacher && session?.user?.email) {
    teacherByAlternative = await prisma.teacher.findFirst({
      where: {
        OR: [
          { email: session.user.email },
          { username: session.user.email }, // In case email is stored as username
        ],
      },
      include: {
        subjects: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  const teacher = currentTeacher || teacherByAlternative;

  // If teacher is not found, return informative message
  if (!teacher) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-amber-600">
              <h2 className="mb-2 text-lg font-semibold">Teacher Profile Not Found</h2>
              <p className="mb-2">We couldn&apos;t find your teacher profile in our system.</p>
              <div className="text-sm text-gray-600">
                <p className="mb-2">This might happen if:</p>
                <ul className="mx-auto mt-2 max-w-md list-inside list-disc text-left">
                  <li>Your account is pending approval</li>
                  <li>Your teacher profile hasn&apos;t been created yet</li>
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

  // If teacher has no subjects assigned
  if (!teacher.subjects || teacher.subjects.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-blue-600">
              <h2 className="mb-2 text-lg font-semibold">Welcome, {teacher.name}!</h2>
              <p className="mb-2">Your teacher account is active, but you haven&apos;t been assigned any subjects yet.</p>
              <div className="text-sm text-gray-600">
                <p>Please contact your administrator to be assigned subjects.</p>
                <p>Once assigned, you&apos;ll be able to view your schedule, classes, and more.</p>
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

  // Fetch basic data for dropdowns with relationships (filtered for current teacher's subjects)
  const subjectData = await prisma.subject.findMany({
    where: {
      id: { in: teacher.subjects.map(s => s.id) }, // Filter to only the current teacher's subjects
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // First, let's check what lessons exist for this teacher regardless of subject filtering
  const allTeacherLessons = await prisma.lesson.findMany({
    where: {
      teacherId: userId, // Only lessons taught by this teacher
    },
    include: {
      subject: {
        select: {
          id: true,
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
  // This will help us identify if the issue is with subject filtering or lesson fetching
  const lessons = allTeacherLessons;

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
          <h1 className="mb-4 text-xl font-semibold">
            My Teaching Schedule
            <span className="ml-2 text-sm font-normal text-gray-600">
              (Assigned subjects: {teacher.subjects.map(s => s.name).join(', ')})
            </span>
          </h1>
          <div className="mb-4 text-sm text-gray-600">
            <p>Showing {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} assigned to you</p>
            <div className="mt-2 rounded bg-gray-50 p-3">
              <p className="font-medium">Teacher Information:</p>
              <p>• Officially assigned subjects: {teacher.subjects.map(s => s.name).join(', ')}</p>
              <p>• Total lessons assigned to you: {lessons.length}</p>
              {lessons.length > 0 && (
                <div className="mt-2">
                  <p>• Subjects you&apos;re actually teaching:</p>
                  <div className="ml-4">
                    {Array.from(new Set(lessons.map(l => l.subject?.name).filter(Boolean))).map((subjectName, index) => (
                      <span key={index} className="mr-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs">
                        {subjectName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {lessons.length > 0 && Array.from(new Set(lessons.map(l => l.subject?.name).filter(Boolean))).some(actualSubject =>
                !teacher.subjects.some(assignedSubject => assignedSubject.name === actualSubject)
              ) && (
                  <p className="mt-2 text-amber-600">
                    <strong>Notice:</strong> There&apos;s a mismatch between your officially assigned subjects and the lessons you&apos;re actually teaching.
                    Please contact your administrator to update your subject assignments.
                  </p>
                )}
            </div>
          </div>
          <BigCalenderContainer
            type={role}
            calendarEvents={calendarEvents}
            classData={subjectData}
          />
          {/* Debug info */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Props passed to calendar: type={role}, id={userId}, events={calendarEvents.length}, classData={subjectData.length}</p>
          </div>
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

export default TeacherPage;
