"use client";

import { useState } from "react";
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
// import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleDisplay from "./ScheduleDisplay";

interface ClassSchedule {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  duration: string;
  description: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export default function ScheduleCreator() {
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [day, setDay] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [teacher, setTeacher] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [classInput, setClassInput] = useState<string>("");

  const handleAddClass = () => {
    if (day && time && subject && teacher) {
      setSchedule([
        ...schedule,
        { day, time, subject, teacher, room, duration, description },
      ]);
      resetForm();
    }
  };

  const handleAddMultipleClasses = () => {
    const classes = classInput.split("\n").filter((line) => line.trim() !== "");
    const newClasses = classes.map((classLine) => {
      const [day, time, subject, teacher, room, duration, ...descriptionParts] =
        classLine.split(",").map((item) => item.trim());
      return {
        day,
        time,
        subject,
        teacher,
        room,
        duration,
        description: descriptionParts.join(", "),
      };
    });
    setSchedule([...schedule, ...newClasses]);
    setClassInput("");
  };

  const resetForm = () => {
    setSubject("");
    setTeacher("");
    setRoom("");
    setDuration("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Single Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="day">Day</Label>
              <Select onValueChange={setDay} value={day}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Select onValueChange={setTime} value={time}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>
            <div>
              <Label htmlFor="teacher">Teacher</Label>
              <Input
                id="teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Enter teacher name"
              />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room number"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
              />
            </div>
            {/* <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter class description"
              />
            </div> */}
          </div>
          <Button onClick={handleAddClass} className="mt-4">
            Add Class
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Multiple Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Label htmlFor="classInput">
            Enter multiple classes (one per line)
          </Label>
          <Textarea
            id="classInput"
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
            placeholder="Day, Time, Subject, Teacher, Room, Duration, Description"
            rows={5}
          /> */}
          <p className="text-sm text-gray-500 mt-2">
            Format: Day, Time, Subject, Teacher, Room, Duration, Description
            (comma-separated)
          </p>
          <Button onClick={handleAddMultipleClasses} className="mt-4">
            Add Multiple Classes
          </Button>
        </CardContent>
      </Card>

      <ScheduleDisplay schedule={schedule} />
    </div>
  );
}
