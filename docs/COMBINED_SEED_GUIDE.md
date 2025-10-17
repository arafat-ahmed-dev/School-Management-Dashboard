# Combined Seed File Documentation

This document explains the combined seed file that merges the original seed functionality with the calendar seed features.

## Overview

The `combined-seed.ts` file provides a comprehensive seeding solution that:

- Seeds all database models with realistic data
- Creates a complete calendar schedule with lessons
- Maintains proper relationships between all entities
- Provides enhanced data consistency and completeness

## What's Included

### 1. **Core User Models**

- **Admins**: 3 admin users with full access
- **Parents**: 20 parent accounts with proper contact information
- **Teachers**: 30 teachers with diverse subjects and qualifications
- **Students**: 200 students distributed across classes with proper grade assignments

### 2. **Academic Structure**

- **Grades**: 6 grade levels (7-12)
- **Subjects**: 18 different subjects covering all academic streams
- **Classes**: 14 classes including Science, Arts, and Commerce streams
- **Proper class-subject relationships**: Each class has relevant subjects assigned

### 3. **Calendar System**

- **Comprehensive Lesson Schedule**:
  - 7 time slots per day (9:00 AM to 3:50 PM)
  - 5 weekdays (Monday to Friday)
  - Full schedule for all classes
  - Proper teacher-subject-class assignments
- **Time Management**: Realistic 50-minute lessons with 10-minute breaks

### 4. **Assessment & Performance**

- **Exams**: 50 exams across different types (Monthly, Midterm, Final, Assignment)
- **Assignments**: 50 assignments with proper due dates
- **Results**: 100 results linking students to exams/assignments
- **Attendance**: 200 attendance records with 85% average attendance rate

### 5. **Events & Communication**

- **Events**: Class-specific activities and general school events
- **Announcements**: Regular announcements for different classes

## Key Features

### Enhanced Calendar Integration

- **Structured Time Slots**: Pre-defined time slots ensure consistent scheduling
- **Subject Distribution**: Intelligent subject rotation across classes and days
- **Teacher Assignment**: Balanced teacher workload distribution
- **Conflict Prevention**: Systematic approach prevents scheduling conflicts

### Data Relationships

- **Referential Integrity**: All foreign key relationships properly maintained
- **Realistic Associations**: Students assigned to appropriate classes based on grade
- **Stream-based Grouping**: Students in Science/Arts/Commerce streams
- **Subject-Class Mapping**: Subjects assigned to relevant classes only

### Performance Optimization

- **Batch Processing**: Lessons created in batches of 100 for better performance
- **Transaction Safety**: Database operations wrapped in transactions
- **Memory Efficient**: Optimized data creation to prevent memory issues

## Usage

### Running the Combined Seed

```bash
# Run the combined seed (recommended)
npm run db:seed

# Alternative: Run with Prisma CLI
npx prisma db seed
```

### Individual Seed Options

```bash
# Run original seed only
npm run db:seed:original

# Run calendar seed only (requires existing data)
npm run db:seed:calendar
```

### Database Reset and Seed

```bash
# Reset database and run combined seed
npx prisma migrate reset
# This will automatically run the combined seed after reset
```

## Data Volumes

| Model         | Count | Description                                       |
| ------------- | ----- | ------------------------------------------------- |
| Admins        | 3     | System administrators                             |
| Parents       | 20    | Parent accounts                                   |
| Teachers      | 30    | Teaching staff                                    |
| Grades        | 6     | Grade levels 7-12                                 |
| Subjects      | 18    | Academic subjects                                 |
| Classes       | 14    | Class sections with streams                       |
| Students      | 200   | Student accounts                                  |
| Lessons       | ~490  | Complete schedule (14 classes × 5 days × 7 slots) |
| Exams         | 50    | Various exam types                                |
| Assignments   | 50    | Homework and projects                             |
| Results       | 100   | Student performance records                       |
| Attendance    | 200   | Daily attendance records                          |
| Events        | ~24   | School and class events                           |
| Announcements | 15    | School announcements                              |

## Calendar Schedule Structure

### Time Slots

- **Slot 1**: 09:00 - 09:50
- **Slot 2**: 10:00 - 10:50
- **Slot 3**: 11:00 - 11:50
- **Slot 4**: 12:00 - 12:50
- **Slot 5**: 13:00 - 13:50
- **Slot 6**: 14:00 - 14:50
- **Slot 7**: 15:00 - 15:50

### Subject Distribution Logic

- Subjects are rotated across time slots and days
- Each class gets a balanced mix of subjects
- Stream-specific subjects (Physics, Chemistry for Science) are properly assigned
- Teachers are distributed to prevent conflicts

## Benefits of Combined Approach

1. **Complete System**: Single command sets up entire school management system
2. **Realistic Data**: Proper relationships and realistic values
3. **Testing Ready**: Comprehensive data for testing all application features
4. **Development Friendly**: Easy to reset and recreate consistent test environment
5. **Performance Optimized**: Efficient data creation and relationship management

## Troubleshooting

### Common Issues

1. **Memory Issues**: Large datasets may cause memory problems
   - Solution: Reduce batch sizes or data volumes in the seed file

2. **Relationship Errors**: Foreign key constraint violations
   - Solution: Ensure proper cleanup order in the seed file

3. **Duplicate Data**: Unique constraint violations
   - Solution: Database is cleaned before seeding, but check for existing data

### Verification

After seeding, verify the data:

```bash
# Check record counts
npx prisma studio
```

Or use database queries to verify relationships and data integrity.

## Customization

The seed file can be customized by modifying:

- **Data volumes**: Change array lengths for different model counts
- **Time slots**: Modify `timeSlots` array for different schedule
- **Subject data**: Update `subjectData` array for different subjects
- **Class structure**: Modify `classNames` array for different classes

## Future Enhancements

Potential improvements:

- Configuration file for customizable data volumes
- Subject-specific class assignments based on streams
- More sophisticated teacher specialization
- Seasonal event scheduling
- Grade-appropriate subject difficulty levels
