
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState, useRef } from "react";
import { getAllStudents, getAllExams, createResult, updateResult } from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    studentId: z.string().min(1, { message: "Student is required!" }),
    examId: z.string().min(1, { message: "Exam is required!" }),
    score: z.coerce.number().min(0, { message: "Score must be 0 or greater!" }),
    maxScore: z.coerce.number().min(1, { message: "Maximum score must be greater than 0!" }),
}).refine(
    (data) => data.score <= data.maxScore,
    {
        message: "Score cannot exceed maximum score!",
        path: ["score"],
    }
);

type Inputs = z.infer<typeof schema>;

const ResultForm = ({ type, data, onSuccess }: {
    type: "create" | "update";
    data?: any;
    onSuccess?: () => void;
}) => {
    const [students, setStudents] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [showExamDropdown, setShowExamDropdown] = useState(false);
    const [studentSearch, setStudentSearch] = useState("");
    const [examSearch, setExamSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const studentDropdownRef = useRef<HTMLDivElement>(null);
    const examDropdownRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            studentId: data?.studentId || "",
            examId: data?.examId || "",
            score: data?.score || 0,
            maxScore: data?.maxScore || 100,
        },
    });

    const selectedStudent = watch("studentId");
    const selectedExam = watch("examId");

    // Set initial values for edit mode
    useEffect(() => {
        if (type === "update" && data) {
            setValue("studentId", data.studentId || "");
            setValue("examId", data.examId || "");
            setValue("score", data.score || 0);
            setValue("maxScore", data.maxScore || 100);
        }
    }, [data, type, setValue]);

    useEffect(() => {
        (async () => {
            const [studentsData, examsResult] = await Promise.all([
                getAllStudents({ class: true }),
                getAllExams()
            ]);

            setStudents(studentsData.filter(student => student.class));
            if (examsResult.exams) {
                setExams(examsResult.exams);
            }
        })();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
                setShowStudentDropdown(false);
            }
            if (examDropdownRef.current && !examDropdownRef.current.contains(event.target as Node)) {
                setShowExamDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.class?.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const filteredExams = exams.filter(exam =>
        exam.title.toLowerCase().includes(examSearch.toLowerCase()) ||
        exam.lesson?.subject?.name.toLowerCase().includes(examSearch.toLowerCase()) ||
        exam.lesson?.class?.name.toLowerCase().includes(examSearch.toLowerCase())
    );

    const onSubmit = handleSubmit(async (formData) => {
        setIsSubmitting(true);
        try {
            const resultData = {
                studentId: formData.studentId,
                score: formData.score,
                maxScore: formData.maxScore,
                examId: formData.examId,
            };

            if (type === "create") {
                const result = await createResult(resultData);
                if (result.error) {
                    toast.error("Failed to create result: " + result.error);
                } else {
                    toast.success("Result created successfully!");
                    reset();
                    onSuccess?.();
                }
            } else {
                const result = await updateResult(data?.id, resultData);
                if (result.error) {
                    toast.error("Failed to update result: " + result.error);
                } else {
                    toast.success("Result updated successfully!");
                    onSuccess?.();
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new result" : "Update result"}
            </h1>

            <div className="flex flex-wrap justify-between gap-4">
                {/* Student Selection */}
                <div className="relative flex w-full flex-col gap-2 md:w-1/2" ref={studentDropdownRef}>
                    <label className="text-xs font-medium text-gray-500">Student *</label>
                    <div
                        className="w-full cursor-pointer rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                    >
                        {selectedStudent ?
                            students.find(s => s.id === selectedStudent)?.name || "Select student" :
                            "Select student"
                        }
                    </div>
                    {showStudentDropdown && (
                        <div className="absolute inset-x-0 top-full z-10 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="w-full border-b border-gray-200 p-2"
                            />
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setValue("studentId", student.id);
                                        setShowStudentDropdown(false);
                                        setStudentSearch("");
                                    }}
                                >
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-xs text-gray-500">
                                        Class: {student.class?.name} | {student.email}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.studentId && (
                        <p className="text-xs text-red-400">{errors.studentId.message}</p>
                    )}
                </div>

                {/* Exam Selection */}
                <div className="relative flex w-full flex-col gap-2 md:w-1/2" ref={examDropdownRef}>
                    <label className="text-xs font-medium text-gray-500">Exam (Subject) *</label>
                    <div
                        className="w-full cursor-pointer rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        onClick={() => setShowExamDropdown(!showExamDropdown)}
                    >
                        {selectedExam ?
                            (() => {
                                const exam = exams.find(e => e.id === selectedExam);
                                return exam ? `${exam.title} - ${exam.lesson?.subject?.name}` : "Select exam";
                            })() :
                            "Select exam"
                        }
                    </div>
                    {showExamDropdown && (
                        <div className="absolute inset-x-0 top-full z-10 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                            <input
                                type="text"
                                placeholder="Search exams..."
                                value={examSearch}
                                onChange={(e) => setExamSearch(e.target.value)}
                                className="w-full border-b border-gray-200 p-2"
                            />
                            {filteredExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setValue("examId", exam.id);
                                        setShowExamDropdown(false);
                                        setExamSearch("");
                                    }}
                                >
                                    <div className="font-medium">{exam.title}</div>
                                    <div className="text-xs text-gray-500">
                                        Subject: {exam.lesson?.subject?.name} | Class: {exam.lesson?.class?.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Type: {exam.examType}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.examId && (
                        <p className="text-xs text-red-400">{errors.examId.message}</p>
                    )}
                </div>

                {/* Score */}
                <InputField
                    label="Score Obtained"
                    name="score"
                    type="number"
                    register={register}
                    error={errors?.score}
                />

                {/* Max Score */}
                <InputField
                    label="Maximum Score"
                    name="maxScore"
                    type="number"
                    register={register}
                    error={errors?.maxScore}
                />
            </div>

            <button
                className="rounded-md bg-blue-400 p-2 text-white hover:bg-blue-500 disabled:bg-gray-400"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ?
                    (type === "create" ? "Creating..." : "Updating...") :
                    (type === "create" ? "Create" : "Update")
                }
            </button>
        </form>
    );
};

export default ResultForm;
