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

// Mock data (you would typically fetch this from an API)
const classData = {
  7: { students: 120, averageScore: 78 },
  8: { students: 125, averageScore: 80 },
  9: { students: 130, averageScore: 81 },
  10: {
    groups: ["Science", "Commerce", "Arts"],
    students: 150,
    averageScore: 82,
  },
  11: {
    groups: ["Science", "Commerce", "Arts"],
    students: 130,
    averageScore: 79,
  },
  12: {
    groups: ["Science", "Commerce", "Arts"],
    students: 120,
    averageScore: 85,
  },
};

const groupPerformanceData = [
  { group: "Science", class10: 85, class11: 82, class12: 88 },
  { group: "Commerce", class10: 80, class11: 78, class12: 83 },
  { group: "Arts", class10: 82, class11: 77, class12: 84 }
];

const classTrendData = [
  {
    month: "Jan",
    class7: 75,
    class8: 76,
    class9: 77,
    class10: 78,
    class11: 75,
    class12: 82,
  },
  {
    month: "Feb",
    class7: 76,
    class8: 77,
    class9: 78,
    class10: 80,
    class11: 76,
    class12: 83,
  },
  {
    month: "Mar",
    class7: 77,
    class8: 78,
    class9: 79,
    class10: 82,
    class11: 78,
    class12: 85,
  },
  {
    month: "Apr",
    class7: 76,
    class8: 77,
    class9: 78,
    class10: 81,
    class11: 77,
    class12: 84,
  },
  {
    month: "May",
    class7: 78,
    class8: 79,
    class9: 80,
    class10: 83,
    class11: 79,
    class12: 86,
  },
  {
    month: "Jun",
    class7: 79,
    class8: 80,
    class9: 81,
    class10: 85,
    class11: 80,
    class12: 88,
  }
];

const studentGrowthData = [
  { month: "Jan", growth: 2 },
  { month: "Feb", growth: 3 },
  { month: "Mar", growth: 5 },
  { month: "Apr", growth: 4 },
  { month: "May", growth: 7 },
  { month: "Jun", growth: 6 },
];

const averageMarksData = {
  // Class 7
  class7: [
    { subject: "Bang-1", current: 85, previous: 82 },
    { subject: "Bang-2", current: 82, previous: 79 },
    { subject: "Eng-1", current: 78, previous: 80 },
    { subject: "Eng-2", current: 84, previous: 82 },
    { subject: "Math", current: 88, previous: 85 },
    { subject: "GenSci", current: 86, previous: 84 },
    { subject: "BGSt", current: 79, previous: 77 },
    { subject: "ICT", current: 88, previous: 85 },
    { subject: "Rel&MorEd", current: 80, previous: 78 },
  ],

  // Class 8
  class8: [
    { subject: "Bang-1", current: 85, previous: 82 },
    { subject: "Bang-2", current: 82, previous: 79 },
    { subject: "Eng-1", current: 78, previous: 80 },
    { subject: "Eng-2", current: 84, previous: 82 },
    { subject: "Math", current: 88, previous: 85 },
    { subject: "GenSci", current: 86, previous: 84 },
    { subject: "BGSt", current: 79, previous: 77 },
    { subject: "ICT", current: 88, previous: 85 },
    { subject: "Rel&MorEd", current: 80, previous: 78 },
  ],

  // Class 9 (SSC Start)
  class9: {
    generalSubjects: [
      { subject: "Bang-1", current: 85, previous: 82 },
      { subject: "Bang-2", current: 82, previous: 79 },
      { subject: "Eng-1", current: 78, previous: 80 },
      { subject: "Eng-2", current: 84, previous: 82 },
      { subject: "Math", current: 88, previous: 85 },
      { subject: "GenSci", current: 86, previous: 84 },
      { subject: "BGSt", current: 79, previous: 77 },
      { subject: "ICT", current: 88, previous: 85 },
      { subject: "Rel&MorEd", current: 80, previous: 78 },
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
      { subject: "Bang-1", current: 85, previous: 82 },
      { subject: "Bang-2", current: 82, previous: 79 },
      { subject: "Eng-1", current: 78, previous: 80 },
      { subject: "Eng-2", current: 84, previous: 82 },
      { subject: "Math", current: 88, previous: 85 },
      { subject: "GenSci", current: 86, previous: 84 },
      { subject: "BGSt", current: 79, previous: 77 },
      { subject: "ICT", current: 88, previous: 85 },
      { subject: "Rel&MorEd", current: 80, previous: 78 },
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
      { subject: "Bang-1", current: 85, previous: 82 },
      { subject: "Bang-2", current: 82, previous: 79 },
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
      { subject: "Bang-1", current: 85, previous: 82 },
      { subject: "Bang-2", current: 82, previous: 79 },
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


const mockStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    grade: "A",
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
];
const performanceInsights = [
  "Overall student performance has improved by 5% compared to last month.",
  "Math scores show the highest improvement, with a 7% increase.",
  "20% of students have shown significant progress in their weakest subject.",
  "Attention needed: Science scores have slightly declined for grade B students.",
];


const currentAverage =
  Object.values(averageMarksData)
    .flatMap(
      (classData: any) =>
        classData.generalSubjects
          ? classData.generalSubjects // For classes with generalSubjects
          : classData.subjects || [] // Fallback for classes with flat structure
    )
    .reduce((sum, subject: any) => sum + subject.current, 0) /
  Object.values(averageMarksData).flatMap((classData: any) =>
    classData.generalSubjects
      ? classData.generalSubjects
      : classData.subjects || []
  ).length;

const previousAverage =
  Object.values(averageMarksData)
    .flatMap((classData: any) =>
      classData.generalSubjects
        ? classData.generalSubjects
        : classData.subjects || []
    )
    .reduce((sum, subject: any) => sum + subject.previous, 0) /
  Object.values(averageMarksData).flatMap((classData: any) =>
    classData.generalSubjects
      ? classData.generalSubjects
      : classData.subjects || []
  ).length;

const growthPercentage =
  ((currentAverage - previousAverage) / previousAverage) * 100;



const ResultPage = () => {
  const [dateRange, setDateRange] = useState("This Month");
  const handleDownload = (format: string) => {
    // Placeholder for download functionality
    console.log(`Downloading report in ${format} format`);
    // In a real application, this would trigger a backend request to generate and serve the file
  };

  return (
    <div className="bg-white md:p-4 rounded-md flex-1 m-2 md:m-4 mt-0">
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
      <div className="grid grid-cols-1 gap-6 mb-6 w-full">
        <StudentGrowthChart data={studentGrowthData} />
        <AverageMarksChart
          data={averageMarksData}
        />
      </div>

      <PerformanceInsights insights={performanceInsights} />

      <ClassAndGroupPerformance
        classTrendData={classTrendData}
        groupPerformanceData={groupPerformanceData}
      />
      <ClassLevelOverview classData={classData} />

      <StudentPerformanceTable />
    </div>
  );
};

export default ResultPage;
