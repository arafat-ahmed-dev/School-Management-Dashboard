"use client";

import { AverageMarksChart } from "@/components/result/AverageMarksChart";
import { ClassAndGroupPerformance } from "@/components/result/ClassAndGroupPerformance";
import { ClassLevelOverview } from "@/components/result/ClassLevelOverview";
import { Header } from "@/components/result/Header";
import { OverviewCards } from "@/components/result/OverviewCards";
import { PerformanceInsights } from "@/components/result/PerformanceInsights";
import { StudentGrowthChart } from "@/components/result/StudentGrowthChart";
import StudentPerformanceTable from "@/components/result/StudentPerformanceTable";
import { useState } from "react";

// Import data and utilities
import {
  classData,
  groupPerformanceData,
  classTrendData,
  studentGrowthData,
  averageMarksData,
  mockStudents,
  performanceInsights,
} from "@/data/result-data";
import { calculateOverviewMetrics } from "@/utils/result-calculations";

const ResultPage = () => {
  const [dateRange, setDateRange] = useState("This Month");

  // Calculate overview metrics using utility functions
  const overviewMetrics = calculateOverviewMetrics(averageMarksData, mockStudents);

  const handleDownload = (format: string) => {
    // Placeholder for download functionality
    console.log(`Downloading report in ${format} format`);
    // In a real application, this would trigger a backend request to generate and serve the file
  };

  return (
    <div className="m-2 mt-0 flex-1 rounded-md bg-white text-base md:m-4 md:p-4 md:text-lg">
      <Header
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleDownload={handleDownload}
      />
      <OverviewCards
        currentAverage={overviewMetrics.currentAverage}
        growthPercentage={overviewMetrics.growthPercentage}
        totalStudents={overviewMetrics.totalStudents}
        topSubject={overviewMetrics.topSubject}
        topSubjectScore={overviewMetrics.topSubjectScore}
      />
      <div className="mb-6 grid w-full grid-cols-1 gap-6">
        <StudentGrowthChart data={studentGrowthData} />
        <AverageMarksChart data={averageMarksData} />
      </div>

      <PerformanceInsights insights={performanceInsights} />

      <ClassAndGroupPerformance
        classTrendData={classTrendData}
        groupPerformanceData={groupPerformanceData}
      />
      <ClassLevelOverview classData={classData} />

      <StudentPerformanceTable mockStudents={mockStudents} />
    </div>
  );
};

export default ResultPage;
