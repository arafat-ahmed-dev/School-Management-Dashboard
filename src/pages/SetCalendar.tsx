"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface ScheduleBlock {
  time: string;
  subject: string;
}

interface DaySchedule {
  date: string;
  blocks: ScheduleBlock[];
}

const subjects = ["Math", "Biology", "Physics", "English", "Chemistry", "History"];
const teachers = ["Mr. Smith", "Ms. Johnson", "Dr. Brown", "Prof. Davis"];

export default function SetCalendar() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [teacher, setTeacher] = useState(teachers[0]);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);

  const addScheduleBlock = () => {
    const newBlock: ScheduleBlock = { time, subject };
    const existingDay = schedule.find((day) => day.date === date);

    if (existingDay) {
      existingDay.blocks.push(newBlock);
    } else {
      setSchedule([...schedule, { date, blocks: [newBlock] }]);
    }

    // Reset form fields
    setDate("");
    setTime("");
    setSubject(subjects[0]);
    setTeacher(teachers[0]);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Calendar</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Time</label>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Teacher</label>
        <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
          {teachers.map((teach) => (
            <option key={teach} value={teach}>
              {teach}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={addScheduleBlock}>Add Schedule Block</Button>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Current Schedule</h2>
        {schedule.map((day, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{day.date}</h3>
            <ul>
              {day.blocks.map((block, idx) => (
                <li key={idx} className="text-sm">
                  {block.time} - {block.subject}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
