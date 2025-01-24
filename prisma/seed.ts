import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create 10 Admins
    const admins = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        prisma.admin.create({
          data: {
            name: `Admin ${i + 1}`,
            username: `admin${i + 1}`,
            password: `password${i + 1}`,
            email: `admin${i + 1}@example.com`,
            phone: `12345678${i + 1}`,
            refreshToken: `token${i + 1}`,
            approved: i % 2 === 0 ? "ACCEPTED" : "PENDING",
          },
        })
      )
    );

    // Create 10 Grades
    const grades = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        prisma.grade.create({
          data: {
            level: i + 1,
          },
        })
      )
    );

    // Create 10 Classes
    const classes = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        prisma.class.create({
          data: {
            name: `Class ${i + 1}`,
            gradeId: grades[i % grades.length].id,
            capacity: 30,
          },
        })
      )
    );

    // Create 15 Subjects
   const subjectData = [
     { name: "Mathematics" },
     { name: "Science" },
     { name: "English" },
     { name: "History" },
     { name: "Geography" },
     { name: "Physics" },
     { name: "Chemistry" },
     { name: "Biology" },
     { name: "Computer Science" },
     { name: "Art" },
   ];

   const subjects = await Promise.all(
     subjectData.map((subject, index) =>
       prisma.subject.create({
         data: {
           name: subject.name,
           code: `SUB${index + 1}`,
         },
       })
     )
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
        })
      )
    );

    // Assign Teachers to Classes
    await Promise.all(
      classes.map((cls, index) =>
        prisma.class.update({
          where: { id: cls.id },
          data: {
            supervisorId: teachers[index % teachers.length].id,
          },
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
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
        })
      )
    );

    // Create Attendance records for each student and lesson
    await Promise.all(
      students.flatMap((student) =>
        lessons.map((lesson) =>
          prisma.attendance.create({
            data: {
              date: new Date(),
              present: Math.random() > 0.5,
              studentId: student.id,
              lessonId: lesson.id,
            },
          })
        )
      )
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
