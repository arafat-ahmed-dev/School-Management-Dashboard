import ClassSchedule from "@/components/ClassSchedule";
import prisma from "../../../../../prisma";

export default async function Home() {
  const className = await prisma.class.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  console.log(className);
  const order: Record<"Science" | "Arts" | "Commerce", number> = {
    Science: 1,
    Arts: 2,
    Commerce: 3,
  };

  const sortedClasses = className.sort((a, b) => {
    const gradeA = parseInt(a.name.match(/\d+/)?.[0] || "0"); // Extract class number
    const gradeB = parseInt(b.name.match(/\d+/)?.[0] || "0");

    if (gradeA !== gradeB) return gradeA - gradeB; // Sort numerically by class number

    const typeA = (a.name.split(" ")[2] as keyof typeof order) || ""; // Extract category
    const typeB = (b.name.split(" ")[2] as keyof typeof order) || "";

    return (order[typeA] || 0) - (order[typeB] || 0); // Sort by order Science → Arts → Commerce
  });

  console.log(sortedClasses);

  return (
    <main className="w-full p-2 ">
      <h1 className="mb-4 text-2xl font-bold">Class Schedule</h1>
      <ClassSchedule classesName={sortedClasses} />
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
