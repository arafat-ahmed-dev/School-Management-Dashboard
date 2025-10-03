import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassSchedule {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  duration: string;
  description: string;
}

interface ScheduleDisplayProps {
  schedule: ClassSchedule[];
}

export default function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
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

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Class Schedule</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {days.map((day) => (
          <Card key={day} className="col-span-1">
            <CardHeader>
              <CardTitle>{day}</CardTitle>
            </CardHeader>
            <CardContent>
              {times.map((time) => {
                const classInfo = schedule.find(
                  (c) => c.day === day && c.time === time
                );
                return classInfo ? (
                  <div
                    key={`${day}-${time}`}
                    className="mb-4 rounded bg-gray-100 p-2"
                  >
                    <p className="font-medium">
                      {time} - {classInfo.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      Teacher: {classInfo.teacher}
                    </p>
                    <p className="text-sm text-gray-600">
                      Room: {classInfo.room}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {classInfo.duration} minutes
                    </p>
                    {classInfo.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {classInfo.description}
                      </p>
                    )}
                  </div>
                ) : null;
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
