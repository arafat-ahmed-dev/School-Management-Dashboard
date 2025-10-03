import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "../../../../../../prisma";

const SingleResultPage = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);
    const currentUserRole = session?.user?.role || "admin";
    const currentUserId = session?.user?.id;
    const resultId = params.id;

    // Fetch result with all related data
    const result = await prisma.result.findUnique({
        where: { id: resultId },
        include: {
            student: {
                include: {
                    class: {
                        include: {
                            grade: true,
                        },
                    },
                },
            },
            exam: {
                include: {
                    lesson: {
                        include: {
                            subject: true,
                            teacher: true,
                            class: true,
                        },
                    },
                },
            },
            assignment: {
                include: {
                    lesson: {
                        include: {
                            subject: true,
                            teacher: true,
                            class: true,
                        },
                    },
                },
            },
        },
    });

    if (!result) {
        notFound();
    }

    // Role-based access control
    if (currentUserRole === "student" && result.studentId !== currentUserId) {
        notFound();
    }
    if (currentUserRole === "parent" && result.student?.parentId !== currentUserId) {
        notFound();
    }

    // Helper function to calculate grade
    const calculateGrade = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    };

    const percentage = Math.round((result.score / result.maxScore) * 100);
    const grade = calculateGrade(result.score, result.maxScore);
    const examOrAssignment = result.exam || result.assignment;
    const lesson = examOrAssignment?.lesson;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* RESULT INFO CARD */}
                    <div className="flex flex-1 gap-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-sm">
                        <div className="w-1/3">
                            <div className="flex size-36 items-center justify-center rounded-full bg-white shadow-md">
                                <Image src="/result.png" alt="" width={64} height={64} />
                            </div>
                        </div>
                        <div className="flex w-2/3 flex-col justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-semibold">
                                    {result.exam ? "Exam" : "Assignment"} Result
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {examOrAssignment?.title || "N/A"}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                                <div className="flex w-full items-center gap-2 md:w-1/2 lg:w-full 2xl:w-1/2">
                                    <Image src="/student.png" alt="" width={14} height={14} />
                                    <span>{result.student?.name}</span>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/2 lg:w-full 2xl:w-1/2">
                                    <Image src="/class.png" alt="" width={14} height={14} />
                                    <span>{result.student?.class?.name}</span>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/2 lg:w-full 2xl:w-1/2">
                                    <Image src="/subject.png" alt="" width={14} height={14} />
                                    <span>{lesson?.subject?.name || "N/A"}</span>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/2 lg:w-full 2xl:w-1/2">
                                    <Image src="/teacher.png" alt="" width={14} height={14} />
                                    <span>{lesson?.teacher?.name || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SCORE CARD */}
                    <div className="flex flex-1 gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="w-full">
                            <h2 className="mb-6 text-lg font-semibold text-gray-800">Score Details</h2>

                            {/* Score Display */}
                            <div className="mb-6 text-center">
                                <div className="mb-2 text-4xl font-bold text-blue-600">
                                    {result.score}/{result.maxScore}
                                </div>
                                <div className="text-2xl font-semibold text-gray-600">
                                    {percentage}%
                                </div>
                            </div>

                            {/* Grade Badge */}
                            <div className="mb-6 flex justify-center">
                                <span
                                    className={`rounded-xl px-6 py-3 text-lg font-bold shadow-sm ${grade === "F"
                                            ? "border border-red-200 bg-red-50 text-red-700"
                                            : grade === "A+" || grade === "A"
                                                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border border-amber-200 bg-amber-50 text-amber-700"
                                        }`}
                                >
                                    Grade: {grade}
                                </span>
                            </div>

                            {/* Performance Indicator */}
                            <div className="w-full">
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Performance</span>
                                    <span>{percentage}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                    <div
                                        className={`h-2 rounded-full ${percentage >= 80
                                                ? "bg-green-500"
                                                : percentage >= 60
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAILED INFORMATION */}
                <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">Detailed Information</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Exam/Assignment Details */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-blue-600">
                                {result.exam ? "Exam" : "Assignment"} Details
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Title:</span>
                                    <span>{examOrAssignment?.title || "N/A"}</span>
                                </div>

                                {result.exam && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Date:</span>
                                            <span>{result.exam.startTime ? new Date(result.exam.startTime).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                    </>
                                )}

                                {result.assignment && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Start Date:</span>
                                            <span>{result.assignment.startDate ? new Date(result.assignment.startDate).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Due Date:</span>
                                            <span>{result.assignment.dueDate ? new Date(result.assignment.dueDate).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-blue-600">Student Details</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Name:</span>
                                    <span>{result.student?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Class:</span>
                                    <span>{result.student?.class?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Grade Level:</span>
                                    <span>{result.student?.class?.grade?.level || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Student ID:</span>
                                    <span>{result.student?.id.substring(10) || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-1/3">
                {/* QUICK ACTIONS */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-gray-800">Quick Actions</h2>

                    <div className="space-y-3">
                        <Link
                            href="/list/results"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-600"
                        >
                            <Image src="/view.png" alt="" width={16} height={16} />
                            Back to Results
                        </Link>

                        {currentUserRole === "admin" && (
                            <>
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-amber-600">
                                    <Image src="/update.png" alt="" width={16} height={16} />
                                    Edit Result
                                </button>
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-600">
                                    <Image src="/delete.png" alt="" width={16} height={16} />
                                    Delete Result
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* GRADE SCALE */}
                <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-gray-800">Grade Scale</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium">A+ (90-100%):</span>
                            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">Excellent</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">A (80-89%):</span>
                            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">Very Good</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">B (70-79%):</span>
                            <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Good</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">C (60-69%):</span>
                            <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Fair</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">D (50-59%):</span>
                            <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Pass</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">F (0-49%):</span>
                            <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">Fail</span>
                        </div>
                    </div>
                </div>

                {/* STATISTICS */}
                {(currentUserRole === "admin" || currentUserRole === "teacher") && (
                    <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Class Statistics</h2>
                        <p className="text-sm text-gray-500">
                            Class average and performance statistics would be displayed here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleResultPage;