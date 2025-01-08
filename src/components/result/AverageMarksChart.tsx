"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

interface SubjectMarks {
  subject: string;
  current: number;
  previous: number;
}

interface ElectiveSubjects {
  scienceGroup: SubjectMarks[];
  commerceGroup: SubjectMarks[];
  artsGroup: SubjectMarks[];
}

interface ClassData {
  generalSubjects?: SubjectMarks[];
  electiveSubjects?: ElectiveSubjects;
}

interface AverageMarksChartProps {
  data: {
    class7: SubjectMarks[];
    class8: SubjectMarks[];
    class9: ClassData;
    class10: ClassData;
    class11: ClassData;
    class12: ClassData;
  };
}

export function AverageMarksChart({ data }: AverageMarksChartProps) {
  type ClassKey = keyof typeof data;
  const [classSelection, setClassSelection] = useState<ClassKey>("class7");
  const [groupSelection, setGroupSelection] = useState<string>("general");

  const handleClassChange = (value: ClassKey) => {
    setClassSelection(value);
    // Reset group selection when switching to classes 7-8
    if (value === "class7" || value === "class8") {
      setGroupSelection("general");
    }
  };

  const filterDataByClassAndGroup = () => {
    const selectedClassData = data[classSelection];

    if (!selectedClassData) return [];

    // Handle classes 7 and 8 which are SubjectMarks[]
    if (classSelection === "class7" || classSelection === "class8") {
      return selectedClassData as SubjectMarks[];
    }

    // Handle classes 9-12 which are ClassData
    const classData = selectedClassData as ClassData;

    // For classes 11-12, show subjects based on group selection
    if (classSelection === "class11" || classSelection === "class12") {
      if (groupSelection === "general" && classData.generalSubjects) {
        return classData.generalSubjects;
      }

      if (classData.electiveSubjects) {
        switch (groupSelection) {
          case "scienceGroup":
            return classData.electiveSubjects.scienceGroup || [];
          case "commerceGroup":
            return classData.electiveSubjects.commerceGroup || [];
          case "artsGroup":
            return classData.electiveSubjects.artsGroup || [];
          default:
            return [];
        }
      }
      return [];
    }

    // For classes 9-10, show either general or elective subjects
    if (groupSelection === "general" && classData.generalSubjects) {
      return classData.generalSubjects;
    }

    if (classData.electiveSubjects) {
      switch (groupSelection) {
        case "scienceGroup":
          return classData.electiveSubjects.scienceGroup || [];
        case "commerceGroup":
          return classData.electiveSubjects.commerceGroup || [];
        case "artsGroup":
          return classData.electiveSubjects.artsGroup || [];
        default:
          return [];
      }
    }

    return [];
  };

  const renderChart = () => {
    const filteredData = filterDataByClassAndGroup();

    return (
      <BarChart data={filteredData} barSize={window.innerWidth < 600 ? 9 : 12} width={800} height={400}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#ddd"
        />
        <XAxis
          dataKey="subject"
          axisLine={false}
          tick={{ fill: "#d1d5db", fontSize: 9 }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
        />
        <Bar
          dataKey="current"
          fill="#FAE27C"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="previous"
          fill="#C3EBFA"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    );
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className=" flex justify-between items-center flex-col md:flex-row gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Average Marks Comparison
            </CardTitle>
            <CardDescription>Current vs Previous Month</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select
              value={classSelection}
              onValueChange={(value) => handleClassChange(value as ClassKey)}
            >
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class7">Class 7</SelectItem>
                <SelectItem value="class8">Class 8</SelectItem>
                <SelectItem value="class9">Class 9</SelectItem>
                <SelectItem value="class10">Class 10</SelectItem>
                <SelectItem value="class11">Class 11</SelectItem>
                <SelectItem value="class12">Class 12</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={groupSelection}
              onValueChange={setGroupSelection}
              disabled={
                classSelection === "class7" || classSelection === "class8"
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Subjects</SelectItem>
                <SelectItem value="scienceGroup">Science Group</SelectItem>
                <SelectItem value="commerceGroup">Commerce Group</SelectItem>
                <SelectItem value="artsGroup">Arts Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <div className="w-full h-full">
        <CardContent className="md:-left-3 -left-5 relative p-0">
          {filterDataByClassAndGroup().length > 0 ? (
            <ChartContainer
              config={{
                current: {
                  label: "Current Month",
                  color: "hsl(var(--chart-1))",
                },
                previous: {
                  label: "Previous Month",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px] w-full"
            >
              {renderChart()}
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-sm sm:text-base">
              No data available
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
