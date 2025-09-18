import {
  ResultData,
  ClassLevelData,
  GroupPerformanceItem,
  ClassTrendItem,
  StudentGrowthItem,
  AverageMarksData,
  Student,
  StudentGrade,
} from "@/types/result-types";

// Class level data
export const classData: ClassLevelData = {
  "7": { students: 120, averageScore: 78 },
  "8": { students: 125, averageScore: 80 },
  "9": { students: 130, averageScore: 81 },
  "10": {
    groups: ["Science", "Commerce", "Arts"],
    students: 150,
    averageScore: 82,
  },
  "11": {
    groups: ["Science", "Commerce", "Arts"],
    students: 130,
    averageScore: 79,
  },
  "12": {
    groups: ["Science", "Commerce", "Arts"],
    students: 120,
    averageScore: 85,
  },
};

// Group performance data across classes
export const groupPerformanceData: GroupPerformanceItem[] = [
  { group: "Science", class9: 90, class10: 85, class11: 82, class12: 88 },
  { group: "Commerce", class9: 90, class10: 80, class11: 78, class12: 83 },
  { group: "Arts", class9: 90, class10: 82, class11: 77, class12: 84 },
];

// Class trend data across months
export const classTrendData: ClassTrendItem[] = [
  {
    name: "Jan",
    class7: 75,
    class8: 76,
    class9: 77,
    class10: 78,
    class11: 75,
    class12: 82,
  },
  {
    name: "Feb",
    class7: 76,
    class8: 77,
    class9: 78,
    class10: 80,
    class11: 76,
    class12: 83,
  },
  {
    name: "Mar",
    class7: 77,
    class8: 78,
    class9: 79,
    class10: 82,
    class11: 78,
    class12: 85,
  },
  {
    name: "Apr",
    class7: 76,
    class8: 77,
    class9: 78,
    class10: 81,
    class11: 77,
    class12: 84,
  },
  {
    name: "May",
    class7: 78,
    class8: 79,
    class9: 80,
    class10: 83,
    class11: 79,
    class12: 86,
  },
  {
    name: "Jun",
    class7: 79,
    class8: 80,
    class9: 81,
    class10: 85,
    class11: 80,
    class12: 88,
  },
];

// Student growth data over months
export const studentGrowthData: StudentGrowthItem[] = [
  { month: "Jan", growth: 2 },
  { month: "Feb", growth: 3 },
  { month: "Mar", growth: 5 },
  { month: "Apr", growth: 4 },
  { month: "May", growth: 7 },
  { month: "Jun", growth: 6 },
];

// Average marks data for all classes
export const averageMarksData: AverageMarksData = {
  // Class 7
  class7: [
    { subject: "Ban-1", current: 85, previous: 82 },
    { subject: "Ban-2", current: 82, previous: 79 },
    { subject: "Eng-1", current: 78, previous: 80 },
    { subject: "Eng-2", current: 84, previous: 82 },
    { subject: "Math", current: 88, previous: 85 },
    { subject: "GenSci", current: 86, previous: 84 },
    { subject: "BGS", current: 79, previous: 77 },
    { subject: "ICT", current: 88, previous: 85 },
    { subject: "Rel", current: 80, previous: 78 },
  ],

  // Class 8
  class8: [
    { subject: "Ban-1", current: 85, previous: 82 },
    { subject: "Ban-2", current: 82, previous: 79 },
    { subject: "Eng-1", current: 78, previous: 80 },
    { subject: "Eng-2", current: 84, previous: 82 },
    { subject: "Math", current: 88, previous: 85 },
    { subject: "GenSci", current: 86, previous: 84 },
    { subject: "BGS", current: 79, previous: 77 },
    { subject: "ICT", current: 88, previous: 85 },
    { subject: "Rel", current: 80, previous: 78 },
  ],

  // Class 9 (SSC Start)
  class9: {
    generalSubjects: [
      { subject: "Ban-1", current: 85, previous: 82 },
      { subject: "Ban-2", current: 82, previous: 79 },
      { subject: "Eng-1", current: 78, previous: 80 },
      { subject: "Eng-2", current: 84, previous: 82 },
      { subject: "Math", current: 88, previous: 85 },
      { subject: "GenSci", current: 86, previous: 84 },
      { subject: "BGS", current: 79, previous: 77 },
      { subject: "ICT", current: 88, previous: 85 },
      { subject: "Rel", current: 80, previous: 78 },
    ],
    electiveSubjects: {
      scienceGroup: [
        { subject: "Phy", current: 86, previous: 84 },
        { subject: "Chem", current: 79, previous: 77 },
        { subject: "Bio", current: 82, previous: 80 },
        { subject: "HM", current: 85, previous: 83 },
      ],
      commerceGroup: [
        { subject: "Acc", current: 82, previous: 80 },
        { subject: "BOM", current: 85, previous: 83 },
        { subject: "Eco", current: 79, previous: 78 },
        { subject: "Stat", current: 83, previous: 81 },
      ],
      artsGroup: [
        { subject: "Hist", current: 77, previous: 75 },
        { subject: "Civ", current: 78, previous: 76 },
        { subject: "IHC", current: 80, previous: 78 },
      ],
    },
  },

  // Class 10 (SSC)
  class10: {
    generalSubjects: [
      { subject: "Ban-1", current: 85, previous: 82 },
      { subject: "Ban-2", current: 82, previous: 79 },
      { subject: "Eng-1", current: 78, previous: 80 },
      { subject: "Eng-2", current: 84, previous: 82 },
      { subject: "Math", current: 88, previous: 85 },
      { subject: "GenSci", current: 86, previous: 84 },
      { subject: "BGS", current: 79, previous: 77 },
      { subject: "ICT", current: 88, previous: 85 },
      { subject: "Rel", current: 80, previous: 78 },
    ],
    electiveSubjects: {
      scienceGroup: [
        { subject: "Phy", current: 86, previous: 84 },
        { subject: "Chem", current: 79, previous: 77 },
        { subject: "Bio", current: 82, previous: 80 },
        { subject: "HM", current: 85, previous: 83 },
      ],
      commerceGroup: [
        { subject: "Acc", current: 82, previous: 80 },
        { subject: "BOM", current: 85, previous: 83 },
        { subject: "Eco", current: 79, previous: 78 },
        { subject: "Stat", current: 83, previous: 81 },
      ],
      artsGroup: [
        { subject: "Hist", current: 77, previous: 75 },
        { subject: "Civ", current: 78, previous: 76 },
        { subject: "IHC", current: 80, previous: 78 },
      ],
    },
  },

  // Class 11 (HSC Start)
  class11: {
    generalSubjects: [
      { subject: "Ban-1", current: 85, previous: 82 },
      { subject: "Ban-2", current: 82, previous: 79 },
      { subject: "Eng-1", current: 78, previous: 80 },
      { subject: "Eng-2", current: 84, previous: 82 },
      { subject: "ICT", current: 88, previous: 85 },
    ],
    electiveSubjects: {
      scienceGroup: [
        { subject: "Phy-1", current: 86, previous: 84 },
        { subject: "Chem-1", current: 79, previous: 77 },
        { subject: "Bio-1", current: 82, previous: 80 },
        { subject: "HM-1", current: 85, previous: 83 },
      ],
      commerceGroup: [
        { subject: "Acc-1", current: 82, previous: 80 },
        { subject: "BOM-1", current: 85, previous: 83 },
        { subject: "Eco-1", current: 79, previous: 78 },
        { subject: "Stat", current: 83, previous: 81 },
      ],
      artsGroup: [
        { subject: "Hist-1", current: 77, previous: 75 },
        { subject: "Civ-1", current: 78, previous: 76 },
        { subject: "IHC-1", current: 80, previous: 78 },
      ],
    },
  },

  // Class 12 (HSC)
  class12: {
    generalSubjects: [
      { subject: "Ban-1", current: 85, previous: 82 },
      { subject: "Ban-2", current: 82, previous: 79 },
      { subject: "Eng-1", current: 78, previous: 80 },
      { subject: "Eng-2", current: 84, previous: 82 },
      { subject: "ICT", current: 88, previous: 85 },
    ],
    electiveSubjects: {
      scienceGroup: [
        { subject: "Phy-2", current: 86, previous: 84 },
        { subject: "Chem-2", current: 79, previous: 77 },
        { subject: "Bio-2", current: 82, previous: 80 },
        { subject: "HM-2", current: 85, previous: 83 },
      ],
      commerceGroup: [
        { subject: "Acc-2", current: 82, previous: 80 },
        { subject: "BOM-2", current: 85, previous: 83 },
        { subject: "Eco-2", current: 79, previous: 78 },
        { subject: "Stat", current: 83, previous: 81 },
      ],
      artsGroup: [
        { subject: "Hist-2", current: 77, previous: 75 },
        { subject: "Civ-2", current: 78, previous: 76 },
        { subject: "IHC-2", current: 80, previous: 78 },
      ],
    },
  },
};

// Type guard to validate student grades
const isValidGrade = (grade: string): grade is StudentGrade => {
  return ["A+", "A", "B", "C", "D", "F"].includes(grade);
};

// Validate and transform student data
const validateStudents = (students: any[]): Student[] => {
  return students.map((student) => {
    if (!isValidGrade(student.grade)) {
      console.warn(
        `Invalid grade found for student ${student.id}: ${student.grade}`
      );
      // Default to 'F' for invalid grades
      return { ...student, grade: "F" as StudentGrade };
    }
    return student as Student;
  });
};

// Mock student data
export const mockStudents: Student[] = validateStudents([
  {
    id: 1,
    name: "Alice Johnson",
    grade: "A+",
    class: 10,
    group: "Science",
    averageScore: 92,
    subjects: { Math: 95, Science: 88, English: 90, History: 89, Art: 98 },
  },
  {
    id: 2,
    name: "Bob Smith",
    grade: "B",
    class: 11,
    group: "Commerce",
    averageScore: 85,
    subjects: { Math: 82, Science: 85, English: 88, History: 80, Art: 90 },
  },
  {
    id: 3,
    name: "Charlie Brown",
    grade: "C",
    class: 8,
    averageScore: 78,
    subjects: { Math: 75, Science: 80, English: 76, History: 78, Art: 81 },
  },
  {
    id: 4,
    name: "Diana Ross",
    grade: "A",
    class: 12,
    group: "Arts",
    averageScore: 95,
    subjects: { Math: 98, Science: 92, English: 95, History: 93, Art: 97 },
  },
  {
    id: 5,
    name: "Ethan Hunt",
    grade: "B",
    class: 9,
    averageScore: 88,
    subjects: { Math: 85, Science: 90, English: 87, History: 86, Art: 92 },
  },
  {
    id: 6,
    name: "Sophia Turner",
    grade: "A",
    class: 10,
    group: "Science",
    averageScore: 91,
    subjects: { Math: 94, Science: 87, English: 89, History: 88, Art: 92 },
  },
  {
    id: 7,
    name: "James Carter",
    grade: "C",
    class: 11,
    group: "Commerce",
    averageScore: 80,
    subjects: { Math: 78, Science: 80, English: 85, History: 75, Art: 82 },
  },
  {
    id: 8,
    name: "Mia Lewis",
    grade: "B",
    class: 12,
    group: "Arts",
    averageScore: 84,
    subjects: { Math: 80, Science: 82, English: 86, History: 88, Art: 90 },
  },
  {
    id: 9,
    name: "Lucas Davis",
    grade: "A+",
    class: 9,
    group: "Science",
    averageScore: 96,
    subjects: { Math: 98, Science: 94, English: 92, History: 90, Art: 97 },
  },
  {
    id: 10,
    name: "Olivia Martinez",
    grade: "F",
    class: 8,
    group: "Commerce",
    averageScore: 58,
    subjects: { Math: 55, Science: 60, English: 60, History: 52, Art: 62 },
  },
  {
    id: 11,
    name: "Noah Walker",
    grade: "A",
    class: 11,
    group: "Commerce",
    averageScore: 93,
    subjects: { Math: 95, Science: 88, English: 91, History: 89, Art: 96 },
  },
  {
    id: 12,
    name: "Emma King",
    grade: "B",
    class: 10,
    group: "Arts",
    averageScore: 86,
    subjects: { Math: 80, Science: 85, English: 88, History: 84, Art: 92 },
  },
  {
    id: 13,
    name: "Grace White",
    grade: "A+",
    class: 12,
    group: "Science",
    averageScore: 98,
    subjects: { Math: 100, Science: 96, English: 94, History: 92, Art: 99 },
  },
  {
    id: 14,
    name: "Henry Adams",
    grade: "B",
    class: 9,
    group: "Commerce",
    averageScore: 89,
    subjects: { Math: 87, Science: 90, English: 91, History: 85, Art: 93 },
  },
  {
    id: 15,
    name: "Lily Scott",
    grade: "A",
    class: 11,
    group: "Arts",
    averageScore: 94,
    subjects: { Math: 92, Science: 89, English: 96, History: 90, Art: 98 },
  },
  {
    id: 16,
    name: "Mason Green",
    grade: "D",
    class: 8,
    group: "Science",
    averageScore: 65,
    subjects: { Math: 62, Science: 64, English: 68, History: 66, Art: 70 },
  },
  {
    id: 17,
    name: "Ella Thompson",
    grade: "B",
    class: 10,
    group: "Commerce",
    averageScore: 87,
    subjects: { Math: 84, Science: 85, English: 89, History: 82, Art: 88 },
  },
  {
    id: 18,
    name: "Jack Davis",
    grade: "A+",
    class: 9,
    group: "Arts",
    averageScore: 93,
    subjects: { Math: 96, Science: 90, English: 91, History: 89, Art: 95 },
  },
  {
    id: 19,
    name: "Ava Moore",
    grade: "C",
    class: 12,
    group: "Commerce",
    averageScore: 79,
    subjects: { Math: 74, Science: 78, English: 81, History: 77, Art: 80 },
  },
  {
    id: 20,
    name: "Zoe Walker",
    grade: "B",
    class: 8,
    group: "Arts",
    averageScore: 85,
    subjects: { Math: 83, Science: 82, English: 88, History: 80, Art: 90 },
  },
]);

// Performance insights
export const performanceInsights: string[] = [
  "Overall student performance has improved by 5% compared to last month.",
  "Math scores show the highest improvement, with a 7% increase.",
  "20% of students have shown significant progress in their weakest subject.",
  "Attention needed: Science scores have slightly declined for grade B students.",
];

// Aggregate all data
export const resultData: ResultData = {
  classData,
  groupPerformanceData,
  classTrendData,
  studentGrowthData,
  averageMarksData,
  mockStudents,
  performanceInsights,
};
