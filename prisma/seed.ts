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
  const grades = [];
  for (let i = 1; i <= 6; i++) {
    const grade = await prisma.grade.create({
      data: { level: i },
    });
    grades.push(grade);
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
  const createdSubjects = [];
  for (let i = 0; i < subjects.length; i++) {
    const subject = await prisma.subject.create({
      data: {
        name: subjects[i],
        code: `SUB${i + 1}`,
      },
    });
    createdSubjects.push(subject);
  }

  // Class
  const classes = [];
  for (let i = 1; i <= 6; i++) {
    const cls = await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: grades[i - 1].id,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
    classes.push(cls);
  }

  // Parent
  const parents = [];
  for (let i = 1; i <= 25; i++) {
    const parent = await prisma.parent.create({
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
    parents.push(parent);
  }

  // Teacher
  const teachers = [];
  for (let i = 1; i <= 15; i++) {
    const teacher = await prisma.teacher.create({
      data: {
        username: `teacher${i}`,
        password: "password",
        name: `Teacher ${i}`,
        email: `teacher${i}@example.com`,
        phone: `123456789${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: createdSubjects[(i % 10)].id }] },
        classes: { connect: [{ id: classes[(i % 6)].id }] },
        birthday: new Date(1990, i, 1),
        img: `https://example.com/img/teacher${i}.jpg`,
      },
    });
    teachers.push(teacher);
  }

  // Student
  const students = [];
  for (let i = 1; i <= 50; i++) {
    const student = await prisma.student.create({
      data: {
        username: `student${i}`,
        password: "password",
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        phone: `123456789${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: parents[Math.ceil(i / 2) - 1].id,
        gradeId: grades[(i % 6)].id,
        classId: classes[(i % 6)].id,
        birthDate: new Date(2010, i % 12, 1),
        img: `https://example.com/img/student${i}.jpg`,
        address: `Address ${i}`,
        subjectId: createdSubjects[(i % 10)].id,
      },
    });
    students.push(student);
  }

  // Lesson
  const lessons = [];
  for (let i = 1; i <= 30; i++) {
    const lesson = await prisma.lesson.create({
      data: {
        name: `Lesson ${i}`,
        day: Day[Object.keys(Day)[i % 7] as keyof typeof Day],
        startTime: new Date(2025, 0, 10, 8, 0),
        endTime: new Date(2025, 0, 10, 10, 0),
        subjectId: createdSubjects[(i % 10)].id,
        classId: classes[(i % 6)].id,
        teacherId: teachers[(i % 15)].id,
      },
    });
    lessons.push(lesson);
  }

  // Exam
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(2025, 0, i, 9, 0),
        endTime: new Date(2025, 0, i, 11, 0),
        lessonId: lessons[(i % 30)].id,
      },
    });
  }

  // Attendance
  for (let i = 1; i <= 20; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(2025, 0, i),
        present: i % 2 === 0,
        studentId: students[(i % 50)].id, // Use the ObjectID of the created student
        lessonId: lessons[(i % 30)].id,
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
        classId: classes[(i % 6)].id,
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
        classId: classes[(i % 6)].id,
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
