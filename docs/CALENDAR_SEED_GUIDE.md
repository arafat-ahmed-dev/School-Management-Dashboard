# Calendar Seed Documentation

## Overview

The `calendar-seed.ts` file provides a comprehensive seeding solution for populating your school management system with realistic calendar and scheduling data.

## Features

### 📚 Lesson Schedule Data

- **22 regular lessons** covering all subjects from the main seed file
- **Monday to Friday** schedule
- **Time slots**: 9:00 AM - 3:50 PM with 50-minute periods
- **Subjects included**:
  - Mathematics, English-1, English-2, Bangla-1, Bangla-2
  - Biology, Physics, Chemistry
  - History, Economics, Civics
  - General Science, ICT, Religion
  - Bangladesh and Global Studies
  - Islamic History and Culture
  - Accounting, Business Organization and Management

### 🎉 School Events Data

- **8 diverse events** including:
  - Science Fair
  - Parent-Teacher Meetings
  - Sports Day
  - Mathematics Olympiad
  - Cultural Programs
  - Final Exams
  - Debate Competition
  - Business Plan Competition

### 🏫 Class Coverage

- **All grade levels**: Class 7 to Class 12
- **All streams**: Science, Arts, Commerce
- **Realistic distribution** of subjects per class

## Data Alignment

### ✅ Matches Existing Database Structure

- **Classes**: Uses exact class names from main seed (`Class 7`, `Class 8`, `Class 9 Science`, etc.)
- **Subjects**: Aligns with subjects from main seed (Mathematics, English-1, Biology, etc.)
- **Teachers**: Automatically assigns teachers who are qualified for each subject
- **Time management**: Proper day enum mapping and time parsing

### 🔗 Smart Relationships

- **Teacher-Subject Matching**: Automatically finds teachers qualified for each subject
- **Class-Subject Alignment**: Matches subjects appropriate for each grade level
- **Constraint Handling**: Safely handles existing data without breaking foreign keys

## Usage

### Run the Calendar Seed

```bash
# Navigate to project directory
cd path/to/next-dashboard-ui

# Run the calendar seed
npx tsx prisma/calendar-seed.ts
```

### Prerequisites

1. **Main seed must be run first** to create:
   - Classes
   - Teachers
   - Subjects
   - Grades

2. **Database connection** must be configured in `.env`

### Expected Output

```
🗓️ Starting calendar data seeding...
ℹ️ Skipping lesson cleanup due to existing related records - adding new lessons
🧹 Cleaned up existing events
✅ Lessons seeded: 27
✅ Events seeded: 8
🎉 Calendar data seeding completed!
📊 Summary:
   - Lessons: 27
   - Events: 8
```

## Database Impact

### Tables Populated

1. **Lesson** - Regular class schedule entries
2. **Event** - Special school events and activities

### Safe Execution

- **Non-destructive**: Won't delete lessons with existing attendance/assignment records
- **Idempotent**: Can be run multiple times safely
- **Relationship-aware**: Respects all foreign key constraints

## Integration with Calendar Components

This seed data is designed to work seamlessly with:

### Frontend Components

- `BigCalender.tsx` - Weekly schedule view
- `ClassSchedule.tsx` - Main scheduling interface
- `EventCalender.tsx` - Date picker and event display
- `EventList.tsx` - Event listing component

### API Endpoints

- `/api/calendar` - Schedule data retrieval
- `/api/events` - Event management
- Calendar page at `/list/calendar`

## Demo Data Structure

### Sample Lesson Entry

```typescript
{
  name: "Mathematics - Class 7",
  day: "MONDAY",
  startTime: "09:00",
  endTime: "09:50",
  classId: "class7_id",
  teacherId: "teacher_id",
  subjectId: "mathematics_id"
}
```

### Sample Event Entry

```typescript
{
  title: "Science Fair",
  description: "Annual science fair for all classes...",
  startTime: "2025-10-15T09:00:00Z",
  endTime: "2025-10-15T15:00:00Z",
  classId: "class7_id"
}
```

## Customization

### Adding More Events

Add entries to the `schoolEvents` array:

```typescript
{
  title: "Your Event",
  description: "Event description",
  startTime: new Date("2025-MM-DDTHH:mm:ssZ"),
  endTime: new Date("2025-MM-DDTHH:mm:ssZ"),
  className: "Class X Science" // Must match existing class
}
```

### Adding More Lessons

Add entries to the `calendarEvents` array:

```typescript
{
  title: "Subject Name", // Must match existing subject
  className: "Class Name", // Must match existing class
  dayOfWeek: 1, // 1=Monday, 2=Tuesday, etc.
  startTime: "HH:mm",
  endTime: "HH:mm"
}
```

## Troubleshooting

### Common Issues

1. **"Please run the main seed first"**
   - Run `npx prisma db seed` before running calendar seed

2. **Foreign key constraint errors**
   - Ensure class names and subject names match exactly with main seed data

3. **No teachers found for subject**
   - Check that teachers are properly linked to subjects in main seed

### Verification Queries

```sql
-- Check created lessons
SELECT l.name, c.name as class, s.name as subject, t.name as teacher
FROM Lesson l
JOIN Class c ON l.classId = c.id
JOIN Subject s ON l.subjectId = s.id
JOIN Teacher t ON l.teacherId = t.id;

-- Check created events
SELECT e.title, e.description, c.name as class
FROM Event e
JOIN Class c ON e.classId = c.id;
```

## Next Steps

After running the calendar seed:

1. **Visit `/list/calendar`** to see the schedule interface
2. **Test the create schedule modal** with existing data
3. **Check event listings** on the dashboard
4. **Verify calendar components** display correctly

The seed provides a solid foundation for testing and demonstrating the complete calendar/scheduling functionality of your school management system.
