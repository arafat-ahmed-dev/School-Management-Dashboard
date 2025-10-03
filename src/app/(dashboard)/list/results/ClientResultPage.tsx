"use client";

import { AverageMarksChart } from "@/components/result/AverageMarksChart";
import { ClassAndGroupPerformance } from "@/components/result/ClassAndGroupPerformance";
import { ClassLevelOverview } from "@/components/result/ClassLevelOverview";
import { OverviewCards } from "@/components/result/OverviewCards";
import { PerformanceInsights } from "@/components/result/PerformanceInsights";
import { StudentGrowthChart } from "@/components/result/StudentGrowthChart";
import StudentPerformanceTable from "@/components/result/StudentPerformanceTable";

interface ClientResultPageProps {
    initialData: any;
}

const ClientResultPage = ({ initialData }: ClientResultPageProps) => {

    return (
        <div className="m-2 mt-0 flex-1 rounded-md bg-white text-base md:m-4 md:p-4 md:text-lg">
            {/* Dashboard Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl dark:text-white">
                    Student Results Dashboard
                </h1>
            </div>
            <OverviewCards
                currentAverage={initialData.overviewMetrics.currentAverage}
                growthPercentage={initialData.overviewMetrics.growthPercentage}
                totalStudents={initialData.overviewMetrics.totalStudents}
                topSubject={initialData.overviewMetrics.topSubject}
                topSubjectScore={initialData.overviewMetrics.topSubjectScore}
            />
            <div className="mb-6 grid w-full grid-cols-1 gap-6">
                <StudentGrowthChart data={initialData.studentGrowthData} />
                <AverageMarksChart data={initialData.averageMarksData} />
            </div>

            <PerformanceInsights insights={initialData.performanceInsights} />

            <ClassAndGroupPerformance
                classTrendData={initialData.classTrendData}
                groupPerformanceData={initialData.groupPerformanceData}
            />
            <ClassLevelOverview classData={initialData.classData} />

            <StudentPerformanceTable mockStudents={initialData.students} />
        </div>
    );
};

export default ClientResultPage;