import { type LessonWithRelations, type CalendarEvent, dayToNumber } from "@/lib/types"

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export function formatTimeFromDate(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function convertLessonToCalendarEvent(lesson: LessonWithRelations): CalendarEvent {
  return {
    id: lesson.id,
    title: lesson.subject.name,
    startTime: formatTimeFromDate(lesson.startTime),
    endTime: formatTimeFromDate(lesson.endTime),
    dayOfWeek: dayToNumber[lesson.day],
    class: lesson.class.name,
    classId: lesson.class.id,
    teacher: lesson.teacher.name,
    teacherId: lesson.teacher.id,
    subject: lesson.subject.name,
    subjectId: lesson.subject.id,
    color: lesson.subject.color || getRandomColor(lesson.subject.name),
  }
}

export function getRandomColor(seed: string): string {
  // Generate a consistent color based on the string
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert to hex color
  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }

  return color
}

export function getDayName(day: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[day]
}

export function getTimeSlots(): string[] {
  return ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
}

export function parseTimeToDate(timeStr: string): Date {
  const [time, period] = timeStr.split(" ")
  const [hourStr, minuteStr] = time.split(":")

  let hour = Number.parseInt(hourStr)
  const minute = Number.parseInt(minuteStr)

  // Convert to 24-hour format
  if (period === "PM" && hour !== 12) {
    hour += 12
  } else if (period === "AM" && hour === 12) {
    hour = 0
  }

  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return date
}

export function getSubjectColor(color: string | null, subjectName: string): string {
  if (color) return color

  // Default colors based on subject
  const defaultColors: Record<string, string> = {
    Math: "bg-blue-100 text-blue-800",
    Mathematics: "bg-blue-100 text-blue-800",
    English: "bg-green-100 text-green-800",
    Physics: "bg-purple-100 text-purple-800",
    Chemistry: "bg-pink-100 text-pink-800",
    Biology: "bg-yellow-100 text-yellow-800",
    History: "bg-orange-100 text-orange-800",
    Geography: "bg-amber-100 text-amber-800",
    "Computer Science": "bg-cyan-100 text-cyan-800",
  }

  return defaultColors[subjectName] || `bg-gray-100 text-gray-800`
}

