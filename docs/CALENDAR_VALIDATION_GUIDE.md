# Calendar Schedule Validation Implementation

## Overview

Comprehensive validation system implemented to ensure data integrity and prevent scheduling conflicts in the calendar system. This includes teacher-subject qualification validation, time conflict detection, and enhanced form validation.

## ✅ Validations Implemented

### 1. **Teacher-Subject Qualification Validation**

#### **Frontend Validation (Modal)**

- **Dynamic filtering**: When a subject is selected, only qualified teachers are shown
- **Real-time validation**: Teacher dropdown updates based on subject selection
- **Bidirectional filtering**: Selecting teacher filters available subjects
- **Visual feedback**: Shows teacher's qualifications in dropdown

```typescript
// Filter teachers based on selected subject
const handleSubjectChange = (subject: string) => {
  const qualifiedTeachers = teacherOptions.filter((teacher) =>
    teacher.subjects.some((teacherSubject) => teacherSubject.name === subject)
  );
  setAvailableTeachers(qualifiedTeachers);
};
```

#### **Server-Side Validation (Action)**

- **Double verification**: Validates teacher can teach subject in database
- **Relationship check**: Ensures both teacher→subject and subject→teacher relationships exist
- **Error messages**: Clear, specific error messages for qualification mismatches

```typescript
// Validate teacher can teach this subject
const canTeachSubject = teacherData.subjects.some(
  (subject) => subject.name === lessonData.title
);

if (!canTeachSubject) {
  throw new Error(
    `${lessonData.teacher} is not qualified to teach ${lessonData.title}`
  );
}
```

### 2. **Time Conflict Detection**

#### **Teacher Scheduling Conflicts**

```typescript
// Check if teacher is already scheduled at this time
{
  teacherId: teacherData.id,
  AND: [
    { startTime: { lte: endTime } },
    { endTime: { gte: startTime } }
  ]
}
```

#### **Class Scheduling Conflicts**

```typescript
// Check if class already has a lesson at this time
{
  classId: classData.id,
  AND: [
    { startTime: { lte: endTime } },
    { endTime: { gte: startTime } }
  ]
}
```

#### **Overlap Detection**

- Uses database-level time range overlap logic
- Prevents double-booking of teachers and classes
- Provides specific conflict information in error messages

### 3. **Time Duration Validation**

#### **Minimum Duration**

- **Rule**: Lessons must be at least 30 minutes
- **Frontend**: Validates during form submission
- **Backend**: Server-side verification

#### **Maximum Duration**

- **Rule**: Lessons cannot exceed 3 hours
- **Rationale**: Prevents unrealistic lesson lengths

#### **Time Logic Validation**

- **End time after start time**: Basic temporal validation
- **Same-day validation**: Ensures times are within 24-hour format

```typescript
const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
if (duration < 30) {
  throw new Error("Lesson duration must be at least 30 minutes");
}
if (duration > 180) {
  throw new Error("Lesson duration cannot exceed 3 hours");
}
```

### 4. **Data Existence Validation**

#### **Required Entity Checks**

- **Class validation**: Ensures selected class exists in database
- **Subject validation**: Verifies subject exists and is available
- **Teacher validation**: Confirms teacher exists and is active

#### **Relationship Validation**

- **Teacher-Subject mapping**: Validates many-to-many relationships
- **Subject-Teacher mapping**: Bidirectional relationship verification

### 5. **Form Field Validation**

#### **Required Fields**

- ✅ Subject title
- ✅ Day of week (Monday-Friday only)
- ✅ Start time
- ✅ End time
- ✅ Class selection
- ✅ Teacher selection

#### **Format Validation**

- **Time format**: 24-hour HH:MM format
- **Day restriction**: Weekdays only (Monday-Friday)
- **Input sanitization**: Prevents malicious input

## 🛡️ Security Features

### **SQL Injection Prevention**

- Uses Prisma ORM for all database queries
- Parameterized queries prevent injection attacks
- Type-safe database operations

### **Input Validation**

- **Server-side validation**: All inputs validated on server
- **Type checking**: TypeScript ensures type safety
- **Sanitization**: Inputs cleaned before database operations

### **Authorization Checks**

- Validates user permissions (can be extended)
- Ensures only authorized schedule creation

## 🎯 User Experience Features

### **Smart Filtering**

```typescript
// Show only teachers qualified for selected subject
{availableTeachers.map((teacher) => (
  <SelectItem key={teacher.name} value={teacher.name}>
    {teacher.name} ({teacher.subjects.map(s => s.name).join(', ')})
  </SelectItem>
))}
```

### **Auto-Suggestion**

- **End time**: Automatically suggests 1 hour after start time
- **Teacher display**: Shows teacher's qualifications in dropdown
- **Form reset**: Clears all filters when modal closes

### **Error Feedback**

- **Immediate validation**: Real-time feedback during form filling
- **Specific messages**: Clear, actionable error descriptions
- **Context preservation**: Form stays open on error for correction

### **Visual Indicators**

- **No qualified teachers**: Shows message when no teachers available for subject
- **Loading states**: Visual feedback during submission
- **Success feedback**: Immediate calendar update on successful creation

## 🔧 Technical Implementation

### **Database Schema Relationships**

```prisma
Teacher {
  subjects: Subject[] // Many-to-many relationship
}

Subject {
  teachers: Teacher[] // Many-to-many relationship
}

Lesson {
  teacher: Teacher
  subject: Subject
  class: Class
  day: Day (enum)
  startTime: DateTime
  endTime: DateTime
}
```

### **Data Flow Architecture**

```
Frontend Form → Client Validation → Server Action → Database Validation → Conflict Check → Create Lesson
```

### **Error Handling Chain**

1. **Form validation**: Client-side checks
2. **Network errors**: Connection failure handling
3. **Server validation**: Database constraint checks
4. **Business logic**: Qualification and conflict validation
5. **Database errors**: Unique constraint violations

## 📋 Validation Rules Summary

| Validation Type       | Rule                                  | Frontend | Backend |
| --------------------- | ------------------------------------- | -------- | ------- |
| Teacher-Subject Match | Teacher must be qualified for subject | ✅       | ✅      |
| Time Duration         | 30 min - 3 hours                      | ✅       | ✅      |
| Time Logic            | End > Start                           | ✅       | ✅      |
| Teacher Conflict      | No double booking                     | ❌       | ✅      |
| Class Conflict        | No overlapping lessons                | ❌       | ✅      |
| Required Fields       | All fields mandatory                  | ✅       | ✅      |
| Data Existence        | Class/Subject/Teacher exist           | ❌       | ✅      |
| Weekday Only          | Monday-Friday                         | ✅       | ✅      |

## 🧪 Testing Scenarios

### **Valid Scenarios**

- ✅ Math teacher teaching Mathematics
- ✅ 1-hour lesson duration
- ✅ No scheduling conflicts
- ✅ All required fields filled

### **Invalid Scenarios**

- ❌ English teacher trying to teach Mathematics
- ❌ 15-minute lesson duration
- ❌ Teacher double-booked
- ❌ Class already has lesson at same time
- ❌ Missing required fields
- ❌ End time before start time

### **Edge Cases**

- ❌ Teacher with no subjects assigned
- ❌ Subject with no qualified teachers
- ❌ Weekend lesson creation
- ❌ Lessons longer than 3 hours

## 🚀 Usage Examples

### **Creating Valid Schedule**

```typescript
const validSchedule = {
  title: "Mathematics", // Subject taught by selected teacher
  dayOfWeek: "Monday", // Weekday only
  startTime: "09:00", // Valid time format
  endTime: "10:00", // 1 hour duration, after start
  class: "Class 10 Science", // Existing class
  teacher: "John Smith", // Math teacher
};
// ✅ Success: Creates lesson
```

### **Invalid Schedule Attempts**

```typescript
const invalidSchedule = {
  title: "Mathematics",
  teacher: "English Teacher", // ❌ English teacher can't teach Math
};
// Error: "English Teacher is not qualified to teach Mathematics"

const conflictSchedule = {
  // Same time as existing lesson
  startTime: "09:00",
  endTime: "10:00", // ❌ Teacher already booked
};
// Error: "John Smith is already scheduled to teach Physics at this time"
```

## 🔄 Future Enhancements

### **Potential Additions**

- **Room/Location validation**: Prevent room double-booking
- **Equipment requirements**: Check if classroom has required equipment
- **Student capacity**: Validate class size limits
- **Prerequisite checking**: Ensure prerequisite subjects are scheduled
- **Academic calendar**: Respect holidays and exam periods
- **Bulk scheduling**: Mass schedule creation with validation
- **Schedule templates**: Pre-defined schedule patterns

### **Performance Optimizations**

- **Caching**: Cache teacher-subject relationships
- **Batch validation**: Validate multiple schedules at once
- **Indexed queries**: Optimize conflict detection queries
- **Real-time updates**: WebSocket-based conflict notifications

---

## Status: ✅ FULLY IMPLEMENTED

All calendar-related validations are now active and protecting against:

- ❌ Unqualified teacher assignments
- ❌ Scheduling conflicts
- ❌ Invalid time ranges
- ❌ Missing required data
- ❌ Data integrity violations

The system now ensures only valid, conflict-free schedules can be created while providing clear feedback to users when validation fails.
