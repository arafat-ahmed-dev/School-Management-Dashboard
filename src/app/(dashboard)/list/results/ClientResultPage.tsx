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

interface ClientResultPageProps {
    initialData: any;
}

const ClientResultPage = ({ initialData }: ClientResultPageProps) => {
    const [dateRange, setDateRange] = useState("This Month");

    const handleDownload = (format: string) => {
        // Placeholder for download functionality
        console.log(`Downloading report in ${format} format`);
        // In a real application, this would trigger a backend request to generate and serve the file
    };

    return (
        <div className="m-2 mt-0 flex-1 rounded-md bg-white text-base md:m-4 md:p-4 md:text-lg">
            {/* Data Source Indicator */}
            <div className={`mb-4 rounded-md px-3 py-2 text-sm font-medium ${initialData._dataSource === 'DATABASE'
                    ? 'bg-green-100 text-green-800'
                    : initialData._dataSource === 'MOCK_FALLBACK'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                }`}>
                📊 Data Source: {
                    initialData._dataSource === 'DATABASE' ? '🗄️ Live Database' :
                        initialData._dataSource === 'MOCK_FALLBACK' ? '⚠️ Mock Data (Database Error)' :
                            '🧪 Mock Data (Configured)'
                }
                {initialData._dataSource === 'DATABASE' && ` | Students: ${initialData.students?.length || 0}`}
            </div>

            <Header
                dateRange={dateRange}
                setDateRange={setDateRange}
                handleDownload={handleDownload}
            />
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