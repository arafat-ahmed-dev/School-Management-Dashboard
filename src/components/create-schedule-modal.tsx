"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalendarEvent } from "@/lib/data";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface TeacherOption {
  name: string;
  subjects: { name: string }[];
}

interface SubjectOption {
  name: string;
  teachers: { name: string }[];
}

interface SchedulePreFillData {
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  class?: string;
}

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSchedule: (
    scheduleData: Omit<CalendarEvent, "dayOfWeek"> & { dayOfWeek: string },
  ) => Promise<void>;
  classOptions: string[];
  subjectOptions: SubjectOption[];
  teacherOptions: TeacherOption[];
  isLoading?: boolean;
  preFillData?: SchedulePreFillData;
}

export function CreateScheduleModal({
  isOpen,
  onClose,
  onCreateSchedule,
  classOptions = [],
  subjectOptions = [],
  teacherOptions = [],
  isLoading = false,
  preFillData,
}: CreateScheduleModalProps) {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [teacherGroup, setTeacherGroup] = useState("");
  const [subjectGroup, setSubjectGroup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTeachers, setAvailableTeachers] = useState<TeacherOption[]>(teacherOptions);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectOption[]>(subjectOptions);

  // Pre-fill form when modal opens with pre-fill data
  useEffect(() => {
    if (isOpen && preFillData) {
      if (preFillData.dayOfWeek) setDayOfWeek(preFillData.dayOfWeek);
      if (preFillData.startTime) setStartTime(preFillData.startTime);
      if (preFillData.endTime) setEndTime(preFillData.endTime);
      if (preFillData.class) setClassGroup(preFillData.class);
    }
  }, [isOpen, preFillData]);

  // Auto-suggest end time when start time changes
  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (time && !endTime) {
      const [hours, minutes] = time.split(':').map(Number);
      const endHour = hours + 1; // Suggest 1 hour later
      if (endHour < 24) {
        setEndTime(`${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }
    }
  };

  // Filter teachers based on selected subject
  const handleSubjectChange = (subject: string) => {
    setSubjectGroup(subject);
    setTeacherGroup(""); // Reset teacher when subject changes

    // Find teachers who can teach this subject
    const qualifiedTeachers = teacherOptions.filter(teacher =>
      teacher.subjects.some(teacherSubject => teacherSubject.name === subject)
    );
    setAvailableTeachers(qualifiedTeachers);
  };

  // Filter subjects based on selected teacher
  const handleTeacherChange = (teacher: string) => {
    setTeacherGroup(teacher);

    // Find subjects this teacher can teach
    const teacherData = teacherOptions.find(t => t.name === teacher);
    if (teacherData) {
      const teachableSubjects = subjectOptions.filter(subject =>
        subject.teachers.some(subjectTeacher => subjectTeacher.name === teacher)
      );
      setAvailableSubjects(teachableSubjects);
    }
  };

  const validateForm = () => {
    if (!subjectGroup) return "Subject title is required";
    if (!dayOfWeek) return "Day of week is required";
    if (!startTime) return "Start time is required";
    if (!endTime) return "End time is required";
    if (!classGroup) return "Class is required";
    if (!teacherGroup) return "Teacher name is required";

    // Check if end time is after start time
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (end <= start) return "End time must be after start time";

    // Validate teacher can teach the selected subject
    const selectedTeacher = teacherOptions.find(t => t.name === teacherGroup);
    if (selectedTeacher && !selectedTeacher.subjects.some(s => s.name === subjectGroup)) {
      return `${teacherGroup} is not qualified to teach ${subjectGroup}`;
    }

    // Validate subject can be taught by the selected teacher
    const selectedSubject = subjectOptions.find(s => s.name === subjectGroup);
    if (selectedSubject && !selectedSubject.teachers.some(t => t.name === teacherGroup)) {
      return `${subjectGroup} cannot be taught by ${teacherGroup}`;
    }

    // Check for time conflicts (basic validation - could be enhanced with server-side check)
    const timeSlotMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (timeSlotMinutes < 30) {
      return "Lesson duration must be at least 30 minutes";
    }
    if (timeSlotMinutes > 180) {
      return "Lesson duration cannot exceed 3 hours";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateSchedule({
        title: subjectGroup,
        dayOfWeek,
        startTime,
        endTime,
        class: classGroup,
        teacher: teacherGroup,
      });

      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setDayOfWeek("");
    setStartTime("");
    setEndTime("");
    setClassGroup("");
    setTeacherGroup("");
    setSubjectGroup("");
    setError(null);
    setIsSubmitting(false);

    // Reset filtered lists
    setAvailableTeachers(teacherOptions);
    setAvailableSubjects(subjectOptions);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Subject Title</Label>
            <Select value={subjectGroup} onValueChange={handleSubjectChange}>
              <SelectTrigger id="title">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.length > 0 ? (
                  availableSubjects.map((sub) => (
                    <SelectItem key={sub.name} value={sub.name}>
                      {sub.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day">Day of Week</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Select day of week" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={classGroup} onValueChange={setClassGroup}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.length > 0 ? (
                  classOptions.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Class 7">Class 7</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select value={teacherGroup} onValueChange={handleTeacherChange}>
              <SelectTrigger id="teacher">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.length > 0 ? (
                  availableTeachers.map((ts) => (
                    <SelectItem key={ts.name} value={ts.name}>
                      {ts.name} ({ts.subjects.map(s => s.name).join(', ')})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="John Doe">John Doe</SelectItem>
                )}
              </SelectContent>
            </Select>
            {subjectGroup && availableTeachers.length === 0 && (
              <p className="text-sm text-red-600">No teachers available for {subjectGroup}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Schedule"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
