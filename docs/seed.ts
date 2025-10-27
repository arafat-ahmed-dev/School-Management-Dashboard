// prisma/combined-seed.ts
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

async function main() {
  console.log("🚀 Combined seeding started...");

  // ---------------------------------------
  // 1. Cleanup old data (in correct order)
  // ---------------------------------------
  console.log("🧹 Cleaning up existing data...");
  await prisma.result.deleteMany();
  await prisma.attendance.deleteMany();
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

  // Create subjects with specialized teacher assignments
  const subjects = await Promise.all(
    subjectData.map((s, index) => {
      // Assign teachers more logically - each teacher specializes in 2-3 subjects
      const teachersPerSubject = Math.ceil(
        (teachers.length / subjectData.length) * 1.5
      );
      const startIndex = (index * 2) % teachers.length;
      const assignedTeachers = [];

      for (let i = 0; i < Math.min(teachersPerSubject, 3); i++) {
        const teacherIndex = (startIndex + i) % teachers.length;
        assignedTeachers.push({ id: teachers[teacherIndex].id });
      }

      return prisma.subject.create({
        data: {
          subjectId: s.id,
          name: s.name,
          code: faker.string.alphanumeric(5),
          teachers: {
            connect: assignedTeachers,
          },
        },
      });
    })
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

      // Assign subjects based on class level and stream
      let classSubjects: string[] = [];

      if (gradeLevel <= 8) {
        // Classes 7-8: Basic subjects
        classSubjects = [
          "Ban-1",
          "Ban-2",
          "Eng-1",
          "Eng-2",
          "Math",
          "GenSci",
          "BGS",
          "ICT",
          "Rel",
        ];
      } else if (gradeLevel <= 10) {
        // Classes 9-10: Stream-based subjects
        if (cls.key.includes("sci")) {
          classSubjects = [
            "Ban-1",
            "Eng-1",
            "Math",
            "Phy",
            "Chem",
            "Bio",
            "ICT",
            "Rel",
          ];
        } else if (cls.key.includes("com")) {
          classSubjects = [
            "Ban-1",
            "Eng-1",
            "Math",
            "Acc",
            "BOM",
            "Eco",
            "ICT",
            "Rel",
          ];
        } else if (cls.key.includes("art")) {
          classSubjects = [
            "Ban-1",
            "Eng-1",
            "Math",
            "Hist",
            "Civ",
            "IHC",
            "ICT",
            "Rel",
          ];
        }
      } else {
        // Classes 11-12: Advanced stream subjects
        if (cls.key.includes("sci")) {
          classSubjects = [
            "Ban-2",
            "Eng-2",
            "Math",
            "Phy",
            "Chem",
            "Bio",
            "ICT",
          ];
        } else if (cls.key.includes("com")) {
          classSubjects = [
            "Ban-2",
            "Eng-2",
            "Math",
            "Acc",
            "BOM",
            "Eco",
            "ICT",
          ];
        } else if (cls.key.includes("art")) {
          classSubjects = [
            "Ban-2",
            "Eng-2",
            "Math",
            "Hist",
            "Civ",
            "IHC",
            "ICT",
          ];
        }
      }

      // Find subject objects by subjectId
      const subjectsToConnect = subjects.filter((s) =>
        classSubjects.includes(s.subjectId)
      );

      return prisma.class.create({
        data: {
          name: cls.label,
          classId: cls.key,
          gradeId: grade.id,
          capacity: faker.number.int({ min: 30, max: 60 }),
          supervisorId: faker.helpers.arrayElement(teachers).id,
          subjects: {
            connect: subjectsToConnect.map((s) => ({ id: s.id })),
          },
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
  // 9. Seed Lessons (Enhanced Calendar Logic)
  // ---------------------------------------
  console.log("📅 Creating comprehensive lesson schedule...");

  const createdLessons: Array<any> = [];

  for (let classIndex = 0; classIndex < classes.length; classIndex++) {
    const cls = classes[classIndex];

    // Get subjects for this class
    const classWithSubjects = await prisma.class.findUnique({
      where: { id: cls.id },
      include: { subjects: true },
    });

    const classSubjects = classWithSubjects?.subjects || subjects.slice(0, 6);
    const subjStart = classIndex % classSubjects.length;

    for (let dayIndex = 0; dayIndex < weekdays.length; dayIndex++) {
      const day = weekdays[dayIndex];

      for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
        const subject =
          classSubjects[
            (subjStart + slotIndex + dayIndex) % classSubjects.length
          ];

        // Get teachers who actually teach this subject
        const subjectWithTeachers = await prisma.subject.findUnique({
          where: { id: subject.id },
          include: { teachers: true },
        });

        const qualifiedTeachers = subjectWithTeachers?.teachers || [];

        // If no qualified teachers, skip this lesson or assign a random one as fallback
        if (qualifiedTeachers.length === 0) {
          console.warn(
            `No qualified teachers found for subject: ${subject.name}`
          );
          continue; // Skip this lesson
        }

        // Select a random qualified teacher for this subject
        const teacher = faker.helpers.arrayElement(qualifiedTeachers);

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

  // Insert lessons in batches for performance
  const BATCH_SIZE = 100;
  for (let i = 0; i < createdLessons.length; i += BATCH_SIZE) {
    const chunk = createdLessons.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(
      chunk.map((lessonData) => prisma.lesson.create({ data: lessonData }))
    );
    console.log(
      `📚 Inserted lessons ${i + 1}..${Math.min(i + BATCH_SIZE, createdLessons.length)}`
    );
  }

  // Get all created lessons for further seeding
  const lessons = await prisma.lesson.findMany();
  console.log(`✅ Lessons seeded: ${lessons.length}`);

  // ---------------------------------------
  // 10. Seed Exams (Improved: More structured exam distribution)
  // ---------------------------------------
  const examRecords: Array<any> = [];

  // Create exams for each class's subjects
  for (const cls of classes) {
    const classWithSubjects = await prisma.class.findUnique({
      where: { id: cls.id },
      include: { subjects: true },
    });

    const classSubjects = classWithSubjects?.subjects || [];
    const classLessons = lessons.filter((lesson) => lesson.classId === cls.id);

    // Create different types of exams for each subject
    for (const subject of classSubjects) {
      const subjectLessons = classLessons.filter(
        (lesson) => lesson.subjectId === subject.id
      );

      if (subjectLessons.length > 0) {
        // Monthly exam
        const monthlyLesson = faker.helpers.arrayElement(subjectLessons);
        const monthlyStart = faker.date.soon({ days: 30 });
        const monthlyEnd = new Date(monthlyStart);
        monthlyEnd.setHours(monthlyStart.getHours() + 2);

        examRecords.push({
          title: `${subject.name} Monthly Test - ${cls.name}`,
          startTime: monthlyStart,
          endTime: monthlyEnd,
          examType: ExamType.MONTHLY,
          lessonId: monthlyLesson.id,
        });

        // Midterm exam (50% chance)
        if (faker.datatype.boolean(0.5)) {
          const midtermLesson = faker.helpers.arrayElement(subjectLessons);
          const midtermStart = faker.date.soon({ days: 60 });
          const midtermEnd = new Date(midtermStart);
          midtermEnd.setHours(midtermStart.getHours() + 3);

          examRecords.push({
            title: `${subject.name} Midterm Exam - ${cls.name}`,
            startTime: midtermStart,
            endTime: midtermEnd,
            examType: ExamType.MIDTERM,
            lessonId: midtermLesson.id,
          });
        }

        // Final exam (80% chance for higher classes)
        if (faker.datatype.boolean(cls.name.includes("Class 1") ? 0.8 : 0.6)) {
          const finalLesson = faker.helpers.arrayElement(subjectLessons);
          const finalStart = faker.date.soon({ days: 90 });
          const finalEnd = new Date(finalStart);
          finalEnd.setHours(finalStart.getHours() + 3);

          examRecords.push({
            title: `${subject.name} Final Exam - ${cls.name}`,
            startTime: finalStart,
            endTime: finalEnd,
            examType: ExamType.FINAL,
            lessonId: finalLesson.id,
          });
        }
      }
    }
  }

  const exams = await Promise.all(
    examRecords.map((record) => prisma.exam.create({ data: record }))
  );
  console.log(`✅ Exams seeded: ${exams.length}`);

  // ---------------------------------------
  // 11. Seed Assignments (Improved: Subject-specific assignments)
  // ---------------------------------------
  const assignmentRecords: Array<any> = [];

  // Create assignments for each subject in each class
  for (const cls of classes) {
    const classWithSubjects = await prisma.class.findUnique({
      where: { id: cls.id },
      include: { subjects: true },
    });

    const classSubjects = classWithSubjects?.subjects || [];
    const classLessons = lessons.filter((lesson) => lesson.classId === cls.id);

    for (const subject of classSubjects) {
      const subjectLessons = classLessons.filter(
        (lesson) => lesson.subjectId === subject.id
      );

      if (subjectLessons.length > 0) {
        // Create 1-3 assignments per subject per class
        const numAssignments = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < numAssignments; i++) {
          const lesson = faker.helpers.arrayElement(subjectLessons);
          const startDate = faker.date.recent({ days: 7 });
          const dueDate = faker.date.soon({ days: 14 });

          assignmentRecords.push({
            title: `${subject.name} Assignment ${i + 1} - ${cls.name}`,
            startDate,
            dueDate,
            lessonId: lesson.id,
          });
        }
      }
    }
  }

  const assignments = await Promise.all(
    assignmentRecords.map((record) =>
      prisma.assignment.create({ data: record })
    )
  );
  console.log(`✅ Assignments seeded: ${assignments.length}`);

  // ---------------------------------------
  // 12. Seed Results (Fixed: Students only get results for their class lessons)
  // ---------------------------------------
  const resultRecords: Array<any> = [];

  for (const student of students) {
    if (!student.classId) continue; // Skip students without a class

    // Get all lessons for this student's class
    const studentClassLessons = lessons.filter(
      (lesson) => lesson.classId === student.classId
    );

    // Get exams and assignments for these lessons
    const studentExams = exams.filter((exam) =>
      studentClassLessons.some((lesson) => lesson.id === exam.lessonId)
    );
    const studentAssignments = assignments.filter((assignment) =>
      studentClassLessons.some((lesson) => lesson.id === assignment.lessonId)
    );

    // Create some results for exams
    const examResults = faker.helpers.arrayElements(studentExams, {
      min: 0,
      max: Math.min(3, studentExams.length),
    });

    for (const exam of examResults) {
      resultRecords.push({
        score: faker.number.int({ min: 40, max: 100 }),
        maxScore: 100,
        examId: exam.id,
        assignmentId: null,
        studentId: student.id,
      });
    }

    // Create some results for assignments
    const assignmentResults = faker.helpers.arrayElements(studentAssignments, {
      min: 0,
      max: Math.min(2, studentAssignments.length),
    });

    for (const assignment of assignmentResults) {
      resultRecords.push({
        score: faker.number.int({ min: 40, max: 100 }),
        maxScore: 100,
        examId: null,
        assignmentId: assignment.id,
        studentId: student.id,
      });
    }
  }

  const results = await Promise.all(
    resultRecords.map((record) => prisma.result.create({ data: record }))
  );
  console.log(`✅ Results seeded: ${results.length}`);

  // ---------------------------------------
  // 13. Seed Attendance (Fixed: Students only attend lessons in their class)
  // ---------------------------------------
  const attendanceRecords: Array<any> = [];

  for (const student of students) {
    if (!student.classId) continue; // Skip students without a class

    // Get all lessons for this student's class
    const studentClassLessons = lessons.filter(
      (lesson) => lesson.classId === student.classId
    );

    // Create attendance records for some lessons (not all to make it realistic)
    const lessonsToAttend = faker.helpers.arrayElements(studentClassLessons, {
      min: Math.floor(studentClassLessons.length * 0.3),
      max: Math.floor(studentClassLessons.length * 0.8),
    });

    for (const lesson of lessonsToAttend) {
      attendanceRecords.push({
        date: faker.date.recent({ days: 30 }),
        present: faker.datatype.boolean(0.85), // 85% attendance rate
        studentId: student.id,
        lessonId: lesson.id,
      });
    }
  }

  const attendance = await Promise.all(
    attendanceRecords.map((record) =>
      prisma.attendance.create({ data: record })
    )
  );
  console.log(`✅ Attendance seeded: ${attendance.length}`);

  // ---------------------------------------
  // 14. Seed Events (Enhanced with calendar logic)
  // ---------------------------------------
  const today = new Date();
  const eventsToCreate: Array<any> = [];

  // Create one event per class
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

  // Create additional targeted events for different class levels
  const additionalEvents = Array.from({ length: 10 }).map((_, i) => {
    const eventStart = faker.date.soon({ days: 30 });
    const eventEnd = new Date(eventStart);
    eventEnd.setHours(
      eventStart.getHours() + faker.number.int({ min: 1, max: 4 })
    );

    const eventTypes = [
      "Science Fair",
      "Sports Day",
      "Cultural Program",
      "Parent-Teacher Meeting",
      "Field Trip",
      "Workshop",
      "Debate Competition",
      "Art Exhibition",
    ];

    return {
      title: faker.helpers.arrayElement(eventTypes),
      description: faker.lorem.sentence(),
      startTime: eventStart,
      endTime: eventEnd,
      classId: faker.helpers.arrayElement(classes).id,
    };
  });

  eventsToCreate.push(...additionalEvents);

  const events = await Promise.all(
    eventsToCreate.map((eventData) => prisma.event.create({ data: eventData }))
  );
  console.log(`✅ Events seeded: ${events.length}`);

  // ---------------------------------------
  // 15. Seed Announcements
  // ---------------------------------------
  const announcements = await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.announcement.create({
        data: {
          title: faker.word.words(3),
          description: faker.lorem.sentence(),
          date: faker.date.recent({ days: 7 }),
          classId: faker.helpers.arrayElement(classes).id,
        },
      })
    )
  );
  console.log(`✅ Announcements seeded: ${announcements.length}`);

  // ---------------------------------------
  // Summary
  // ---------------------------------------
  console.log("\n🎉 Combined seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   - Admins: ${admins.count}`);
  console.log(`   - Parents: ${parents.length}`);
  console.log(`   - Teachers: ${teachers.length}`);
  console.log(`   - Grades: ${grades.length}`);
  console.log(`   - Subjects: ${subjects.length}`);
  console.log(`   - Classes: ${classes.length}`);
  console.log(`   - Students: ${students.length}`);
  console.log(`   - Lessons: ${lessons.length}`);
  console.log(`   - Exams: ${exams.length}`);
  console.log(`   - Assignments: ${assignments.length}`);
  console.log(`   - Results: ${results.length}`);
  console.log(`   - Attendance: ${attendance.length}`);
  console.log(`   - Events: ${events.length}`);
  console.log(`   - Announcements: ${announcements.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Combined seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
