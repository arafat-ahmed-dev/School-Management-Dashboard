"use client";

import React from "react"; // Add this import
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

const subjects = [
  "Math",
  "Biology",
  "Physics",
  "English",
  "Chemistry",
  "History",
];
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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Set Calendar</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Teacher</label>
        <select
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {teachers.map((teach) => (
            <option key={teach} value={teach}>
              {teach}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={addScheduleBlock} className="w-full py-2 bg-blue-500 text-white rounded">
        Add Schedule Block
      </Button>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Schedule</h2>
        {schedule.map((day, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{day.date}</h3>
            <ul className="list-disc pl-5">
              {day.blocks.map((block, idx) => (
                <li key={idx} className="text-sm mb-1">
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
