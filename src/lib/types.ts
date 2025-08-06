import { Day } from "@prisma/client"

export type LessonWithRelations = {
  id: string
  name: string
  day: Day
  startTime: Date
  endTime: Date
  subject: {
    id: string
    name: string
    color: string | null
  }
  class: {
    id: string
    name: string
  }
  teacher: {
    id: string
    name: string
  }
}

export type CalendarEvent = {
  id: string
  title: string
  startTime: string
  endTime: string
  dayOfWeek: number
  class: string
  classId: string
  teacher: string
  teacherId: string
  subject: string
  subjectId: string
  color: string
}

export type ClassOption = {
  id: string
  name: string
}

export type TeacherOption = {
  id: string
  name: string
}

export type SubjectOption = {
  id: string
  name: string
  color: string | null
}

export type ViewType = "list" | "week" | "all"

export const dayToNumber: Record<Day, number> = {
  [Day.SUNDAY]: 0,
  [Day.MONDAY]: 1,
  [Day.TUESDAY]: 2,
  [Day.WEDNESDAY]: 3,
  [Day.THURSDAY]: 4,
  [Day.FRIDAY]: 5,
  [Day.SATURDAY]: 6,
}

export const numberToDay: Record<number, Day> = {
  0: Day.SUNDAY,
  1: Day.MONDAY,
  2: Day.TUESDAY,
  3: Day.WEDNESDAY,
  4: Day.THURSDAY,
  5: Day.FRIDAY,
  6: Day.SATURDAY,
}

