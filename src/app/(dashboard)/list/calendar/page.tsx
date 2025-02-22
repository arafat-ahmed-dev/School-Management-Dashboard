import ClassSchedule from "@/components/ClassSchedule";
import prisma from "../../../../../prisma";

export default async function Home() {
  const teacherName = await prisma.teacher.findMany({
    select: {
      name: true,
    },
  });
  const className = await prisma.class.findMany({
    select: {
      name: true,
    },
    orderBy:{
      name: 'desc'
    }
  });
  console.log(className)
  return (
    <main className="w-full p-4 ">
      <h1 className="text-2xl font-bold mb-4">Class Schedule</h1>
      <ClassSchedule teacherName={teacherName} className={className} />
    </main>
  );
}
