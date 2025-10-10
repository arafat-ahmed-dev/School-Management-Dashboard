import { PrismaClient, Day } from "@prisma/client";

const prisma = new PrismaClient();

function parseTimeToDate(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(2025, 0, 1);
  d.setHours(hours, minutes, 0, 0);
  d.setSeconds(0, 0);
  return d;
}

const timeSlots: Array<[string, string]> = [
  ["09:00", "09:50"],
  ["10:00", "10:50"],
  ["11:00", "11:50"],
  ["12:00", "12:50"],
  ["13:00", "13:50"],
  ["14:00", "14:50"],
  ["15:00", "15:50"],
];

const weekdays: Day[] = [
  Day.MONDAY,
  Day.TUESDAY,
  Day.WEDNESDAY,
  Day.THURSDAY,
  Day.FRIDAY,
];

async function run() {
  try {
    console.log("Starting calendar seed (idempotent)...");

    const classes = await prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    const subjects = await prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    const teachers = await prisma.teacher.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    if (!classes.length || !subjects.length || !teachers.length) {
      console.error(
        "Missing classes, subjects, or teachers in the database. Seed aborted."
      );
      return;
    }

    // Remove dependent records referencing existing lessons, then remove lessons
    const existingLessons = await prisma.lesson.findMany({
      select: { id: true },
    });
    const lessonIds = existingLessons.map((l) => l.id);

    if (lessonIds.length) {
      // find related assignment and exam ids
      const existingAssignments = await prisma.assignment.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true },
      });
      const assignmentIds = existingAssignments.map((a) => a.id);

      const existingExams = await prisma.exam.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true },
      });
      const examIds = existingExams.map((e) => e.id);

      // delete results linked to those assignments/exams
      if (assignmentIds.length || examIds.length) {
        await prisma.result.deleteMany({
          where: {
            OR: [
              ...(assignmentIds.length
                ? [{ assignmentId: { in: assignmentIds } }]
                : []),
              ...(examIds.length ? [{ examId: { in: examIds } }] : []),
            ],
          },
        });
      }

      // delete assignments, exams, attendances that reference the lessons
      if (assignmentIds.length)
        await prisma.assignment.deleteMany({
          where: { id: { in: assignmentIds } },
        });
      if (examIds.length)
        await prisma.exam.deleteMany({ where: { id: { in: examIds } } });
      await prisma.attendance.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });

      // finally delete the lessons
      await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
    }

    const createdLessons: Array<any> = [];

    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      const cls = classes[classIndex];
      const subjStart = classIndex % subjects.length;

      for (let dayIndex = 0; dayIndex < weekdays.length; dayIndex++) {
        const day = weekdays[dayIndex];

        for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
          const subject =
            subjects[(subjStart + slotIndex + dayIndex) % subjects.length];
          const teacher =
            teachers[(classIndex + slotIndex + dayIndex) % teachers.length];

          const [startStr, endStr] = timeSlots[slotIndex];
          const startTime = parseTimeToDate(startStr);
          const endTime = parseTimeToDate(endStr);

          const lessonName = `${subject.name} - ${cls.name} - D${dayIndex + 1}-S${slotIndex + 1}`;

          createdLessons.push({
            name: lessonName,
            day,
            startTime,
            endTime,
            classId: cls.id,
            teacherId: teacher.id,
            subjectId: subject.id,
          });
        }
      }
    }

    // Insert in batches for performance
    const BATCH = 200;
    for (let i = 0; i < createdLessons.length; i += BATCH) {
      const chunk = createdLessons.slice(i, i + BATCH);
      await prisma.$transaction(
        chunk.map((c) => prisma.lesson.create({ data: c }))
      );
      console.log(
        `Inserted lessons ${i + 1}..${Math.min(i + BATCH, createdLessons.length)}`
      );
    }

    // create one simple event per class
    const today = new Date();
    const eventsToCreate: Array<any> = [];
    for (let i = 0; i < classes.length; i++) {
      const cls = classes[i];
      const evStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7 + i,
        9,
        0,
        0
      );
      const evEnd = new Date(evStart);
      evEnd.setHours(evStart.getHours() + 3);

      eventsToCreate.push({
        title: `Class Activity - ${cls.name}`,
        description: `Auto-created activity for ${cls.name}`,
        startTime: evStart,
        endTime: evEnd,
        classId: cls.id,
      });
    }

    for (const ev of eventsToCreate) {
      await prisma.event.create({ data: ev });
    }

    console.log(
      `Seed finished. Created ${createdLessons.length} lessons and ${eventsToCreate.length} events.`
    );
  } catch (err) {
    console.error("Error during calendar seed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export default run;
