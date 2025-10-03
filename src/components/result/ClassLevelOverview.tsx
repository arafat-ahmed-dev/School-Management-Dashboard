import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ClassData {
  [key: string]: {
    students: number;
    averageScore: number;
    groups?: string[];
  };
}

interface ClassLevelOverviewProps {
  classData: ClassData;
}

export function ClassLevelOverview({ classData }: ClassLevelOverviewProps) {
  const [selectedClass, setSelectedClass] = useState<string>("7");

  return (
    <Card className="mb-6 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold sm:text-xl">
          Class-Level Overview
        </CardTitle>
        <CardDescription>Performance summary for each class</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Class Selection Dropdown */}
        <div className="mb-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(classData).map((classNum) => (
                <SelectItem key={classNum} value={classNum}>
                  Class {classNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Class Data Content */}
        {classData[selectedClass] && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold sm:text-2xl">
                  {classData[selectedClass].students}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold sm:text-2xl">
                  {classData[selectedClass].averageScore}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {classData[selectedClass].groups ? (
                    classData[selectedClass].groups.map((group) => (
                      <Badge key={group} variant="secondary">
                        {group}
                      </Badge>
                    ))
                  ) : (
                    <p>No groups for this class</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
