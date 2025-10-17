export type CalendarEvent = {
  title: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  class: string;
  teacher: string;
};

// SECURITY WARNING: Do not export static roles
// Use getSessionData() from session-utils.ts to get current user role

export const calendarEvents: CalendarEvent[] = [
  {
    title: "Math",
    class: "1A",
    teacher: "Tommy Wise",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "09:50",
  },
  {
    title: "English",
    class: "2A",
    teacher: "Rhoda Frank",
    dayOfWeek: 1, // Monday
    startTime: "12:00",
    endTime: "12:50",
  },
  {
    title: "Biology",
    class: "3A",
    teacher: "Della Dunn",
    dayOfWeek: 1, // Monday
    startTime: "10:00",
    endTime: "10:50",
  },
  {
    title: "Physics",
    class: "4A",
    teacher: "Bruce Rodriguez",
    dayOfWeek: 1, // Monday
    startTime: "11:00",
    endTime: "11:50",
  },
  {
    title: "Chemistry",
    class: "5A",
    teacher: "Birdie Butler",
    dayOfWeek: 1, // Monday
    startTime: "13:00",
    endTime: "13:50",
  },
  {
    title: "History",
    class: "6A",
    teacher: "Bettie Oliver",
    dayOfWeek: 1, // Monday
    startTime: "14:00",
    endTime: "14:50",
  },
  {
    title: "English",
    class: "2A",
    teacher: "Rhoda Frank",
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "09:50",
  },
  {
    title: "Biology",
    class: "3A",
    teacher: "Della Dunn",
    dayOfWeek: 2, // Tuesday
    startTime: "10:00",
    endTime: "10:50",
  },
  {
    title: "Physics",
    class: "4A",
    teacher: "Bruce Rodriguez",
    dayOfWeek: 2, // Tuesday
    startTime: "11:00",
    endTime: "11:50",
  },
  {
    title: "History",
    class: "6A",
    teacher: "Bettie Oliver",
    dayOfWeek: 2, // Tuesday
    startTime: "14:00",
    endTime: "14:50",
  },
  {
    title: "Math",
    class: "1A",
    teacher: "Tommy Wise",
    dayOfWeek: 3, // Wednesday
    startTime: "09:00",
    endTime: "09:50",
  },
  {
    title: "Biology",
    class: "3A",
    teacher: "Della Dunn",
    dayOfWeek: 3, // Wednesday
    startTime: "10:00",
    endTime: "10:50",
  },
  {
    title: "Chemistry",
    class: "5A",
    teacher: "Birdie Butler",
    dayOfWeek: 3, // Wednesday
    startTime: "13:00",
    endTime: "13:50",
  },
  {
    title: "History",
    class: "6A",
    teacher: "Bettie Oliver",
    dayOfWeek: 3, // Wednesday
    startTime: "14:00",
    endTime: "14:50",
  },
  {
    title: "English",
    class: "2A",
    teacher: "Rhoda Frank",
    dayOfWeek: 4, // Thursday
    startTime: "09:00",
    endTime: "09:50",
  },
  {
    title: "Biology",
    class: "3A",
    teacher: "Della Dunn",
    dayOfWeek: 4, // Thursday
    startTime: "10:00",
    endTime: "10:50",
  },
  {
    title: "Physics",
    class: "4A",
    teacher: "Bruce Rodriguez",
    dayOfWeek: 4, // Thursday
    startTime: "11:00",
    endTime: "11:50",
  },
  {
    title: "History",
    class: "6A",
    teacher: "Bettie Oliver",
    dayOfWeek: 4, // Thursday
    startTime: "14:00",
    endTime: "14:50",
  },
  {
    title: "Math",
    class: "1A",
    teacher: "Tommy Wise",
    dayOfWeek: 5, // Friday
    startTime: "09:00",
    endTime: "09:50",
  },
  {
    title: "Physics",
    class: "4A",
    teacher: "Bruce Rodriguez",
    dayOfWeek: 5, // Friday
    startTime: "11:00",
    endTime: "11:50",
  },
  {
    title: "Chemistry",
    class: "5A",
    teacher: "Birdie Butler",
    dayOfWeek: 5, // Friday
    startTime: "13:00",
    endTime: "13:50",
  },
  {
    title: "History",
    class: "6A",
    teacher: "Bettie Oliver",
    dayOfWeek: 5, // Friday
    startTime: "14:00",
    endTime: "14:50",
  },
];
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       12,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       12,
//       50
//     ),
//     dayOfWeek: 1 // Monday
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       10,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       10,
//       50
//     ),
//     dayOfWeek: 1 // Monday
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       11,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       11,
//       50
//     ),
//     dayOfWeek: 1 // Monday
//   },
//   {
//     title: "Chemistry",
//     class: "5A",
//     teacher: "Birdie Butler",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       13,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       13,
//       50
//     ),
//     dayOfWeek: 1 // Monday
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       14,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate(),
//       14,
//       50
//     ),
//     dayOfWeek: 1 // Monday
//   },
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       9,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       9,
//       50
//     ),
//     dayOfWeek: 2 // Tuesday
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       10,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       10,
//       50
//     ),
//     dayOfWeek: 2 // Tuesday
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       11,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       11,
//       50
//     ),
//     dayOfWeek: 2 // Tuesday
//   },

//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       14,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 1,
//       14,
//       50
//     ),
//     dayOfWeek: 2 // Tuesday
//   },
//   {
//     title: "Math",
//     class: "1A",
//     teacher: "Tommy Wise",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       9,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       9,
//       50
//     ),
//     dayOfWeek: 3 // Wednesday
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       10,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       10,
//       50
//     ),
//     dayOfWeek: 3 // Wednesday
//   },

//   {
//     title: "Chemistry",
//     class: "5A",
//     teacher: "Birdie Butler",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       13,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       13,
//       50
//     ),
//     dayOfWeek: 3 // Wednesday
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       14,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 2,
//       14,
//       50
//     ),
//     dayOfWeek: 3 // Wednesday
//   },
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       9,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       9,
//       50
//     ),
//     dayOfWeek: 4 // Thursday
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       10,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       10,
//       50
//     ),
//     dayOfWeek: 4 // Thursday
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       11,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       11,
//       50
//     ),
//     dayOfWeek: 4 // Thursday
//   },

//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       14,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 3,
//       14,
//       50
//     ),
//     dayOfWeek: 4 // Thursday
//   },
//   {
//     title: "Math",
//     class: "1A",
//     teacher: "Tommy Wise",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       9,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       9,
//       50
//     ),
//     dayOfWeek: 5 // Friday
//   },
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 5,
//       9,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 5,
//       9,
//       50
//     ),
//     dayOfWeek: 5 // Friday
//   },

//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       11,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       11,
//       50
//     ),
//     dayOfWeek: 5 // Friday
//   },
//   {
//     title: "Chemistry",
//     class: "5A",
//     teacher: "Birdie Butler",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       13,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       13,
//       50
//     ),
//     dayOfWeek: 5 // Friday
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     allDay: false,
//     startTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       14,
//       0
//     ),
//     endTime: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       new Date().getDate() + 4,
//       14,
//       50
//     ),
//     dayOfWeek: 5 // Friday
//   },
// ];
// export interface CalendarEvent {
//   title: string;
//   class: string;
//   teacher: string;
//   dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
//   startTime: string; // Format: "HH:mm"
//   endTime: string; // Format: "HH:mm"
// }

// export const calendarEvents: CalendarEvent[] = [
//   {
//     title: "Math",
//     class: "1A",
//     teacher: "Tommy Wise",
//     dayOfWeek: 1, // Monday
//     startTime: "09:00",
//     endTime: "09:50",
//   },
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     dayOfWeek: 1, // Monday
//     startTime: "12:00",
//     endTime: "12:50",
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     dayOfWeek: 1, // Monday
//     startTime: "10:00",
//     endTime: "10:50",
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     dayOfWeek: 1, // Monday
//     startTime: "11:00",
//     endTime: "11:50",
//   },
//   {
//     title: "Chemistry",
//     class: "5A",
//     teacher: "Birdie Butler",
//     dayOfWeek: 1, // Monday
//     startTime: "13:00",
//     endTime: "13:50",
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     dayOfWeek: 1, // Monday
//     startTime: "14:00",
//     endTime: "14:50",
//   },
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     dayOfWeek: 2, // Tuesday
//     startTime: "09:00",
//     endTime: "09:50",
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     dayOfWeek: 2, // Tuesday
//     startTime: "10:00",
//     endTime: "10:50",
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     dayOfWeek: 2, // Tuesday
//     startTime: "11:00",
//     endTime: "11:50",
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     dayOfWeek: 2, // Tuesday
//     startTime: "14:00",
//     endTime: "14:50",
//   },
//   {
//     title: "Math",
//     class: "1A",
//     teacher: "Tommy Wise",
//     dayOfWeek: 3, // Wednesday
//     startTime: "09:00",
//     endTime: "09:50",
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     dayOfWeek: 3, // Wednesday
//     startTime: "10:00",
//     endTime: "10:50",
//   },
//   {
//     title: "Chemistry",
//     class: "5A",
//     teacher: "Birdie Butler",
//     dayOfWeek: 3, // Wednesday
//     startTime: "13:00",
//     endTime: "13:50",
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     dayOfWeek: 3, // Wednesday
//     startTime: "14:00",
//     endTime: "14:50",
//   },
//   {
//     title: "English",
//     class: "2A",
//     teacher: "Rhoda Frank",
//     dayOfWeek: 4, // Thursday
//     startTime: "09:00",
//     endTime: "09:50",
//   },
//   {
//     title: "Biology",
//     class: "3A",
//     teacher: "Della Dunn",
//     dayOfWeek: 4, // Thursday
//     startTime: "10:00",
//     endTime: "10:50",
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     dayOfWeek: 4, // Thursday
//     startTime: "11:00",
//     endTime: "11:50",
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     dayOfWeek: 4, // Thursday
//     startTime: "14:00",
//     endTime: "14:50",
//   },
//   {
//     title: "Math",
//     class: "1A",
//     teacher: "Tommy Wise",
//     dayOfWeek: 5, // Friday
//     startTime: "09:00",
//     endTime: "09:50",
//   },
//   {
//     title: "Physics",
//     class: "4A",
//     teacher: "Bruce Rodriguez",
//     dayOfWeek: 5, // Friday
//     startTime: "11:00",
//     endTime: "11:50",
//   },
//   {
//     title: "Chemistry",
//     class: "5A",
//     teacher: "Birdie Butler",
//     dayOfWeek: 5, // Friday
//     startTime: "13:00",
//     endTime: "13:50",
//   },
//   {
//     title: "History",
//     class: "6A",
//     teacher: "Bettie Oliver",
//     dayOfWeek: 5, // Friday
//     startTime: "14:00",
//     endTime: "14:50",
//   },
// ];

// interface ScheduleBlock {
//   time: string;
//   subject: string;
// }

// interface DaySchedule {
//   date: string;
//   blocks: ScheduleBlock[];
// }
// export const schedule: DaySchedule[] = [
//   {
//     date: "January 27",
//     blocks: [
//       { time: "9:00 AM – 9:50 AM", subject: "Math" },
//       { time: "10:00 AM – 10:50 AM", subject: "Biology" },
//       { time: "11:00 AM – 11:50 AM", subject: "Physics" },
//       { time: "12:00 PM – 12:50 PM", subject: "English" },
//       { time: "1:00 PM – 1:50 PM", subject: "Chemistry" },
//       { time: "2:00 PM – 2:50 PM", subject: "History" },
//     ],
//   },
//   {
//     date: "January 28",
//     blocks: [
//       { time: "9:00 AM – 9:50 AM", subject: "English" },
//       { time: "10:00 AM – 10:50 AM", subject: "Biology" },
//       { time: "11:00 AM – 11:50 AM", subject: "Physics" },
//       { time: "2:00 PM – 2:50 PM", subject: "History" },
//     ],
//   },
//   {
//     date: "January 29",
//     blocks: [
//       { time: "9:00 AM – 9:50 AM", subject: "Math" },
//       { time: "10:00 AM – 10:50 AM", subject: "Biology" },
//       { time: "2:00 PM – 2:50 PM", subject: "History" },
//     ],
//   },
//   {
//     date: "January 30",
//     blocks: [
//       { time: "9:00 AM – 9:50 AM", subject: "English" },
//       { time: "10:00 AM – 10:50 AM", subject: "Biology" },
//       { time: "11:00 AM – 11:50 AM", subject: "Physics" },
//       { time: "2:00 PM – 2:50 PM", subject: "History" },
//     ],
//   },
//   {
//     date: "January 31",
//     blocks: [
//       { time: "9:00 AM – 9:50 AM", subject: "Math" },
//       { time: "11:00 AM – 11:50 AM", subject: "Physics" },
//       { time: "1:00 PM – 1:50 PM", subject: "Chemistry" },
//       { time: "2:00 PM – 2:50 PM", subject: "History" },
//     ],
//   },
// ];

// List of available classes
export const classes = [
  { name: "Class 7" },
  { name: "Class 8" },
  { name: "Class 9" },
  { name: "Class 10" },
  { name: "Class 11" },
  { name: "Class 12" },
];

// Additional subject colors
export const subjectColors: Record<string, string> = {
  Math: "bg-blue-100 text-blue-800",
  "Advanced Math": "bg-blue-200 text-blue-900",
  Mathematics: "bg-blue-100 text-blue-800",
  English: "bg-green-100 text-green-800",
  "English Literature": "bg-green-200 text-green-900",
  Biology: "bg-yellow-100 text-yellow-800",
  Physics: "bg-purple-100 text-purple-800",
  "Physics Lab": "bg-purple-200 text-purple-900",
  Chemistry: "bg-pink-100 text-pink-800",
  History: "bg-orange-100 text-orange-800",
  Geography: "bg-amber-100 text-amber-800",
  "Computer Science": "bg-cyan-100 text-cyan-800",
  Economics: "bg-emerald-100 text-emerald-800",
  "Social Studies": "bg-indigo-100 text-indigo-800",
};
