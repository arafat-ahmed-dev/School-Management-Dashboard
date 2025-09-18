import {
  AverageMarksData,
  OverviewMetrics,
  Student,
  SubjectMarks,
  ClassData,
} from "@/types/result-types";

/**
 * Utility functions for calculating metrics from result data
 */

/**
 * Calculates the current average from average marks data
 */
export const calculateCurrentAverage = (
  averageMarksData: AverageMarksData
): number => {
  const allSubjects = getAllSubjects(averageMarksData);
  const totalCurrent = allSubjects.reduce(
    (sum, subject) => sum + subject.current,
    0
  );
  return allSubjects.length > 0 ? totalCurrent / allSubjects.length : 0;
};

/**
 * Calculates the previous average from average marks data
 */
export const calculatePreviousAverage = (
  averageMarksData: AverageMarksData
): number => {
  const allSubjects = getAllSubjects(averageMarksData);
  const totalPrevious = allSubjects.reduce(
    (sum, subject) => sum + subject.previous,
    0
  );
  return allSubjects.length > 0 ? totalPrevious / allSubjects.length : 0;
};

/**
 * Calculates the growth percentage between current and previous averages
 */
export const calculateGrowthPercentage = (
  currentAverage: number,
  previousAverage: number
): number => {
  if (previousAverage === 0) return 0;
  return ((currentAverage - previousAverage) / previousAverage) * 100;
};

/**
 * Gets all subjects from the average marks data structure
 */
const getAllSubjects = (averageMarksData: AverageMarksData): SubjectMarks[] => {
  const allSubjects: SubjectMarks[] = [];

  Object.values(averageMarksData).forEach((classData) => {
    if (Array.isArray(classData)) {
      // For classes 7 and 8 (direct array)
      allSubjects.push(...classData);
    } else {
      // For classes 9-12 (ClassData object)
      const classDataObj = classData as ClassData;

      // Add general subjects
      if (classDataObj.generalSubjects) {
        allSubjects.push(...classDataObj.generalSubjects);
      }

      // Add elective subjects
      if (classDataObj.electiveSubjects) {
        Object.values(classDataObj.electiveSubjects).forEach(
          (groupSubjects) => {
            allSubjects.push(...groupSubjects);
          }
        );
      }
    }
  });

  return allSubjects;
};

/**
 * Finds the top performing subject based on current scores
 */
export const findTopSubject = (
  averageMarksData: AverageMarksData
): { subject: string; score: number } => {
  const allSubjects = getAllSubjects(averageMarksData);

  if (allSubjects.length === 0) {
    return { subject: "N/A", score: 0 };
  }

  const topSubject = allSubjects.reduce((best, current) =>
    current.current > best.current ? current : best
  );

  return { subject: topSubject.subject, score: topSubject.current };
};

/**
 * Calculates total number of students from student data
 */
export const calculateTotalStudents = (students: Student[]): number => {
  return students.length;
};

/**
 * Calculates complete overview metrics
 */
export const calculateOverviewMetrics = (
  averageMarksData: AverageMarksData,
  students: Student[]
): OverviewMetrics => {
  const currentAverage = calculateCurrentAverage(averageMarksData);
  const previousAverage = calculatePreviousAverage(averageMarksData);
  const growthPercentage = calculateGrowthPercentage(
    currentAverage,
    previousAverage
  );
  const totalStudents = calculateTotalStudents(students);
  const topSubjectData = findTopSubject(averageMarksData);

  return {
    currentAverage,
    previousAverage,
    growthPercentage,
    totalStudents,
    topSubject: topSubjectData.subject,
    topSubjectScore: topSubjectData.score,
  };
};

/**
 * Filters students by class
 */
export const filterStudentsByClass = (
  students: Student[],
  classNumber: number
): Student[] => {
  return students.filter((student) => student.class === classNumber);
};

/**
 * Filters students by grade
 */
export const filterStudentsByGrade = (
  students: Student[],
  grade: string
): Student[] => {
  return students.filter((student) => student.grade === grade);
};

/**
 * Calculates average score for a group of students
 */
export const calculateAverageScore = (students: Student[]): number => {
  if (students.length === 0) return 0;
  const totalScore = students.reduce(
    (sum, student) => sum + student.averageScore,
    0
  );
  return totalScore / students.length;
};

/**
 * Gets students by performance level
 */
export const getStudentsByPerformance = (
  students: Student[],
  threshold: number
): {
  aboveThreshold: Student[];
  belowThreshold: Student[];
} => {
  const aboveThreshold = students.filter(
    (student) => student.averageScore >= threshold
  );
  const belowThreshold = students.filter(
    (student) => student.averageScore < threshold
  );

  return { aboveThreshold, belowThreshold };
};

/**
 * Calculates class-wise statistics
 */
export const calculateClassStatistics = (students: Student[]) => {
  const classStats: { [key: number]: { count: number; averageScore: number } } =
    {};

  students.forEach((student) => {
    if (!classStats[student.class]) {
      classStats[student.class] = { count: 0, averageScore: 0 };
    }
    classStats[student.class].count++;
  });

  Object.keys(classStats).forEach((classKey) => {
    const classNum = parseInt(classKey);
    const classStudents = filterStudentsByClass(students, classNum);
    classStats[classNum].averageScore = calculateAverageScore(classStudents);
  });

  return classStats;
};

/**
 * Gets top performing students
 */
export const getTopStudents = (
  students: Student[],
  count: number = 10
): Student[] => {
  return students
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, count);
};

/**
 * Gets students needing improvement
 */
export const getStudentsNeedingImprovement = (
  students: Student[],
  threshold: number = 70
): Student[] => {
  return students
    .filter((student) => student.averageScore < threshold)
    .sort((a, b) => a.averageScore - b.averageScore);
};
