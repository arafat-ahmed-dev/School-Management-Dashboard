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

// Define types for subjects and score range
interface Subjects {
  Math: number;
  Science: number;
  English: number;
  History: number;
  Art: number;
}

interface Student {
  id: number;
  name: string;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  class: number;
  group?: "Science" | "Commerce" | "Arts" | "N/A";
  averageScore: number;
  subjects: Subjects;
}

interface StudentPerformanceTableProps {
  mockStudents: Student[];
}

export default function StudentPerformanceTable({
  mockStudents,
}: StudentPerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState<
    "All" | "A+" | "A" | "B" | "C" | "D" | "F"
  >("All");
  const [classFilter, setClassFilter] = useState<"All" | string>("All");
  const [groupFilter, setGroupFilter] = useState<"All" | string>("All");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredStudents = useMemo(() => {
    const filtered = mockStudents.filter(
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

    return filtered.sort((a, b) =>
      sortOrder === "desc"
        ? b.averageScore - a.averageScore
        : a.averageScore - b.averageScore
    );
  }, [
    mockStudents, // Ensure mockStudents is included in the dependency array
    searchTerm,
    gradeFilter,
    classFilter,
    groupFilter,
    scoreRange,
    sortOrder,
  ]);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl font-semibold">
          Student Performance
        </CardTitle>
        <CardDescription>Individual student results</CardDescription>
      </CardHeader>
      <CardContent className="py-0 px-2 md:px-6">
        <div className="flex flex-wrap gap-4 mb-4 justify-center md:justify-start md:flex-row">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={gradeFilter}
            onValueChange={(value) =>
              setGradeFilter(
                value as "All" | "A+" | "A" | "B" | "C" | "D" | "F"
              )
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Grades</SelectItem>
              <SelectItem value="A+">Grade A+</SelectItem>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
              <SelectItem value="D">Grade D</SelectItem>
              <SelectItem value="F">Grade F</SelectItem>
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
          <Select
            value={groupFilter}
            onValueChange={setGroupFilter}
            disabled={classFilter === "7" || classFilter === "8"}
          >
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
              onValueChange={(value: [number, number]) => setScoreRange(value)} // Ensure the type matches [number, number]
              className="w-full mb-2 md:mb-0"
            />
            <div className="text-sm text-gray-500 mt-1">
              Score Range: {scoreRange[0]} - {scoreRange[1]}
            </div>
          </div>
        </div>
        <ScrollArea className="h-[400px] w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs sm:text-sm md:text-base">
                <th className="md:px-4 py-2 text-left">Name</th>
                <th className="md:px-4 py-2 text-left  hidden md:table-cell p-2">
                  Grade
                </th>
                <th className="md:px-4 py-2 text-left">Class</th>
                <th className="md:px-4 py-2 text-left hidden md:table-cell p-2">
                  Group
                </th>
                <th className="md:px-4 py-2 text-left">
                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                    }
                    className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                  >
                    Average Score
                    {sortOrder === "desc" ? "▼" : "▲"}
                  </button>
                </th>
                <th className="md:px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b text-[12px] md:text-base"
                >
                  <td className="md:px-4 py-2">{student.name}</td>
                  <td className="md:px-4 py-2  hidden md:table-cell p-2">
                    {student.grade}
                  </td>
                  <td className="md:px-4 py-2 text-center md:text-left">
                    {student.class}
                  </td>
                  <td className="md:px-4 py-2  hidden md:table-cell p-2">
                    {student.group || "N/A"}
                  </td>
                  <td className="md:px-4 py-2 text-center md:text-left">
                    {student.averageScore}
                  </td>
                  <td className="md:px-4 py-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm px-1"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-lg sm:text-xl">
                            {student.name}&apos;s Performance
                          </DialogTitle>
                          <DialogDescription className="text-sm sm:text-base">
                            Detailed view of student&apos;s scores
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <h4 className="text-base sm:text-lg font-semibold mb-2">
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
