import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookOpenIcon,
  GraduationCapIcon,
  TrendingUpIcon,
} from "lucide-react";

interface OverviewCardsProps {
  currentAverage: number;
  growthPercentage: number;
  totalStudents: number;
  topSubject: string;
  topSubjectScore: number;
}

export function OverviewCards({
  currentAverage,
  growthPercentage,
  totalStudents,
  topSubject,
  topSubjectScore,
}: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center space-x-2">
          <BookOpenIcon className="w-8 h-8 text-blue-500" />
          <div>
            <CardTitle className="text-lg sm:text-xl">Average Marks</CardTitle>
            <CardDescription className="text-sm sm:text-base">Current vs Previous Month</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">
            {currentAverage.toFixed(1)}%
          </div>
          <p className="text-sm mt-2">
            {growthPercentage > 0 ? (
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                {growthPercentage.toFixed(1)}% increase
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <ArrowDownIcon className="w-4 h-4 mr-1" />
                {Math.abs(growthPercentage).toFixed(1)}% decrease
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center space-x-2">
          <GraduationCapIcon className="w-8 h-8 text-green-500" />
          <div>
            <CardTitle className="text-lg sm:text-xl">Total Students</CardTitle>
            <CardDescription className="text-sm sm:text-base">Enrolled this month</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {totalStudents}
          </div>
          <p className="text-sm mt-2">
            <span className="text-green-600 flex items-center">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              5.2% increase from last month
            </span>
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center space-x-2">
          <TrendingUpIcon className="w-8 h-8 text-purple-500" />
          <div>
            <CardTitle className="text-lg sm:text-xl">Top Performing Subject</CardTitle>
            <CardDescription className="text-sm sm:text-base">Based on average scores</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{topSubject}</div>
          <p className="text-sm mt-2">{topSubjectScore}% average score</p>
        </CardContent>
      </Card>
    </div>
  );
}
