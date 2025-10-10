import ClassSchedule from "@/components/ClassSchedule";
import prisma from "../../../../../prisma";
import { Day } from "@prisma/client";

// Helper function to convert Day enum to number
function getDayOfWeekNumber(day: Day): number {
  const dayMap = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  return dayMap[day];
}

export default async function Home() {
  // Fetch basic data for dropdowns with relationships
  const className = await prisma.class.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const teacherName = await prisma.teacher.findMany({
    select: {
      name: true,
      subjects: {
        select: {
          name: true,
        },
      },
    },
  });

  const subjectName = await prisma.subject.findMany({
    select: {
      name: true,
      teachers: {
        select: {
          name: true,
        },
      },
    },
  });

  // Fetch lessons for the calendar
  const lessons = await prisma.lesson.findMany({
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

  const order: Record<"Science" | "Arts" | "Commerce", number> = {
    Science: 1,
    Arts: 2,
    Commerce: 3,
  };

  const sortedClasses = className.sort((a, b) => {
    const gradeA = parseInt(a.name.match(/\d+/)?.[0] || "0");
    const gradeB = parseInt(b.name.match(/\d+/)?.[0] || "0");

    if (gradeA !== gradeB) return gradeA - gradeB; // Sort numerically by class number

    const typeA = (a.name.split(" ")[2] as keyof typeof order) || ""; // Extract category
    const typeB = (b.name.split(" ")[2] as keyof typeof order) || "";

    return (order[typeA] || 0) - (order[typeB] || 0); // Sort by order Science → Arts → Commerce
  });

  return (
    <main className="w-full p-2 ">
      <h1 className="mb-4 text-2xl font-bold">Class Schedule</h1>
      <ClassSchedule
        classesName={sortedClasses}
        teacherName={teacherName}
        subjectName={subjectName}
        initialEvents={calendarEvents}
      />
    </main>
  );
}
// "use client";
// import { Schedule } from "@/components/schedule/schedule";
//
// export default function SchedulePage() {
//   return (
//     <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
//       <h1 className="mb-4 text-center text-2xl font-bold sm:mb-8 sm:text-left sm:text-3xl">
//         School Timetable Management
//       </h1>
//       <Schedule />
//     </div>
//   );
// }
