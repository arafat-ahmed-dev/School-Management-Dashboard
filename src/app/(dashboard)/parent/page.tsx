import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import prisma from "../../../../prisma";
import EventCalenderContainer from "@/components/EventCalenderContainer";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

const ParentPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get current user session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const role = session?.user?.role || "parent";

  // Check if user is authenticated
  if (!session || !userId) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-red-500">
              <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
              <p>Please log in to view your parent dashboard.</p>
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

  // Check if user has parent role
  if (session.user?.role !== "Parent" && session.user?.role !== "parent") {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-amber-600">
              <h2 className="mb-2 text-lg font-semibold">Access Denied</h2>
              <p className="mb-2">This page is only accessible to parents.</p>
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

  // Fetch parent's children with their class information
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
    include: {
      students: {
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
      },
    },
  });

  // If parent is not found, try to find by username or email
  let parentByAlternative = null;
  if (!parent && session?.user?.email) {
    parentByAlternative = await prisma.parent.findFirst({
      where: {
        OR: [
          { email: session.user.email },
          { username: session.user.email }, // In case email is stored as username
        ],
      },
      include: {
        students: {
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
        },
      },
    });
  }

  const currentParent = parent || parentByAlternative;

  // If parent is not found, return informative message
  if (!currentParent) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-amber-600">
              <h2 className="mb-2 text-lg font-semibold">Parent Profile Not Found</h2>
              <p className="mb-2">We couldn&apos;t find your parent profile in our system.</p>
              <div className="text-sm text-gray-600">
                <p className="mb-2">This might happen if:</p>
                <ul className="mx-auto mt-2 max-w-md list-inside list-disc text-left">
                  <li>Your account is pending approval</li>
                  <li>Your parent profile hasn&apos;t been created yet</li>
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

  const children = currentParent.students || [];

  // If no children are assigned
  if (children.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full rounded-md bg-white p-2 md:p-4">
            <div className="text-center text-blue-600">
              <h2 className="mb-2 text-lg font-semibold">Welcome, Parent!</h2>
              <p className="mb-2">Your parent account is active, but you don&apos;t have any children assigned yet.</p>
              <div className="text-sm text-gray-600">
                <p>Please contact your administrator to have your children assigned to your account.</p>
                <p>Once assigned, you&apos;ll be able to view their schedules, assignments, and more.</p>
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

  // Create an array to store each child's data with their calendar events
  const childrenWithSchedules = await Promise.all(
    children.map(async (child) => {
      if (!child.class) {
        return {
          student: child,
          calendarEvents: [],
          classData: [],
        };
      }

      // Fetch class data for this specific child
      const classData = await prisma.class.findMany({
        where: {
          id: child.class.id,
        },
        select: {
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      // Fetch lessons for this child's class
      const lessons = await prisma.lesson.findMany({
        where: {
          classId: child.class.id,
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

      // Transform lessons to CalendarEvent format for this child
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

      return {
        student: child,
        calendarEvents,
        classData,
      };
    })
  );
  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-2 md:p-4">
          {childrenWithSchedules.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-500">
              <div className="text-center">
                <h2 className="mb-2 text-lg font-semibold">No Children Found</h2>
                <p>You don&apos;t have any children assigned to your account.</p>
              </div>
            </div>
          ) : (
            childrenWithSchedules.map((childData, index) => (
              <div key={childData.student.id}>
                {index > 0 && <div className="mt-4 border-t border-gray-200 pt-6" />}
                <div>
                  <h1 className="mb-4 text-xl font-semibold">
                    {childData.student.name}&apos;s Schedule
                    {childData.student.class && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({childData.student.class.name})
                      </span>
                    )}
                  </h1>
                  {!childData.student.class ? (
                    <div className="flex h-32 items-center justify-center text-gray-500">
                      <div className="text-center">
                        <p className="mb-2">{childData.student.name} hasn&apos;t been assigned to a class yet.</p>
                        <p className="text-sm">Contact administrator for class assignment.</p>
                      </div>
                    </div>
                  ) : (
                    <BigCalenderContainer
                      type={role}
                      id={childData.student.id}
                      studentCalendarEvents={childData.calendarEvents}
                      studentClassData={childData.classData}
                    />
                  )}
                </div>
              </div>
            ))
          )}
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

export default ParentPage;
