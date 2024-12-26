"use client";
import { Header } from "@/components/result/Header";
import { OverviewCards } from "@/components/result/OverviewCards";
import { useState } from "react";

// Mock data (you would typically fetch this from an API)
const classData = {
  7: { students: 120, averageScore: 78 },
  8: { students: 125, averageScore: 80 },
  9: { students: 130, averageScore: 81 },
  10: { groups: ['Science', 'Commerce', 'Arts'], students: 150, averageScore: 82 },
  11: { groups: ['Science', 'Commerce', 'Arts'], students: 130, averageScore: 79 },
  12: { groups: ['Science', 'Commerce', 'Arts'], students: 120, averageScore: 85 },
}

const groupPerformanceData = [
  { group: 'Science', class10: 85, class11: 82, class12: 88 },
  { group: 'Commerce', class10: 80, class11: 78, class12: 83 },
  { group: 'Arts', class10: 82, class11: 77, class12: 84 },
]

const classTrendData = [
  { month: 'Jan', class7: 75, class8: 76, class9: 77, class10: 78, class11: 75, class12: 82 },
  { month: 'Feb', class7: 76, class8: 77, class9: 78, class10: 80, class11: 76, class12: 83 },
  { month: 'Mar', class7: 77, class8: 78, class9: 79, class10: 82, class11: 78, class12: 85 },
  { month: 'Apr', class7: 76, class8: 77, class9: 78, class10: 81, class11: 77, class12: 84 },
  { month: 'May', class7: 78, class8: 79, class9: 80, class10: 83, class11: 79, class12: 86 },
  { month: 'Jun', class7: 79, class8: 80, class9: 81, class10: 85, class11: 80, class12: 88 },
]

const studentGrowthData = [
  { month: 'Jan', growth: 2 },
  { month: 'Feb', growth: 3 },
  { month: 'Mar', growth: 5 },
  { month: 'Apr', growth: 4 },
  { month: 'May', growth: 7 },
  { month: 'Jun', growth: 6 },
]

const averageMarksData = [
  { subject: 'Math', current: 85, previous: 82 },
  { subject: 'Science', current: 78, previous: 80 },
  { subject: 'English', current: 82, previous: 79 },
  { subject: 'History', current: 76, previous: 75 },
  { subject: 'Art', current: 90, previous: 88 },
]

const mockStudents = [
  { id: 1, name: "Alice Johnson", grade: "A", class: 10, group: "Science", averageScore: 92, subjects: { Math: 95, Science: 88, English: 90, History: 89, Art: 98 } },
  { id: 2, name: "Bob Smith", grade: "B", class: 11, group: "Commerce", averageScore: 85, subjects: { Math: 82, Science: 85, English: 88, History: 80, Art: 90 } },
  { id: 3, name: "Charlie Brown", grade: "C", class: 8, averageScore: 78, subjects: { Math: 75, Science: 80, English: 76, History: 78, Art: 81 } },
  { id: 4, name: "Diana Ross", grade: "A", class: 12, group: "Arts", averageScore: 95, subjects: { Math: 98, Science: 92, English: 95, History: 93, Art: 97 } },
  { id: 5, name: "Ethan Hunt", grade: "B", class: 9, averageScore: 88, subjects: { Math: 85, Science: 90, English: 87, History: 86, Art: 92 } },
]

  const currentAverage =
    averageMarksData.reduce((sum, subject) => sum + subject.current, 0) /
    averageMarksData.length;
  const previousAverage =
    averageMarksData.reduce((sum, subject) => sum + subject.previous, 0) /
    averageMarksData.length;
  const growthPercentage =
    ((currentAverage - previousAverage) / previousAverage) * 100;

const ResultPage = () => {
  const [dateRange, setDateRange] = useState
  ("This Month");
  const [chartType, setChartType] = useState("bar");
   const handleDownload = (format: string) => {
     // Placeholder for download functionality
     console.log(`Downloading report in ${format} format`);
     // In a real application, this would trigger a backend request to generate and serve the file
   };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <Header
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleDownload={handleDownload}
      />
      <OverviewCards
        currentAverage={currentAverage}
        growthPercentage={growthPercentage}
        totalStudents={1234}
        topSubject="Art"
        topSubjectScore={90}
      />
      <div className="grid grid-cols-1 gap-6 mb-6">
        
      </div>
    </div>
  );
}

export default ResultPage