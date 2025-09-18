// prisma/seed.ts
import {
  PrismaClient,
  Approve,
  UserSex,
  ParentType,
  StudentStream,
  ExamType,
  Day,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding started...");

  // ---------------------------------------
  // 1. Cleanup old data
  // ---------------------------------------
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.admin.deleteMany();

  // ---------------------------------------
  // 2. Seed Admins
  // ---------------------------------------
  const admins = await prisma.admin.createMany({
    data: Array.from({ length: 3 }).map((_, i) => ({
      name: faker.person.fullName(),
      username: `admin${i + 1}`,
      password: faker.internet.password(),
      email: `admin${i + 1}@school.com`,
      phone: faker.phone.number(),
      approved: Approve.ACCEPTED,
    })),
  });
  console.log(`✅ Admins seeded: ${admins.count}`);

  // ---------------------------------------
  // 3. Seed Parents
  // ---------------------------------------
  const parents = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.parent.create({
        data: {
          username: `parent${i + 1}`,
          password: faker.internet.password(),
          name: faker.person.fullName(),
          email: `parent${i + 1}@mail.com`,
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          type: faker.helpers.arrayElement([
            ParentType.FATHER,
            ParentType.MOTHER,
            ParentType.OTHER,
          ]),
          approved: Approve.ACCEPTED,
        },
      })
    )
  );
  console.log(`✅ Parents seeded: ${parents.length}`);

  // ---------------------------------------
  // 4. Seed Teachers
  // ---------------------------------------
  const teachers = await Promise.all(
    Array.from({ length: 30 }).map((_, i) =>
      prisma.teacher.create({
        data: {
          username: `teacher${i + 1}`,
          password: faker.internet.password(),
          name: faker.person.fullName(),
          email: `teacher${i + 1}@school.com`,
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          bloodType: faker.helpers.arrayElement(["A+", "B+", "O+", "AB-"]),
          sex: faker.helpers.arrayElement([UserSex.MALE, UserSex.FEMALE]),
          approved: Approve.ACCEPTED,
        },
      })
    )
  );
  console.log(`✅ Teachers seeded: ${teachers.length}`);

  // ---------------------------------------
  // 5. Seed Grades (7–12)
  // ---------------------------------------
  const grades = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.grade.create({
        data: { level: i + 7 },
      })
    )
  );
  console.log(`✅ Grades seeded: ${grades.length}`);

  // ---------------------------------------
  // 6. Seed Subjects
  // ---------------------------------------
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
    { id: "Chem", name: "Chemistry" },
    { id: "Bio", name: "Biology" },
    { id: "Acc", name: "Accounting" },
    { id: "BOM", name: "Business Organization and Management" },
    { id: "Eco", name: "Economics" },
    { id: "Hist", name: "History" },
    { id: "Civ", name: "Civics" },
    { id: "IHC", name: "Islamic History and Culture" },
  ];
  const subjects = await Promise.all(
    subjectData.map((s) =>
      prisma.subject.create({
        data: {
          subjectId: s.id,
          name: s.name,
          code: faker.string.alphanumeric(5),
          teachers: {
            connect: faker.helpers.arrayElements(
              teachers.map((t) => ({ id: t.id })),
              { min: 1, max: 3 }
            ),
          },
        },
      })
    )
  );
  console.log(`✅ Subjects seeded: ${subjects.length}`);

  // ---------------------------------------
  // 7. Seed Classes (with streams)
  // ---------------------------------------
  const classNames = [
    { key: "class7", label: "Class 7" },
    { key: "class8", label: "Class 8" },
    { key: "class9-sci", label: "Class 9 Science" },
    { key: "class9-art", label: "Class 9 Arts" },
    { key: "class9-com", label: "Class 9 Commerce" },
    { key: "class10-sci", label: "Class 10 Science" },
    { key: "class10-art", label: "Class 10 Arts" },
    { key: "class10-com", label: "Class 10 Commerce" },
    { key: "class11-sci", label: "Class 11 Science" },
    { key: "class11-art", label: "Class 11 Arts" },
    { key: "class11-com", label: "Class 11 Commerce" },
    { key: "class12-sci", label: "Class 12 Science" },
    { key: "class12-art", label: "Class 12 Arts" },
    { key: "class12-com", label: "Class 12 Commerce" },
  ];

  const classes = await Promise.all(
    classNames.map((cls) => {
      const gradeLevelMatch = cls.key.match(/class(\d+)/);
      const gradeLevel = gradeLevelMatch ? parseInt(gradeLevelMatch[1]) : 7;
      const grade = grades.find((g) => g.level === gradeLevel)!;

      return prisma.class.create({
        data: {
          name: cls.label,
          classId: cls.key,
          gradeId: grade.id,
          capacity: faker.number.int({ min: 30, max: 60 }),
          supervisorId: faker.helpers.arrayElement(teachers).id,
        },
      });
    })
  );
  console.log(`✅ Classes seeded: ${classes.length}`);

  // ---------------------------------------
  // 8. Seed Students (with group based on class)
  // ---------------------------------------
  const students = await Promise.all(
    Array.from({ length: 200 }).map((_, i) => {
      const clazz = faker.helpers.arrayElement(classes);

      let group: StudentStream | null = null;
      if (clazz.classId.includes("sci")) group = StudentStream.SCIENCE;
      else if (clazz.classId.includes("art")) group = StudentStream.ARTS;
      else if (clazz.classId.includes("com")) group = StudentStream.COMMERCE;

      return prisma.student.create({
        data: {
          username: `student${i + 1}`,
          password: faker.internet.password(),
          name: faker.person.fullName(),
          email: `student${i + 1}@mail.com`,
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          parentId: faker.helpers.arrayElement(parents).id,
          gradeId: clazz.gradeId,
          classId: clazz.id,
          group,
          sex: faker.helpers.arrayElement([UserSex.MALE, UserSex.FEMALE]),
          approved: Approve.ACCEPTED,
        },
      });
    })
  );
  console.log(`✅ Students seeded: ${students.length}`);

  // ---------------------------------------
  // 9. Seed Lessons
  // ---------------------------------------
  const lessons = await Promise.all(
    Array.from({ length: 50 }).map(() =>
      prisma.lesson.create({
        data: {
          name: faker.word.words(3),
          day: faker.helpers.arrayElement(Object.values(Day)),
          startTime: faker.date.future(),
          endTime: faker.date.future(),
          subjectId: faker.helpers.arrayElement(subjects).id,
          classId: faker.helpers.arrayElement(classes).id,
          teacherId: faker.helpers.arrayElement(teachers).id,
        },
      })
    )
  );
  console.log(`✅ Lessons seeded: ${lessons.length}`);

  // ---------------------------------------
  // 10. Seed Exams
  // ---------------------------------------
  const exams = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.exam.create({
        data: {
          title: faker.word.words(2),
          startTime: faker.date.future(),
          endTime: faker.date.future(),
          examType: faker.helpers.arrayElement(Object.values(ExamType)),
          lessonId: faker.helpers.arrayElement(lessons).id,
        },
      })
    )
  );
  console.log(`✅ Exams seeded: ${exams.length}`);

  // ---------------------------------------
  // 11. Seed Assignments
  // ---------------------------------------
  const assignments = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.assignment.create({
        data: {
          title: faker.word.words(3),
          startDate: faker.date.recent(),
          dueDate: faker.date.soon(),
          lessonId: faker.helpers.arrayElement(lessons).id,
        },
      })
    )
  );
  console.log(`✅ Assignments seeded: ${assignments.length}`);

  // ---------------------------------------
  // 12. Seed Results
  // ---------------------------------------
  const results = await Promise.all(
    Array.from({ length: 50 }).map(() => {
      const exam = faker.helpers.arrayElement(exams);
      const student = faker.helpers.arrayElement(students);
      return prisma.result.create({
        data: {
          score: faker.number.int({ min: 0, max: 100 }),
          maxScore: 100,
          examId: exam.id,
          studentId: student.id,
        },
      });
    })
  );
  console.log(`✅ Results seeded: ${results.length}`);

  // ---------------------------------------
  // 13. Seed Attendance
  // ---------------------------------------
  const attendance = await Promise.all(
    Array.from({ length: 100 }).map(() => {
      const lesson = faker.helpers.arrayElement(lessons);
      const student = faker.helpers.arrayElement(students);
      return prisma.attendance.create({
        data: {
          date: faker.date.recent(),
          present: faker.datatype.boolean(),
          studentId: student.id,
          lessonId: lesson.id,
        },
      });
    })
  );
  console.log(`✅ Attendance seeded: ${attendance.length}`);

  // ---------------------------------------
  // 14. Seed Events
  // ---------------------------------------
  const events = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.event.create({
        data: {
          title: faker.word.words(3),
          description: faker.lorem.sentence(),
          startTime: faker.date.future(),
          endTime: faker.date.future(),
          classId: faker.helpers.arrayElement(classes).id,
        },
      })
    )
  );
  console.log(`✅ Events seeded: ${events.length}`);

  // ---------------------------------------
  // 15. Seed Announcements
  // ---------------------------------------
  const announcements = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.announcement.create({
        data: {
          title: faker.word.words(3),
          description: faker.lorem.sentence(),
          date: faker.date.recent(),
          classId: faker.helpers.arrayElement(classes).id,
        },
      })
    )
  );
  console.log(`✅ Announcements seeded: ${announcements.length}`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
