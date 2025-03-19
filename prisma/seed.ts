import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create 10 Admins
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        prisma.admin.create({
          data: {
            name: `Admin ${i + 1}`, // Ensure this line is included
            username: `admin${i + 1}`,
            password: `password${i + 1}`,
            email: `admin${i + 1}@example.com`,
            phone: `12345678${i + 1}`,
            refreshToken: `token${i + 1}`,
            approved: i % 2 === 0 ? "ACCEPTED" : "PENDING",
          },
        }),
      ),
    );

    // Create Grades
    const grades = await Promise.all(
      Array.from({ length: 6 }, (_, i) =>
        prisma.grade.create({
          data: {
            level: i + 7,
          },
        }),
      ),
    );

    // Create Classes
    const classNames = [
      "class7",
      "class8",
      "class9-sci",
      "class9-art",
      "class9-com",
      "class10-sci",
      "class10-art",
      "class10-com",
      "class11-sci",
      "class11-art",
      "class11-com",
      "class12-sci",
      "class12-art",
      "class12-com",
    ];

    const classes = await Promise.all(
      classNames.map((name, i) =>
        prisma.class.create({
          data: {
            name,
            gradeId: grades[Math.floor(i / 3)].id,
            capacity: 30,
          },
        }),
      ),
    );

    // Create 15 Subjects
    const subjectData = [
      { id: "Ban-1", name: "Bangla-1" },
      { id: "Ban-2", name: "Bangla-2" },
      { id: "Eng-1", name: "English-1" },
      { id: "Eng-2", name: "English-2" },
      { id: "Math", name: "Mathematics" },
      { id: "GenSci", name: "General Science" },
      { id: "BGS", name: "Bangladesh and Global Studies" },
      { id: "ICT", name: "Information and Communication Technology" },
      { id: "Rel", name: "Religion" },
      { id: "Phy", name: "Physics" },
      { id: "Bio", name: "Biology" },
      { id: "HM", name: "Home Management" },
      { id: "Acc", name: "Accounting" },
      { id: "BOM", name: "Business Organization and Management" },
      { id: "Eco", name: "Economics" },
      { id: "Stat", name: "Statistics" },
      { id: "Hist", name: "History" },
      { id: "Civ", name: "Civics and Good Citizenship" },
      { id: "IHC", name: "Islamic History and Culture" },
      { id: "Phy-1", name: "Physics-1" },
      { id: "Chem-1", name: "Chemistry-1" },
      { id: "Bio-1", name: "Biology-1" },
      { id: "HM-1", name: "Home Management-1" },
      { id: "Acc-1", name: "Accounting-1" },
      { id: "BOM-1", name: "Business Organization and Management-1" },
      { id: "Eco-1", name: "Economics-1" },
      { id: "Hist-1", name: "History-1" },
      { id: "Civ-1", name: "Civics-1" },
      { id: "IHC-1", name: "Islamic History and Culture-1" },
      { id: "Phy-2", name: "Physics-2" },
      { id: "Chem-2", name: "Chemistry-2" },
      { id: "Bio-2", name: "Biology-2" },
      { id: "HM-2", name: "Home Management-2" },
      { id: "Acc-2", name: "Accounting-2" },
      { id: "BOM-2", name: "Business Organization and Management-2" },
      { id: "Eco-2", name: "Economics-2" },
      { id: "Hist-2", name: "History-2" },
      { id: "Civ-2", name: "Civics-2" },
      { id: "IHC-2", name: "Islamic History and Culture-2" },
    ];

    const subjects = await Promise.all(
      subjectData.map((subject, index) =>
        prisma.subject.create({
          data: {
            name: subject.name,
            code: `SUB${index + 1}`,
            subjectId: subject.id,
          },
        }),
      ),
    );

    // Create 20 Teachers
    const teachers = await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        prisma.teacher.create({
          data: {
            username: `teacher${i + 1}`,
            password: `password${i + 1}`,
            name: `Teacher ${i + 1}`,
            email: `teacher${i + 1}@example.com`,
            phone: `98765432${i + 1}`,
            address: `Address ${i + 1}`,
            img: `https://placekitten.com/200/200?image=${i}`,
            bloodType: i % 3 === 0 ? "O+" : "A+",
            birthday: new Date(1985 + i, i % 12, i + 1),
            refreshToken: `refreshToken${i}`,
            sex: i % 2 === 0 ? "MALE" : "FEMALE",
            subjects: {
              connect: subjects
                .slice(i % subjects.length, (i % subjects.length) + 3)
                .map((subject) => ({ id: subject.id })),
            },
          },
        }),
      ),
    );

    // Assign Teachers to Classes
    await Promise.all(
      classes.map((cls, index) =>
        prisma.class.update({
          where: { id: cls.id },
          data: {
            supervisorId: teachers[index % teachers.length].id,
          },
        }),
      ),
    );

    // Create 20 Parents
    const parents = await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        prisma.parent.create({
          data: {
            username: `parent${i + 1}`,
            password: `password${i + 1}`,
            name: `Parent ${i + 1}`,
            email: `parent${i + 1}@example.com`,
            phone: `11223344${i + 1}`,
            address: `Parent Address ${i + 1}`,
            img: `https://placekitten.com/200/200?image=${i + 10}`,
            type: i % 3 === 0 ? "FATHER" : i % 3 === 1 ? "MOTHER" : "OTHER",
            refreshToken: `parentToken${i}`,
          },
        }),
      ),
    );

    // Create 30 Students
    const students = await Promise.all(
      Array.from({ length: 30 }, (_, i) =>
        prisma.student.create({
          data: {
            username: `student${i + 1}`,
            password: `password${i + 1}`,
            name: `Student ${i + 1}`,
            email: `student${i + 1}@example.com`,
            phone: `55566677${i + 1}`,
            address: `Student Address ${i + 1}`,
            bloodType: i % 2 === 0 ? "B+" : "AB+",
            birthDate: new Date(2005 + (i % 5), i % 12, i + 1),
            img: `https://placekitten.com/200/200?image=${i + 20}`,
            sex: i % 2 === 0 ? "MALE" : "FEMALE",
            refreshToken: `studentToken${i}`,
            parentId: parents[i % parents.length].id,
            gradeId: grades[i % grades.length].id,
            classId: classes[i % classes.length].id,
          },
        }),
      ),
    );
    // Create Lessons for each Class and Subject
    const lessons = await Promise.all(
      Array.from({ length: 35 }, (_, i) =>
        prisma.lesson.create({
          data: {
            name: `Lesson ${i + 1}`,
            day: "MONDAY",
            startTime: new Date(),
            endTime: new Date(),
            subjectId: subjects[i % subjects.length].id,
            classId: classes[i % classes.length].id,
            teacherId: teachers[i % teachers.length].id,
          },
        }),
      ),
    );

    // Create Exams for Lessons
    const exams = await Promise.all(
      lessons.map((lesson, i) =>
        prisma.exam.create({
          data: {
            title: `Exam ${i + 1}`,
            startTime: new Date(),
            endTime: new Date(),
            lessonId: lesson.id,
          },
        }),
      ),
    );

    // Create Assignments for Lessons
    const assignments = await Promise.all(
      lessons.map((lesson, i) =>
        prisma.assignment.create({
          data: {
            title: `Assignment ${i + 1}`,
            startDate: new Date(),
            dueDate: new Date(),
            lessonId: lesson.id,
          },
        }),
      ),
    );

    // Create Results for Exams
    await Promise.all(
      exams.map((exam, i) =>
        prisma.result.create({
          data: {
            score: Math.floor(Math.random() * 100),
            examId: exam.id,
            studentId: students[i % students.length].id,
          },
        }),
      ),
    );

    // Create Results for Assignments
    await Promise.all(
      assignments.map((assignment, i) =>
        prisma.result.create({
          data: {
            score: Math.floor(Math.random() * 100),
            assignmentId: assignment.id,
            studentId: students[i % students.length].id,
          },
        }),
      ),
    );

    // Create Events for Classes
    await Promise.all(
      classes.map((cls, i) =>
        prisma.event.create({
          data: {
            title: `Event ${i + 1}`,
            description: `Event Description ${i + 1}`,
            startTime: new Date(),
            endTime: new Date(),
            classId: cls.id,
          },
        }),
      ),
    );

    // Create Announcements for Classes
    await Promise.all(
      classes.map((cls, i) =>
        prisma.announcement.create({
          data: {
            title: `Announcement ${i + 1}`,
            description: `Announcement Description ${i + 1}`,
            date: new Date(),
            classId: cls.id,
          },
        }),
      ),
    );

    // Create Attendance records for each student and lesson
    // Helper function to generate a random date between two given dates
    // @ts-ignore
    function getRandomDate(start: Date, end: Date): Date {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
      );
    }

    // Define the date range for generating random dates
    const startDate = new Date("2025-03-01");
    const endDate = new Date("2025-04-31");

    // Specify how many attendance records you want per student-lesson combination
    const recordsPerCombination = 10;

    // Create Attendance records for each student and lesson
    await Promise.all(
      students.flatMap((student) =>
        lessons
          .filter((lesson) => lesson.classId === student.classId) // Only lessons of the student's class
          .flatMap((lesson) =>
            Array.from({ length: recordsPerCombination }, () =>
              prisma.attendance.create({
                data: {
                  date: getRandomDate(startDate, endDate),
                  present: Math.random() > 0.2, // 80% chance of being present
                  studentId: student.id,
                  lessonId: lesson.id,
                },
              }),
            ),
          ),
      ),
    );

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
