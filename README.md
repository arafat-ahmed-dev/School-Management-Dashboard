# Next.js Dashboard UI

A modern, full-stack dashboard application built with Next.js, TypeScript, and Tailwind CSS. This project provides a comprehensive admin interface for managing school-related data and analytics.

## Features

- **Responsive Design**: Fully responsive layout optimized for all devices
- **Data Visualization**: Interactive charts and graphs for analytics
- **CRUD Operations**: Create, Read, Update, Delete functionality for various entities
- **Authentication**: Secure user authentication system
- **Modular Components**: Reusable UI components for rapid development
- **Dark Mode Support**: Built-in dark theme support
- **Form Management**: Comprehensive form handling with validation
- **Data Tables**: Advanced data tables with sorting, filtering, and pagination
- **User Roles and Permissions**: Fine-grained access control for different user roles
- **Attendance Tracking**: Visual representation of attendance data with charts
- **Event Management**: Manage and display events with dedicated components
- **Performance Insights**: Detailed performance analytics for students and classes
- **Dynamic Forms**: Forms for student and teacher registration with validation

## Technology Stack

- **Frontend**: 
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Chart.js for data visualization
- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database
- **Tools**:
  - ESLint for code linting
  - Prettier for code formatting
  - Husky for Git hooks

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/next-dashboard-ui.git
   ```

2. Navigate to the project directory:
   ```bash
   cd next-dashboard-ui
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   NEXTAUTH_SECRET="your-secret-key"
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
next-dashboard-ui/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions and data
│   └── styles/        # Global styles
├── prisma/            # Prisma schema and migrations
├── .eslintrc.json     # ESLint configuration
├── next.config.mjs    # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Available Scripts

- `dev`: Starts the development server
- `build`: Builds the application for production
- `start`: Starts the production server
- `lint`: Runs ESLint
- `format`: Formats code with Prettier
- `prisma:generate`: Generates Prisma client
- `prisma:migrate`: Runs database migrations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
