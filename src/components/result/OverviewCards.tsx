import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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
    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center space-x-2">
          <BookOpenIcon className="size-8 text-blue-500" />
          <div>
            <CardTitle className="text-lg sm:text-xl">Average Marks</CardTitle>
            <CardDescription className="text-sm sm:text-base">Current vs Previous Month</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
            {currentAverage.toFixed(1)}%
          </div>
          <p className="mt-2 text-sm">
            <span className={`${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}% from last month
            </span>
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center space-x-2">
          <GraduationCapIcon className="size-8 text-green-500" />
          <div>
            <CardTitle className="text-lg sm:text-xl">Total Students</CardTitle>
            <CardDescription className="text-sm sm:text-base">Enrolled this month</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 sm:text-3xl">
            {totalStudents}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center space-x-2">
          <TrendingUpIcon className="size-8 text-purple-500" />
          <div>
            <CardTitle className="text-lg sm:text-xl">Top Performing Subject</CardTitle>
            <CardDescription className="text-sm sm:text-base">Based on average scores</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 sm:text-3xl">{topSubject}</div>
          <p className="mt-2 text-sm">{topSubjectScore}% average score</p>
        </CardContent>
      </Card>
    </div>
  );
}
