// Types for Result Section Data

export interface Subjects {
  Math: number;
  Science: number;
  English: number;
  History: number;
  Art: number;
}

export type StudentGrade = "A+" | "A" | "B" | "C" | "D" | "F";
export type StudentGroup = "Science" | "Commerce" | "Arts" | "N/A";

export interface Student {
  id: number;
  name: string;
  grade: StudentGrade;
  class: number;
  group?: StudentGroup;
  averageScore: number;
  subjects: Subjects;
}

export interface SubjectMarks {
  subject: string;
  current: number;
  previous: number;
}

export interface ElectiveSubjects {
  scienceGroup: SubjectMarks[];
  commerceGroup: SubjectMarks[];
  artsGroup: SubjectMarks[];
}

export interface ClassData {
  generalSubjects?: SubjectMarks[];
  electiveSubjects?: ElectiveSubjects;
}

export interface AverageMarksData {
  class7: SubjectMarks[];
  class8: SubjectMarks[];
  class9: ClassData;
  class10: ClassData;
  class11: ClassData;
  class12: ClassData;
}

export interface ClassInfo {
  students: number;
  averageScore: number;
  groups?: string[];
}

export interface ClassLevelData {
  [key: string]: ClassInfo; // Index signature for component compatibility
}

export interface GroupPerformanceItem {
  group: string;
  class9: number;
  class10: number;
  class11: number;
  class12: number;
  [key: string]: string | number; // Index signature for component compatibility
}

export interface ClassTrendItem {
  name: string;
  class7: number;
  class8: number;
  class9: number;
  class10: number;
  class11: number;
  class12: number;
  [key: string]: string | number; // Index signature for component compatibility
}

export interface StudentGrowthItem {
  month: string;
  growth: number;
}

export interface OverviewMetrics {
  currentAverage: number;
  previousAverage: number;
  growthPercentage: number;
  totalStudents: number;
  topSubject: string;
  topSubjectScore: number;
}

export interface ResultData {
  classData: ClassLevelData;
  groupPerformanceData: GroupPerformanceItem[];
  classTrendData: ClassTrendItem[];
  studentGrowthData: StudentGrowthItem[];
  averageMarksData: AverageMarksData;
  mockStudents: Student[];
  performanceInsights: string[];
}
