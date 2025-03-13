import React from "react";
import AttendanceChart from "@/components/AttendanceChart";
import prisma from "../../prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(lastMonday.getDate() - daysSinceMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      MON: { present: 0, absent: 0 },
      TUE: { present: 0, absent: 0 },
      WED: { present: 0, absent: 0 },
      THU: { present: 0, absent: 0 },
      FRI: { present: 0, absent: 0 },
      SAT: { present: 0, absent: 0 },
      SUN: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemDayOfWeek = itemDate.getDay();
    const dayName = daysOfWeek[itemDayOfWeek === 0 ? 6 : itemDayOfWeek - 1]; // Map Sunday correctly

    if (item.present) {
      attendanceMap[dayName].present += 1;
    } else {
      attendanceMap[dayName].absent += 1;
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="relative size-full rounded-xl bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
