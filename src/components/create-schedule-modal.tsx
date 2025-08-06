"use client";

import type React from "react";

import { useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSchedule: (
    scheduleData: Omit<CalendarEvent, "dayOfWeek"> & { dayOfWeek: string },
  ) => void;
  classOptions: string[];
}

export function CreateScheduleModal({
  isOpen,
  onClose,
  onCreateSchedule,
  classOptions = [],
}: CreateScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [teacher, setTeacher] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!title) return "Subject title is required";
    if (!dayOfWeek) return "Day of week is required";
    if (!startTime) return "Start time is required";
    if (!endTime) return "End time is required";
    if (!classGroup) return "Class is required";
    if (!teacher) return "Teacher name is required";

    // Check if end time is after start time
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (end <= start) return "End time must be after start time";

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    onCreateSchedule({
      title,
      dayOfWeek,
      startTime,
      endTime,
      class: classGroup,
      teacher,
    });

    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setTitle("");
    setDayOfWeek("");
    setStartTime("");
    setEndTime("");
    setClassGroup("");
    setTeacher("");
    setError(null);
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
            <Input
              id="title"
              placeholder="e.g. Mathematics, Physics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                onChange={(e) => setStartTime(e.target.value)}
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
            <Input
              id="teacher"
              placeholder="Teacher's name"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
