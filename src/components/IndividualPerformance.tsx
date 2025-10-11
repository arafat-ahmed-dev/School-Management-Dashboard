"use client";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

interface PerformanceData {
    name: string;
    value: number;
    fill: string;
}

interface PerformanceProps {
    type?: 'student' | 'teacher' | 'default';
    data?: {
        averageScore?: number;
        attendancePercentage?: number;
        totalScores?: number;
        maxScore?: number;
    };
    studentId?: string;
    teacherId?: string;
}

const Performance = ({
    type = 'default',
    data,
    studentId,
    teacherId
}: PerformanceProps) => {
    // Default data for fallback
    const defaultData: PerformanceData[] = [
        { name: "Performance", value: 92, fill: "#C3EBFA" },
        { name: "Remaining", value: 8, fill: "#FAE27C" },
    ];

    // Calculate performance data based on type and provided data
    let performanceData: PerformanceData[] = defaultData;
    let performanceScore = 9.2;
    let performanceLabel = "of 10 max LTS";
    let chartTitle = "Performance";

    if (type === 'student' && data) {
        const score = data.averageScore || 0;
        const remaining = Math.max(0, 100 - score);

        performanceData = [
            { name: "Achievement", value: score, fill: "#C3EBFA" },
            { name: "Potential", value: remaining, fill: "#FAE27C" },
        ];

        performanceScore = score / 10; // Convert to 0-10 scale
        performanceLabel = "Average Score";
        chartTitle = "Academic Performance";
    } else if (type === 'teacher' && data) {
        const attendance = data.attendancePercentage || 0;
        const remaining = Math.max(0, 100 - attendance);

        performanceData = [
            { name: "Class Attendance", value: attendance, fill: "#C3EBFA" },
            { name: "Absence", value: remaining, fill: "#FAE27C" },
        ];

        performanceScore = attendance / 10; // Convert to 0-10 scale
        performanceLabel = "Class Attendance";
        chartTitle = "Teaching Performance";
    }

    return (
        <div className="relative h-80 rounded-md bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">{chartTitle}</h1>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        fill="#8884d8"
                    >
                        {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="text-3xl font-bold">
                    {type === 'default' ? performanceScore.toFixed(1) : `${Math.round(performanceScore * 10)}%`}
                </h1>
                <p className="text-xs text-gray-300">{performanceLabel}</p>
            </div>
            <h2 className="absolute inset-x-0 bottom-16 m-auto text-center font-medium">
                {type === 'student' && "Academic Progress"}
                {type === 'teacher' && "Teaching Effectiveness"}
                {type === 'default' && "1st Semester - 2nd Semester"}
            </h2>
        </div>
    );
};

export default Performance;