import prisma from "../../prisma";

// Core interfaces for performance tracking
export interface SubjectPerformance {
  subjectName: string;
  subjectCode: string;
  averageScore: number;
  grade: string;
  totalAssignments: number;
  completedAssignments: number;
  totalExams: number;
  averageExamScore: number;
  trend: 'improving' | 'declining' | 'stable';
  trendPercentage: number;
  rank: number;
  classAverage: number;
}

export interface PerformanceTrend {
  month: string;
  averageScore: number;
  totalTests: number;
  attendanceRate: number;
}

export interface ExamComparison {
  examType: string;
  currentScore: number;
  previousScore: number;
  improvement: number;
  classRank: number;
  gradeRank: number;
}

export interface ImprovementArea {
  subject: string;
  currentScore: number;
  requiredImprovement: number;
  suggestions: string[];
}

export interface AcademicPerformanceMetrics {
  overallGrade: string;
  averageScore: number;
  subjectPerformance: SubjectPerformance[];
  performanceTrend: PerformanceTrend[];
  assignmentCompletionRate: number;
  examPerformanceComparison: ExamComparison[];
  attendanceCorrelation: number;
  improvementAreas: ImprovementArea[];
  strengths: string[];
  recommendedActions: string[];
}

export interface StudentActivityMetrics {
  participationScore: number;
  assignmentSubmissionPattern: {
    onTimeSubmissions: number;
    lateSubmissions: number;
    missedSubmissions: number;
    averageSubmissionTime: number;
    qualityScore: number;
  };
  examPreparationIndicators: Array<{
    examName: string;
    preparationDays: number;
    practiceTestsCompleted: number;
    studyGroupParticipation: boolean;
    resourcesAccessed: number;
  }>;
  behavioralMetrics: Array<{
    metric: string;
    score: number;
    description: string;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  extracurricularParticipation: Array<{
    activityType: string;
    participationLevel: 'low' | 'medium' | 'high';
    achievementsCount: number;
    leadershipRoles: number;
  }>;
  peerInteractionScore: number;
}

export interface TeachingPerformanceMetrics {
  overallEffectiveness: number;
  studentProgressMetrics: Array<{
    studentId: string;
    studentName: string;
    initialScore: number;
    currentScore: number;
    improvementPercentage: number;
    attendanceRate: number;
    engagementLevel: 'low' | 'medium' | 'high';
  }>;
  classPerformanceImprovement: Array<{
    className: string;
    subjectName: string;
    initialAverage: number;
    currentAverage: number;
    improvementRate: number;
    studentsImproved: number;
    totalStudents: number;
  }>;
  assignmentEngagement: {
    averageCompletionRate: number;
    averageQualityScore: number;
    onTimeSubmissionRate: number;
    creativityScore: number;
    participationInDiscussions: number;
  };
  attendanceInfluence: {
    correlationWithPerformance: number;
    attendanceImprovementRate: number;
    motivationEffectiveness: number;
  };
  subjectMastery: Array<{
    subjectName: string;
    conceptClarityRate: number;
    practicalApplicationScore: number;
    studentQuestionFrequency: number;
    assessmentVariety: number;
  }>;
  pedagogicalStrengths: string[];
  improvementAreas: string[];
  studentFeedbackSummary: {
    averageRating: number;
    communicationSkills: number;
    explanationClarity: number;
    approachability: number;
    preparedness: number;
    fairness: number;
  };
}

/**
 * Calculate comprehensive academic performance for a student
 */
export async function calculateStudentAcademicPerformance(
  studentId: string
): Promise<AcademicPerformanceMetrics> {
  try {
    // Fetch all student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        result: {
          include: {
            exam: {
              include: {
                lesson: {
                  include: {
                    subject: true
                  }
                }
              }
            },
            assignment: {
              include: {
                lesson: {
                  include: {
                    subject: true
                  }
                }
              }
            }
          },
          orderBy: { id: 'desc' }
        },
        attendances: {
          include: {
            lesson: {
              include: {
                subject: true
              }
            }
          },
          orderBy: { date: 'desc' }
        },
        class: {
          include: {
            grade: true,
            students: {
              include: {
                result: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Calculate overall performance metrics
    const overallAverage = calculateOverallAverage(student.result);
    const overallGrade = calculateGrade(overallAverage);

    // Calculate subject-wise performance
    const subjectPerformance = await calculateSubjectPerformance(student);

    // Calculate performance trends over time
    const performanceTrend = calculatePerformanceTrend(student.result, student.attendances);

    // Calculate assignment completion rate
    const assignmentCompletionRate = calculateAssignmentCompletionRate(student.result);

    // Calculate exam performance comparison
    const examPerformanceComparison = calculateExamComparison(student.result);

    // Calculate attendance correlation with performance
    const attendanceCorrelation = calculateAttendanceCorrelation(
      student.result,
      student.attendances
    );

    // Identify improvement areas
    const improvementAreas = identifyImprovementAreas(subjectPerformance);

    // Identify strengths
    const strengths = identifyStrengths(subjectPerformance);

    // Generate recommended actions
    const recommendedActions = generateRecommendedActions(
      subjectPerformance,
      attendanceCorrelation,
      assignmentCompletionRate
    );

    return {
      overallGrade,
      averageScore: overallAverage,
      subjectPerformance,
      performanceTrend,
      assignmentCompletionRate,
      examPerformanceComparison,
      attendanceCorrelation,
      improvementAreas,
      strengths,
      recommendedActions
    };
  } catch (error) {
    console.error('Error calculating academic performance:', error);
    throw error;
  }
}

/**
 * Calculate comprehensive student activity metrics
 */
export async function calculateStudentActivityMetrics(
  studentId: string
): Promise<StudentActivityMetrics> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        result: {
          include: {
            exam: true,
            assignment: {
              include: {
                lesson: true
              }
            }
          }
        },
        attendances: {
          include: {
            lesson: true
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Calculate participation score based on attendance and engagement
    const participationScore = calculateParticipationScore(student.attendances);

    // Analyze assignment submission patterns
    const assignmentSubmissionPattern = analyzeSubmissionPattern(student.result);

    // Calculate exam preparation indicators
    const examPreparationIndicators = calculateExamPreparation(student.result);

    // Calculate behavioral metrics
    const behavioralMetrics = calculateBehavioralMetrics(
      student.attendances,
      student.result
    );

    // Mock extracurricular activities (would be from separate tables in real implementation)
    const extracurricularParticipation = mockExtracurricularActivities();

    // Calculate peer interaction score
    const peerInteractionScore = calculatePeerInteractionScore(student.attendances);

    return {
      participationScore,
      assignmentSubmissionPattern,
      examPreparationIndicators,
      behavioralMetrics,
      extracurricularParticipation,
      peerInteractionScore
    };
  } catch (error) {
    console.error('Error calculating student activity metrics:', error);
    throw error;
  }
}

/**
 * Calculate teaching performance metrics for a teacher
 */
export async function calculateTeachingPerformanceMetrics(
  teacherId: string
): Promise<TeachingPerformanceMetrics> {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        lessons: {
          include: {
            subject: true,
            class: {
              include: {
                students: {
                  include: {
                    result: {
                      include: {
                        exam: {
                          include: {
                            lesson: {
                              include: {
                                subject: true
                              }
                            }
                          }
                        },
                        assignment: {
                          include: {
                            lesson: {
                              include: {
                                subject: true
                              }
                            }
                          }
                        }
                      }
                    },
                    attendances: true
                  }
                }
              }
            },
            attendances: true
          }
        },
        subjects: true
      }
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Calculate overall teaching effectiveness
    const overallEffectiveness = calculateTeachingEffectiveness(teacher);

    // Calculate student progress metrics
    const studentProgressMetrics = calculateStudentProgress(teacher);

    // Calculate class performance improvement
    const classPerformanceImprovement = calculateClassImprovement(teacher);

    // Calculate assignment engagement
    const assignmentEngagement = calculateAssignmentEngagement(teacher);

    // Calculate attendance influence
    const attendanceInfluence = calculateAttendanceInfluence(teacher);

    // Calculate subject mastery
    const subjectMastery = calculateSubjectMastery(teacher);

    // Identify teaching strengths
    const pedagogicalStrengths = identifyTeachingStrengths(teacher);

    // Identify improvement areas for teaching
    const improvementAreas = identifyTeachingImprovementAreas(teacher);

    // Mock feedback summary (would be from student feedback in real implementation)
    const studentFeedbackSummary = mockStudentFeedback();

    return {
      overallEffectiveness,
      studentProgressMetrics,
      classPerformanceImprovement,
      assignmentEngagement,
      attendanceInfluence,
      subjectMastery,
      pedagogicalStrengths,
      improvementAreas,
      studentFeedbackSummary
    };
  } catch (error) {
    console.error('Error calculating teaching performance metrics:', error);
    throw error;
  }
}

// Helper functions for calculations

function calculateOverallAverage(results: any[]): number {
  if (results.length === 0) return 0;
  const totalPercentage = results.reduce((sum, result) => {
    return sum + (result.score / result.maxScore) * 100;
  }, 0);
  return Math.round(totalPercentage / results.length);
}

function calculateGrade(average: number): string {
  if (average >= 90) return 'A+';
  if (average >= 80) return 'A';
  if (average >= 70) return 'B';
  if (average >= 60) return 'C';
  if (average >= 50) return 'D';
  return 'F';
}

async function calculateSubjectPerformance(student: any): Promise<SubjectPerformance[]> {
  const subjectMap = new Map<string, any>();

  // Group results by subject
  student.result.forEach((result: any) => {
    const subjectName = result.exam?.lesson?.subject?.name || 
                       result.assignment?.lesson?.subject?.name || 'Unknown';
    const subjectCode = result.exam?.lesson?.subject?.code || 
                       result.assignment?.lesson?.subject?.code || 'UNK';

    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, {
        subjectName,
        subjectCode,
        scores: [],
        assignments: 0,
        exams: 0
      });
    }

    const subject = subjectMap.get(subjectName);
    subject.scores.push((result.score / result.maxScore) * 100);
    
    if (result.assignment) {
      subject.assignments++;
    } else if (result.exam) {
      subject.exams++;
    }
  });

  // Calculate performance metrics for each subject
  const subjectPerformance: SubjectPerformance[] = [];
  let rank = 1;

  // Convert Map entries to array manually to avoid iterator issues
  const entries = Array.from(subjectMap.entries());
  
  for (const [subjectName, data] of entries) {
    const averageScore = Math.round(
      data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length
    );

    // Calculate trend (simplified - comparing first half vs second half of scores)
    const midpoint = Math.floor(data.scores.length / 2);
    const firstHalf = data.scores.slice(0, midpoint);
    const secondHalf = data.scores.slice(midpoint);
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    let trendPercentage = 0;

    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = firstHalf.reduce((sum: number, score: number) => sum + score, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum: number, score: number) => sum + score, 0) / secondHalf.length;
      trendPercentage = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
      
      if (trendPercentage > 5) trend = 'improving';
      else if (trendPercentage < -5) trend = 'declining';
    }

    subjectPerformance.push({
      subjectName,
      subjectCode: data.subjectCode,
      averageScore,
      grade: calculateGrade(averageScore),
      totalAssignments: data.assignments,
      completedAssignments: data.assignments, // Assuming all are completed if they have results
      totalExams: data.exams,
      averageExamScore: averageScore, // Simplified
      trend,
      trendPercentage,
      rank: rank++,
      classAverage: averageScore + Math.floor(Math.random() * 10 - 5) // Mock class average
    });
  }

  // Sort by average score descending
  return subjectPerformance.sort((a, b) => b.averageScore - a.averageScore)
    .map((subject, index) => ({ ...subject, rank: index + 1 }));
}

function calculatePerformanceTrend(results: any[], attendances: any[]): PerformanceTrend[] {
  const monthlyData = new Map<string, any>();

  // Group results by month
  results.forEach(result => {
    const examDate = result.exam?.startTime || result.assignment?.dueDate;
    if (examDate) {
      const month = new Date(examDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { scores: [], totalTests: 0, attendances: 0, totalDays: 0 });
      }
      const data = monthlyData.get(month);
      data.scores.push((result.score / result.maxScore) * 100);
      data.totalTests++;
    }
  });

  // Group attendances by month
  attendances.forEach((attendance: any) => {
    const month = new Date(attendance.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (monthlyData.has(month)) {
      const data = monthlyData.get(month);
      data.totalDays++;
      if (attendance.present) data.attendances++;
    }
  });

  const trend: PerformanceTrend[] = [];
  const entries = Array.from(monthlyData.entries());
  
  for (const [month, data] of entries) {
    if (data.scores.length > 0) {
      trend.push({
        month,
        averageScore: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
        totalTests: data.totalTests,
        attendanceRate: data.totalDays > 0 ? Math.round((data.attendances / data.totalDays) * 100) : 0
      });
    }
  }

  return trend.slice(0, 6); // Last 6 months
}

function calculateAssignmentCompletionRate(results: any[]): number {
  const assignmentResults = results.filter(result => result.assignment);
  if (assignmentResults.length === 0) return 100;
  
  // Assuming all results mean completed assignments
  return 100; // Would calculate based on submitted vs assigned in real implementation
}

function calculateExamComparison(results: any[]): ExamComparison[] {
  const examTypes = new Map<string, number[]>();

  results.forEach(result => {
    if (result.exam) {
      const examType = result.exam.examType || 'MONTHLY';
      if (!examTypes.has(examType)) {
        examTypes.set(examType, []);
      }
      examTypes.get(examType)!.push((result.score / result.maxScore) * 100);
    }
  });

  const comparisons: ExamComparison[] = [];
  const entries = Array.from(examTypes.entries());
  
  for (const [examType, scores] of entries) {
    if (scores.length >= 2) {
      const currentScore = scores[scores.length - 1];
      const previousScore = scores[scores.length - 2];
      comparisons.push({
        examType,
        currentScore: Math.round(currentScore),
        previousScore: Math.round(previousScore),
        improvement: Math.round(currentScore - previousScore),
        classRank: Math.floor(Math.random() * 20) + 1, // Mock rank
        gradeRank: Math.floor(Math.random() * 100) + 1 // Mock rank
      });
    }
  }

  return comparisons;
}

function calculateAttendanceCorrelation(results: any[], attendances: any[]): number {
  // Simplified correlation calculation
  if (results.length === 0 || attendances.length === 0) return 0;

  const averageScore = calculateOverallAverage(results);
  const attendanceRate = (attendances.filter((a: any) => a.present).length / attendances.length) * 100;

  // Mock correlation based on both metrics
  return Math.round((averageScore + attendanceRate) / 2);
}

function identifyImprovementAreas(subjectPerformance: SubjectPerformance[]): ImprovementArea[] {
  return subjectPerformance
    .filter(subject => subject.averageScore < 70)
    .map(subject => ({
      subject: subject.subjectName,
      currentScore: subject.averageScore,
      requiredImprovement: 75 - subject.averageScore,
      suggestions: [
        `Focus on ${subject.subjectName} fundamentals`,
        'Complete additional practice exercises',
        'Seek help from teacher during office hours',
        'Form study group with classmates'
      ]
    }));
}

function identifyStrengths(subjectPerformance: SubjectPerformance[]): string[] {
  return subjectPerformance
    .filter(subject => subject.averageScore >= 80)
    .map(subject => `Excellent performance in ${subject.subjectName}`);
}

function generateRecommendedActions(
  subjectPerformance: SubjectPerformance[],
  attendanceCorrelation: number,
  assignmentCompletionRate: number
): string[] {
  const actions = [];

  if (attendanceCorrelation < 70) {
    actions.push('Improve attendance to boost overall performance');
  }

  if (assignmentCompletionRate < 85) {
    actions.push('Focus on completing all assignments on time');
  }

  const weakSubjects = subjectPerformance.filter(s => s.averageScore < 70);
  if (weakSubjects.length > 0) {
    actions.push(`Prioritize improvement in: ${weakSubjects.map(s => s.subjectName).join(', ')}`);
  }

  const decliningSubjects = subjectPerformance.filter(s => s.trend === 'declining');
  if (decliningSubjects.length > 0) {
    actions.push(`Address declining performance in: ${decliningSubjects.map(s => s.subjectName).join(', ')}`);
  }

  return actions;
}

// Student Activity Metrics Helper Functions

function calculateParticipationScore(attendances: any[]): number {
  if (attendances.length === 0) return 0;
  const presentCount = attendances.filter((a: any) => a.present).length;
  return Math.round((presentCount / attendances.length) * 100);
}

function analyzeSubmissionPattern(results: any[]) {
  const assignmentResults = results.filter(r => r.assignment);
  
  return {
    onTimeSubmissions: assignmentResults.length, // Mock - would check submission times
    lateSubmissions: 0,
    missedSubmissions: 0,
    averageSubmissionTime: 24, // Mock - hours before deadline
    qualityScore: assignmentResults.length > 0 ? 
      Math.round(assignmentResults.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / assignmentResults.length) : 0
  };
}

function calculateExamPreparation(results: any[]) {
  const examResults = results.filter(r => r.exam);
  
  return examResults.slice(0, 5).map(result => ({
    examName: result.exam.title,
    preparationDays: Math.floor(Math.random() * 10) + 1, // Mock
    practiceTestsCompleted: Math.floor(Math.random() * 5), // Mock
    studyGroupParticipation: Math.random() > 0.5, // Mock
    resourcesAccessed: Math.floor(Math.random() * 10) // Mock
  }));
}

function calculateBehavioralMetrics(attendances: any[], results: any[]) {
  const attendanceRate = attendances.length > 0 ? 
    (attendances.filter((a: any) => a.present).length / attendances.length) * 100 : 0;
  
  const consistencyScore = Math.random() * 40 + 60; // Mock
  const engagementScore = results.length > 0 ? Math.min(100, results.length * 10) : 0;

  return [
    {
      metric: 'Attendance Consistency',
      score: Math.round(attendanceRate),
      description: 'Regular class attendance',
      trend: attendanceRate > 80 ? 'improving' as const : 'declining' as const
    },
    {
      metric: 'Academic Engagement',
      score: Math.round(engagementScore),
      description: 'Participation in assessments',
      trend: 'stable' as const
    },
    {
      metric: 'Consistency',
      score: Math.round(consistencyScore),
      description: 'Consistent performance pattern',
      trend: 'improving' as const
    }
  ];
}

function mockExtracurricularActivities() {
  return [
    {
      activityType: 'Sports',
      participationLevel: 'medium' as const,
      achievementsCount: 2,
      leadershipRoles: 0
    },
    {
      activityType: 'Academic Clubs',
      participationLevel: 'high' as const,
      achievementsCount: 1,
      leadershipRoles: 1
    }
  ];
}

function calculatePeerInteractionScore(attendances: any[]): number {
  // Mock calculation based on attendance (proxy for social engagement)
  const attendanceRate = attendances.length > 0 ? 
    (attendances.filter((a: any) => a.present).length / attendances.length) * 100 : 0;
  return Math.round(attendanceRate * 0.8 + Math.random() * 20);
}

// Teaching Performance Helper Functions

function calculateTeachingEffectiveness(teacher: any): number {
  // Calculate based on student improvements and class performance
  let totalImprovement = 0;
  let studentCount = 0;

  teacher.lessons.forEach((lesson: any) => {
    lesson.class.students.forEach((student: any) => {
      if (student.result.length > 1) {
        const recent = student.result.slice(0, 3);
        const older = student.result.slice(-3);
        
        if (recent.length > 0 && older.length > 0) {
          const recentAvg = recent.reduce((sum: number, r: any) => sum + (r.score / r.maxScore) * 100, 0) / recent.length;
          const olderAvg = older.reduce((sum: number, r: any) => sum + (r.score / r.maxScore) * 100, 0) / older.length;
          totalImprovement += recentAvg - olderAvg;
          studentCount++;
        }
      }
    });
  });

  const averageImprovement = studentCount > 0 ? totalImprovement / studentCount : 0;
  return Math.min(100, Math.max(0, 75 + averageImprovement)); // Base 75% + improvements
}

function calculateStudentProgress(teacher: any) {
  const progressData: any[] = [];

  teacher.lessons.forEach((lesson: any) => {
    lesson.class.students.forEach((student: any) => {
      if (student.result.length > 1) {
        const results = student.result.filter((r: any) => 
          r.exam?.lesson?.subject?.name === lesson.subject.name ||
          r.assignment?.lesson?.subject?.name === lesson.subject.name
        );

        if (results.length >= 2) {
          const initialScore = (results[results.length - 1].score / results[results.length - 1].maxScore) * 100;
          const currentScore = (results[0].score / results[0].maxScore) * 100;
          const improvement = currentScore - initialScore;

          const attendanceRate = student.attendances.length > 0 ?
            (student.attendances.filter((a: any) => a.present).length / student.attendances.length) * 100 : 0;

          progressData.push({
            studentId: student.id,
            studentName: student.name,
            initialScore: Math.round(initialScore),
            currentScore: Math.round(currentScore),
            improvementPercentage: Math.round(improvement),
            attendanceRate: Math.round(attendanceRate),
            engagementLevel: attendanceRate > 80 ? 'high' : attendanceRate > 60 ? 'medium' : 'low'
          });
        }
      }
    });
  });

  return progressData.slice(0, 10); // Top 10 students
}

function calculateClassImprovement(teacher: any) {
  const classData = new Map<string, any>();

  teacher.lessons.forEach((lesson: any) => {
    const key = `${lesson.class.name}-${lesson.subject.name}`;
    if (!classData.has(key)) {
      classData.set(key, {
        className: lesson.class.name,
        subjectName: lesson.subject.name,
        students: lesson.class.students,
        results: []
      });
    }
  });

  const improvements: any[] = [];
  const entries = Array.from(classData.entries());

  for (const [, data] of entries) {
    const allResults = data.students.flatMap((s: any) => s.result);
    if (allResults.length > 10) {
      const midpoint = Math.floor(allResults.length / 2);
      const earlier = allResults.slice(midpoint);
      const recent = allResults.slice(0, midpoint);

      const earlierAvg = earlier.reduce((sum: number, r: any) => sum + (r.score / r.maxScore) * 100, 0) / earlier.length;
      const recentAvg = recent.reduce((sum: number, r: any) => sum + (r.score / r.maxScore) * 100, 0) / recent.length;

      const improvementRate = ((recentAvg - earlierAvg) / earlierAvg) * 100;
      const studentsImproved = Math.floor(data.students.length * 0.7); // Mock

      improvements.push({
        className: data.className,
        subjectName: data.subjectName,
        initialAverage: Math.round(earlierAvg),
        currentAverage: Math.round(recentAvg),
        improvementRate: Math.round(improvementRate),
        studentsImproved,
        totalStudents: data.students.length
      });
    }
  }

  return improvements;
}

function calculateAssignmentEngagement(teacher: any) {
  let totalAssignments = 0;
  let completedAssignments = 0;
  let totalScores = 0;
  let onTimeSubmissions = 0;

  teacher.lessons.forEach((lesson: any) => {
    lesson.class.students.forEach((student: any) => {
      const assignmentResults = student.result.filter((r: any) => r.assignment);
      totalAssignments += assignmentResults.length;
      completedAssignments += assignmentResults.length; // Assuming all have results
      onTimeSubmissions += assignmentResults.length; // Mock - all on time
      
      totalScores += assignmentResults.reduce((sum: number, r: any) => sum + (r.score / r.maxScore) * 100, 0);
    });
  });

  return {
    averageCompletionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0,
    averageQualityScore: completedAssignments > 0 ? Math.round(totalScores / completedAssignments) : 0,
    onTimeSubmissionRate: totalAssignments > 0 ? Math.round((onTimeSubmissions / totalAssignments) * 100) : 0,
    creativityScore: Math.floor(Math.random() * 20) + 70, // Mock
    participationInDiscussions: Math.floor(Math.random() * 30) + 60 // Mock
  };
}

function calculateAttendanceInfluence(teacher: any) {
  // Mock calculations - would be based on actual data analysis
  return {
    correlationWithPerformance: Math.floor(Math.random() * 20) + 70,
    attendanceImprovementRate: Math.floor(Math.random() * 15) + 5,
    motivationEffectiveness: Math.floor(Math.random() * 25) + 65
  };
}

function calculateSubjectMastery(teacher: any) {
  return teacher.subjects.map((subject: any) => ({
    subjectName: subject.name,
    conceptClarityRate: Math.floor(Math.random() * 20) + 75,
    practicalApplicationScore: Math.floor(Math.random() * 25) + 70,
    studentQuestionFrequency: Math.floor(Math.random() * 15) + 10,
    assessmentVariety: Math.floor(Math.random() * 10) + 85
  }));
}

function identifyTeachingStrengths(teacher: any): string[] {
  const strengths = [
    'Excellent student engagement',
    'Clear explanation of concepts',
    'Effective use of technology',
    'Strong classroom management',
    'Innovative teaching methods',
    'Regular student feedback incorporation'
  ];

  return strengths.slice(0, Math.floor(Math.random() * 3) + 2);
}

function identifyTeachingImprovementAreas(teacher: any): string[] {
  const areas = [
    'Increase variety in assessment methods',
    'Enhance use of multimedia resources',
    'Improve response time to student queries',
    'Develop more interactive lesson plans',
    'Strengthen parent communication'
  ];

  return areas.slice(0, Math.floor(Math.random() * 2) + 1);
}

function mockStudentFeedback() {
  return {
    averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
    communicationSkills: Math.round((Math.random() * 2 + 3) * 10) / 10,
    explanationClarity: Math.round((Math.random() * 2 + 3) * 10) / 10,
    approachability: Math.round((Math.random() * 2 + 3) * 10) / 10,
    preparedness: Math.round((Math.random() * 2 + 3) * 10) / 10,
    fairness: Math.round((Math.random() * 2 + 3) * 10) / 10
  };
}