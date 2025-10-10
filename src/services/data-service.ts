import {
  classData as mockClassData,
  groupPerformanceData as mockGroupPerformanceData,
  classTrendData as mockClassTrendData,
  studentGrowthData as mockStudentGrowthData,
  averageMarksData as mockAverageMarksData,
  mockStudents,
  performanceInsights as mockPerformanceInsights,
} from "@/data/result-data";

import DatabaseOperations from "@/lib/database-operations";
import { calculateOverviewMetrics } from "@/utils/result-calculations";

/**
 * Data Service - Switch between mock and real database data
 * Set USE_REAL_DATA to true to use actual database queries
 */

const USE_REAL_DATA = true; // Set to true when you want to use real database data

export const DataService = {
  /**
   * Get all data for the results dashboard
   */
  async getAllResultData() {
    if (USE_REAL_DATA) {
      try {
        // Set up proper date ranges for data fetching
        const currentDate = new Date();
        const currentPeriodStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const previousPeriodEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        const previousPeriodStart = new Date(
          previousPeriodEnd.getFullYear(),
          previousPeriodEnd.getMonth(),
          1
        );

        // Use real database operations
        const [
          averageMarksData,
          students,
          classTrendData,
          groupPerformanceData,
          studentGrowthData,
          overviewMetrics,
          performanceInsights,
        ] = await Promise.all([
          DatabaseOperations.getAverageMarksData(
            currentPeriodStart,
            previousPeriodStart,
            previousPeriodEnd
          ),
          DatabaseOperations.getStudentPerformanceData(),
          DatabaseOperations.getClassTrendData(6),
          DatabaseOperations.getGroupPerformanceData(),
          DatabaseOperations.getStudentGrowthData(6),
          DatabaseOperations.getOverviewMetrics(),
          DatabaseOperations.getPerformanceInsights(),
        ]);

        // For classData, we'll derive it from students data
        const classData = students.reduce((acc, student) => {
          const classKey = student.class.toString();
          if (!acc[classKey]) {
            acc[classKey] = {
              students: 0,
              averageScore: 0,
              totalScore: 0,
              groups: student.group ? [student.group] : [],
            };
          }

          acc[classKey].students++;
          acc[classKey].totalScore += student.averageScore;

          // Add unique groups
          if (student.group && !acc[classKey].groups.includes(student.group)) {
            acc[classKey].groups.push(student.group);
          }

          return acc;
        }, {} as any);

        // Calculate averages
        Object.keys(classData).forEach((classKey) => {
          classData[classKey].averageScore = Math.round(
            classData[classKey].totalScore / classData[classKey].students
          );
          delete classData[classKey].totalScore;
        });

        return {
          classData,
          groupPerformanceData,
          classTrendData,
          studentGrowthData,
          averageMarksData,
          students,
          performanceInsights,
          overviewMetrics,
          _dataSource: "DATABASE", // Add marker to identify data source
        };
      } catch (error) {
        console.error("❌ DataService: Error fetching real data:", error);
        console.error(
          "📍 Error details:",
          error instanceof Error ? error.message : String(error)
        );
        // Fall back to mock data if database fails
        const overviewMetrics = calculateOverviewMetrics(
          mockAverageMarksData,
          mockStudents
        );

        return {
          classData: mockClassData,
          groupPerformanceData: mockGroupPerformanceData,
          classTrendData: mockClassTrendData,
          studentGrowthData: mockStudentGrowthData,
          averageMarksData: mockAverageMarksData,
          students: mockStudents,
          performanceInsights: mockPerformanceInsights,
          overviewMetrics,
          _dataSource: "MOCK_FALLBACK", // Add marker to identify data source
        };
      }
    } else {
      // Use mock data
      const overviewMetrics = calculateOverviewMetrics(
        mockAverageMarksData,
        mockStudents
      );

      return {
        classData: mockClassData,
        groupPerformanceData: mockGroupPerformanceData,
        classTrendData: mockClassTrendData,
        studentGrowthData: mockStudentGrowthData,
        averageMarksData: mockAverageMarksData,
        students: mockStudents,
        performanceInsights: mockPerformanceInsights,
        overviewMetrics,
        _dataSource: "MOCK_CONFIGURED", // Add marker to identify data source
      };
    }
  },

  /**
   * Get specific data sets
   */
  async getClassData() {
    const data = await this.getAllResultData();
    return data.classData;
  },

  async getStudentData() {
    const data = await this.getAllResultData();
    return data.students;
  },

  async getOverviewMetrics() {
    const data = await this.getAllResultData();
    return data.overviewMetrics;
  },

  async getPerformanceInsights() {
    const data = await this.getAllResultData();
    return data.performanceInsights;
  },

  /**
   * Toggle between mock and real data
   */
  setUseRealData(useReal: boolean) {
    // In a real implementation, this would be an environment variable
    // For now, you'll need to manually change USE_REAL_DATA constant
  },
};

export default DataService;
