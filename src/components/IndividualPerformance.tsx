"use client";
import { PieChart, Pie, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import {
    calculateStudentAcademicPerformance,
    calculateStudentActivityMetrics,
    calculateTeachingPerformanceMetrics,
    AcademicPerformanceMetrics,
    StudentActivityMetrics,
    TeachingPerformanceMetrics
} from "@/lib/performance-analytics";

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
    const [detailedMetrics, setDetailedMetrics] = useState<{
        academic?: AcademicPerformanceMetrics;
        activity?: StudentActivityMetrics;
        teaching?: TeachingPerformanceMetrics;
    }>({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'trends' | 'activity'>('overview');

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

    useEffect(() => {
        const fetchDetailedMetrics = async () => {
            if (!studentId && !teacherId) return;

            setLoading(true);
            try {
                if (type === 'student' && studentId) {
                    const [academic, activity] = await Promise.all([
                        calculateStudentAcademicPerformance(studentId),
                        calculateStudentActivityMetrics(studentId)
                    ]);
                    setDetailedMetrics({ academic, activity });
                } else if (type === 'teacher' && teacherId) {
                    const teaching = await calculateTeachingPerformanceMetrics(teacherId);
                    setDetailedMetrics({ teaching });
                }
            } catch (error) {
                console.error('Error fetching detailed metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailedMetrics();
    }, [studentId, teacherId, type]);

    if (type === 'student' && data) {
        const score = data.averageScore || detailedMetrics.academic?.averageScore || 0;
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
        const effectiveness = detailedMetrics.teaching?.overallEffectiveness || attendance;
        const remaining = Math.max(0, 100 - effectiveness);

        performanceData = [
            { name: "Effectiveness", value: effectiveness, fill: "#C3EBFA" },
            { name: "Growth Area", value: remaining, fill: "#FAE27C" },
        ];

        performanceScore = effectiveness / 10; // Convert to 0-10 scale
        performanceLabel = "Teaching Effectiveness";
        chartTitle = "Teaching Performance";
    }

    const renderOverview = () => (
        <div className="space-y-4">
            <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        fill="#8884d8"
                    >
                        {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="text-center">
                <h1 className="text-2xl font-bold">
                    {type === 'default' ? performanceScore.toFixed(1) : `${Math.round(performanceScore * 10)}%`}
                </h1>
                <p className="text-xs text-gray-500">{performanceLabel}</p>
            </div>

            {/* Key Metrics */}
            {type === 'student' && detailedMetrics.academic && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-blue-50 p-2">
                        <div className="font-semibold">Grade</div>
                        <div className="text-lg">{detailedMetrics.academic.overallGrade}</div>
                    </div>
                    <div className="rounded bg-green-50 p-2">
                        <div className="font-semibold">Attendance</div>
                        <div className="text-lg">{detailedMetrics.academic.attendanceCorrelation}%</div>
                    </div>
                    <div className="rounded bg-yellow-50 p-2">
                        <div className="font-semibold">Assignments</div>
                        <div className="text-lg">{detailedMetrics.academic.assignmentCompletionRate}%</div>
                    </div>
                    <div className="rounded bg-purple-50 p-2">
                        <div className="font-semibold">Subjects</div>
                        <div className="text-lg">{detailedMetrics.academic.subjectPerformance.length}</div>
                    </div>
                </div>
            )}

            {type === 'teacher' && detailedMetrics.teaching && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-blue-50 p-2">
                        <div className="font-semibold">Effectiveness</div>
                        <div className="text-lg">{Math.round(detailedMetrics.teaching.overallEffectiveness)}%</div>
                    </div>
                    <div className="rounded bg-green-50 p-2">
                        <div className="font-semibold">Students</div>
                        <div className="text-lg">{detailedMetrics.teaching.studentProgressMetrics.length}</div>
                    </div>
                    <div className="rounded bg-yellow-50 p-2">
                        <div className="font-semibold">Classes</div>
                        <div className="text-lg">{detailedMetrics.teaching.classPerformanceImprovement.length}</div>
                    </div>
                    <div className="rounded bg-purple-50 p-2">
                        <div className="font-semibold">Rating</div>
                        <div className="text-lg">{detailedMetrics.teaching.studentFeedbackSummary.averageRating.toFixed(1)}</div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderSubjects = () => {
        if (type !== 'student' || !detailedMetrics.academic) return null;

        const subjectData = detailedMetrics.academic.subjectPerformance.slice(0, 5).map(subject => ({
            name: subject.subjectCode,
            score: subject.averageScore,
            trend: subject.trend
        }));

        return (
            <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={subjectData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#C3EBFA" />
                    </BarChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                    {detailedMetrics.academic.subjectPerformance.slice(0, 3).map((subject, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                            <span className="font-medium">{subject.subjectName}</span>
                            <div className="flex items-center gap-2">
                                <span>{subject.averageScore}%</span>
                                <span className={`rounded px-1 text-xs ${subject.trend === 'improving' ? 'bg-green-100 text-green-600' :
                                        subject.trend === 'declining' ? 'bg-red-100 text-red-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {subject.trend === 'improving' ? '↗' :
                                        subject.trend === 'declining' ? '↘' : '→'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderTrends = () => {
        if (type !== 'student' || !detailedMetrics.academic) return null;

        return (
            <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={detailedMetrics.academic.performanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="averageScore" fill="#C3EBFA" />
                        <Bar dataKey="attendanceRate" fill="#FAE27C" />
                    </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-blue-50 p-2">
                        <div className="font-semibold">Strengths</div>
                        <div className="text-xs">{detailedMetrics.academic.strengths.length} areas</div>
                    </div>
                    <div className="rounded bg-orange-50 p-2">
                        <div className="font-semibold">Improvements</div>
                        <div className="text-xs">{detailedMetrics.academic.improvementAreas.length} areas</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderActivity = () => {
        if (type !== 'student' || !detailedMetrics.activity) return null;

        const activityData = [
            { name: 'Participation', value: detailedMetrics.activity.participationScore },
            { name: 'Submission Quality', value: detailedMetrics.activity.assignmentSubmissionPattern.qualityScore },
            { name: 'Peer Interaction', value: detailedMetrics.activity.peerInteractionScore }
        ];

        return (
            <div className="space-y-4">
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={9} />
                        <YAxis fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#C3EBFA" />
                    </BarChart>
                </ResponsiveContainer>

                <div className="space-y-2 text-xs">
                    {detailedMetrics.activity.behavioralMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span>{metric.metric}</span>
                            <span className="font-semibold">{metric.score}%</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="relative rounded-md bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold">{chartTitle}</h1>
                {loading && <div className="text-xs text-gray-500">Loading...</div>}
            </div>

            {/* Tab Navigation for detailed view */}
            {(detailedMetrics.academic || detailedMetrics.activity || detailedMetrics.teaching) && (
                <div className="mb-4 flex space-x-1 rounded bg-gray-100 p-1 text-xs">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`rounded px-2 py-1 ${activeTab === 'overview' ? 'bg-white shadow' : ''}`}
                    >
                        Overview
                    </button>
                    {type === 'student' && detailedMetrics.academic && (
                        <>
                            <button
                                onClick={() => setActiveTab('subjects')}
                                className={`rounded px-2 py-1 ${activeTab === 'subjects' ? 'bg-white shadow' : ''}`}
                            >
                                Subjects
                            </button>
                            <button
                                onClick={() => setActiveTab('trends')}
                                className={`rounded px-2 py-1 ${activeTab === 'trends' ? 'bg-white shadow' : ''}`}
                            >
                                Trends
                            </button>
                            {detailedMetrics.activity && (
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className={`rounded px-2 py-1 ${activeTab === 'activity' ? 'bg-white shadow' : ''}`}
                                >
                                    Activity
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Content based on active tab */}
            <div className="min-h-[300px]">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'subjects' && renderSubjects()}
                {activeTab === 'trends' && renderTrends()}
                {activeTab === 'activity' && renderActivity()}
            </div>

            {/* Recommendations */}
            {type === 'student' && detailedMetrics.academic && detailedMetrics.academic?.recommendedActions && detailedMetrics.academic.recommendedActions.length > 0 && (
                <div className="mt-4 rounded bg-blue-50 p-2 text-xs">
                    <div className="mb-1 font-semibold">Recommendations:</div>
                    <ul className="space-y-1">
                        {detailedMetrics.academic.recommendedActions.slice(0, 2).map((action, index) => (
                            <li key={index} className="text-blue-700">• {action}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Teacher insights */}
            {type === 'teacher' && detailedMetrics.teaching && detailedMetrics.teaching?.pedagogicalStrengths && (
                <div className="mt-4 rounded bg-green-50 p-2 text-xs">
                    <div className="mb-1 font-semibold">Teaching Strengths:</div>
                    <ul className="space-y-1">
                        {detailedMetrics.teaching.pedagogicalStrengths.slice(0, 2).map((strength, index) => (
                            <li key={index} className="text-green-700">• {strength}</li>
                        ))}
                    </ul>
                </div>
            )}

            <h2 className="absolute inset-x-0 bottom-4 m-auto text-center text-xs font-medium text-gray-500">
                {type === 'student' && "Academic Progress & Activity"}
                {type === 'teacher' && "Teaching Effectiveness & Impact"}
                {type === 'default' && "1st Semester - 2nd Semester"}
            </h2>
        </div>
    );
};

export default Performance;