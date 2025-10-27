# Access Control Summary for List Routes

This document outlines what routes and files each user role (Student, Parent, Teacher, Admin) can access in the `/list` directory, along with their specific permissions and restrictions.

## 📁 List Directory Structure & Access Control

### 🎓 **STUDENT** Access & Restrictions

#### **Routes Students CAN Access:**

1. **`/list/students/[their-own-id]`** - Individual student detail page
   - **Access Control**: Students can ONLY view their own profile (`currentUserId === studentId`)
   - **Automatic Redirect**: If student tries to access another student's page, they're redirected to their own page
   - **Available Features**:
     - Personal information display
     - Class and grade information
     - Personal schedule calendar
     - Individual performance data
     - Announcements
     - Role-specific shortcuts (exams, assignments, results)

2. **`/list/results`** - Results listing page
   - **Data Filtering**: Students see ONLY their own results (`query.studentId = currentUserId`)
   - **View Permission**: Can view all their exam and assignment results
   - **Actions**: VIEW ONLY - No create/edit/delete actions

3. **`/list/results/[id]`** - Individual result detail page
   - **Access Control**: Students can only access their own results (`result.studentId !== currentUserId` → notFound())
   - **Features**: Detailed result view with score, grade, percentage

4. **`/list/exams`** - Exams listing page
   - **Data Filtering**: Students see only exams for their class (`studentClassId` filtering)
   - **View Permission**: Can see exam details, dates, subjects
   - **Actions**: VIEW ONLY - No CRUD operations

5. **`/list/assignments`** - Assignments listing page
   - **Data Filtering**: Similar to exams, filtered by student's class
   - **View Permission**: Can see assignment details and due dates
   - **Actions**: VIEW ONLY - No CRUD operations

#### **Routes Students CANNOT Access:**

- `/list/students` (main listing) - No general student list access
- `/list/teachers` - Cannot access teacher listings
- `/list/teachers/[id]` - Automatic redirect to `/student` dashboard
- `/list/parents` - Cannot access parent listings
- Any admin-specific routes

#### **Student Action Restrictions:**

- **NO CREATE** operations on any entity
- **NO UPDATE** operations on any entity
- **NO DELETE** operations on any entity
- **Actions Column**: Hidden for students in most tables
- **Form Modals**: Not available for students

---

### 👨‍👩‍👧‍👦 **PARENT** Access & Restrictions

#### **Routes Parents CAN Access:**

1. **`/list/results`** - Results listing page
   - **Data Filtering**: Parents see ONLY their children's results (`query.student = { parentId: currentUserId }`)
   - **View Permission**: Can view all results for their children
   - **Actions**: VIEW ONLY - No create/edit/delete actions

2. **`/list/results/[id]`** - Individual result detail page
   - **Access Control**: Parents can only access their children's results (`result.student?.parentId !== currentUserId` → notFound())
   - **Features**: Detailed result view for their children

#### **Routes Parents CANNOT Access:**

- `/list/students/[id]` - Automatic redirect to `/parent` dashboard
- `/list/teachers/[id]` - Automatic redirect to `/parent` dashboard
- `/list/students` - No student listing access
- `/list/teachers` - No teacher listing access
- `/list/parents` - No parent listing access (interesting restriction)

#### **Parent Action Restrictions:**

- **NO CREATE** operations
- **NO UPDATE** operations
- **NO DELETE** operations
- **Limited View**: Only child-related data

---

### 👨‍🏫 **TEACHER** Access & Restrictions

#### **Routes Teachers CAN Access:**

1. **`/list/teachers/[their-own-id]`** - Individual teacher detail page
   - **Access Control**: Teachers can ONLY view their own profile (`currentUserId !== teacherId` → redirect to own page)
   - **Available Features**:
     - Personal information display
     - Subjects taught
     - Classes supervised
     - Teaching schedule calendar
     - Performance analytics
     - Role-specific shortcuts

2. **`/list/teachers`** - Teacher listing page
   - **View Permission**: Can see other teachers (general directory access)
   - **Actions**: VIEW ONLY - Only admins can create/edit/delete teachers
   - **Actions Column**: Visible but restricted (`role === "admin"` check for CRUD operations)

3. **`/list/students`** - Students listing page
   - **View Permission**: Can see all approved students
   - **Actions**: VIEW ONLY - Only admins can create/edit/delete students
   - **Data Access**: Full student information including grades, parent info

4. **`/list/students/[id]`** - Individual student detail page
   - **Access**: Can view any student's detail page
   - **Data Service**: Applies appropriate filtering based on teacher role

5. **`/list/results`** - Results listing page
   - **Data Access**: Can see ALL student results (no filtering applied)
   - **Actions**: VIEW ONLY - Only admins can create/edit/delete results

6. **`/list/exams`** - Exams listing page
   - **View Permission**: Can see all exams
   - **Actions**: Some CRUD operations available (`role === "admin" || role === "teacher"`)

7. **`/list/assignments`** - Assignments listing page
   - **View Permission**: Can see all assignments
   - **Actions**: Some CRUD operations available (`role === "admin" || role === "teacher"`)

#### **Teacher Action Restrictions:**

- **Limited CRUD**: Can perform some operations on exams/assignments
- **No User Management**: Cannot create/edit/delete students, teachers, or parents
- **Profile Restrictions**: Can only edit their own profile

---

### 👑 **ADMIN** Access & Permissions

#### **Routes Admins CAN Access:**

- **ALL ROUTES** - No restrictions
- **Full CRUD Access** on all entities:
  - Students (`/list/students` + individual pages)
  - Teachers (`/list/teachers` + individual pages)
  - Parents (`/list/parents`)
  - Results (`/list/results` + individual pages)
  - Exams (`/list/exams`)
  - Assignments (`/list/assignments`)
  - All other list routes

#### **Admin Capabilities:**

- **CREATE**: All FormModal create operations available
- **UPDATE**: All FormModal update operations available
- **DELETE**: All FormModal delete operations available
- **View All Data**: No filtering applied to any queries
- **Full Access**: Can access any individual detail page

---

## 🔒 Security Implementation Details

### **URL-Level Access Control:**

- Individual detail pages (`[id]` routes) implement session-based access control
- Automatic redirects for unauthorized access attempts
- Role-based routing in individual pages

### **Data-Level Access Control:**

- Database queries filtered by user role and ownership
- Students see only their own data
- Parents see only their children's data
- Teachers see broader data but with action restrictions
- Admins see everything with full permissions

### **UI-Level Access Control:**

- Actions columns hidden/shown based on role
- Form modals conditionally rendered
- Create buttons only visible to authorized roles
- Role-specific shortcuts and navigation

### **Key Access Control Files:**

- `/src/lib/access-control.ts` - Central access control utilities
- Individual page files implement role checks
- Session management through NextAuth
- Database-level filtering in Prisma queries

### **Access Control Patterns:**

1. **Authentication Check**: `session?.user` validation
2. **Role-Based Routing**: Redirect based on user role
3. **Data Ownership**: Filter queries by user relationships
4. **UI Conditional Rendering**: Show/hide based on permissions
5. **Action Restrictions**: Prevent unauthorized operations

This system ensures proper separation of concerns and data security across all user roles.
