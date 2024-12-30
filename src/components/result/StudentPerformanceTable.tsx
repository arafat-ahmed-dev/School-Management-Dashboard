"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function StudentPerformanceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [scoreRange, setScoreRange] = useState([0, 100]);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (gradeFilter === "All" || student.grade === gradeFilter) &&
        (classFilter === "All" || student.class.toString() === classFilter) &&
        (groupFilter === "All" ||
          student.group === groupFilter ||
          student.class < 10) &&
        student.averageScore >= scoreRange[0] &&
        student.averageScore <= scoreRange[1]
    );
  }, [searchTerm, gradeFilter, classFilter, groupFilter, scoreRange]);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Student Performance
        </CardTitle>
        <CardDescription>Individual student results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Grades</SelectItem>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Classes</SelectItem>
              {[7, 8, 9, 10, 11, 12].map((classNum) => (
                <SelectItem key={classNum} value={classNum.toString()}>
                  Class {classNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Groups</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Commerce">Commerce</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 min-w-[200px]">
            <Slider
              min={0}
              max={100}
              step={1}
              value={scoreRange}
              onValueChange={setScoreRange}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">
              Score Range: {scoreRange[0]} - {scoreRange[1]}
            </div>
          </div>
        </div>
        <ScrollArea className="h-[400px] w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Grade</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Group</th>
                <th className="px-4 py-2 text-left">Average Score</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.grade}</td>
                  <td className="px-4 py-2">{student.class}</td>
                  <td className="px-4 py-2">{student.group || "N/A"}</td>
                  <td className="px-4 py-2">{student.averageScore}</td>
                  <td className="px-4 py-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {student.name}'s Performance
                          </DialogTitle>
                          <DialogDescription>
                            Detailed view of student's scores
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">
                            Subject Scores:
                          </h4>
                          {Object.entries(student.subjects).map(
                            ([subject, score]) => (
                              <div
                                key={subject}
                                className="flex justify-between items-center mb-2"
                              >
                                <span>{subject}:</span>
                                <Badge
                                  variant={
                                    score >= 80
                                      ? "default"
                                      : score >= 70
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {score}
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
