import { PrismaClient, Day, UserSex, ParentType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Admin
  await prisma.admin.createMany({
    data: [
      { username: "admin1", password: "password1" },
      { username: "admin2", password: "password2" },
    ],
  });

  // Grade
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: { level: i },
    });
  }

  // Class
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: `grade${i}`,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // Subject
  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
  ];
  for (let i = 0; i < subjects.length; i++) {
    await prisma.subject.create({
      data: {
        name: subjects[i],
        code: `SUB${i + 1}`,
      },
    });
  }

  // Teacher
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        username: `teacher${i}`,
        password: "password",
        name: `Teacher ${i}`,
        email: `teacher${i}@example.com`,
        phone: `123456789${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: `subject${(i % 10) + 1}` }] },
        classes: { connect: [{ id: `class${(i % 6) + 1}` }] },
        birthday: new Date(1990, i, 1),
        img: `https://example.com/img/teacher${i}.jpg`,
      },
    });
  }

  // Parent
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        username: `parent${i}`,
        password: "password",
        name: `Parent ${i}`,
        email: `parent${i}@example.com`,
        phone: `987654321${i}`,
        address: `Address ${i}`,
        type: i % 2 === 0 ? ParentType.FATHER : ParentType.MOTHER,
      },
    });
  }

  // Student
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        username: `student${i}`,
        password: "password",
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        phone: `123456789${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parent${Math.ceil(i / 2)}`,
        gradeId: `grade${(i % 6) + 1}`,
        classId: `class${(i % 6) + 1}`,
        birthDate: new Date(2010, i % 12, 1),
        img: `https://example.com/img/student${i}.jpg`,
        address: `Address ${i}`,
        subjectId: `subject${(i % 10) + 1}`,
      },
    });
  }

  // Lesson
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson ${i}`,
        day: Day[Object.keys(Day)[i % 7] as keyof typeof Day],
        startTime: new Date(2025, 0, 10, 8, 0),
        endTime: new Date(2025, 0, 10, 10, 0),
        subjectId: `subject${(i % 10) + 1}`,
        classId: `class${(i % 6) + 1}`,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
  }

  // Exam
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(2025, 0, i, 9, 0),
        endTime: new Date(2025, 0, i, 11, 0),
        lessonId: `lesson${(i % 30) + 1}`,
      },
    });
  }

  // Attendance
  for (let i = 1; i <= 20; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(2025, 0, i),
        present: i % 2 === 0,
        studentId: `student${(i % 50) + 1}`,
        lessonId: `lesson${(i % 30) + 1}`,
      },
    });
  }

  // Event
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: `class${(i % 6) + 1}`,
      },
    });
  }

  // Announcement
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: `class${(i % 6) + 1}`,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
