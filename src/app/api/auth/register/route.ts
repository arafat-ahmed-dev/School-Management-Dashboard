import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/argon2";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const {
      userType,
      username,
      password,
      name,
      email,
      class: className,
      studentUsername,
      parentContact,
      subjectsId,
      ...additionalFields
    } = await request.json();
    console.log(
      userType,
      username,
      password,
      name,
      email,
      className,
      studentUsername,
      parentContact,
      subjectsId,
      additionalFields,
    );

    // Validate required fields
    if (!userType || !username || !password || !name || !email) {
      return NextResponse.json(
        {
          message:
            "All fields (userType, username, password, name, email) are required.",
        },
        { status: 422 },
      );
    }

    // Validate username, password, and email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (username.length < 3 || password.length < 6 || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          message:
            "Username must be at least 3 characters, password at least 6 characters, and email must be valid.",
        },
        { status: 400 },
      );
    }

    // Check if username or email already exists
    let existingUserByUsername, existingUserByEmail;
    switch (userType) {
      case "Admin":
        existingUserByUsername = await prisma.admin.findUnique({
          where: { username },
        });
        existingUserByEmail = await prisma.admin.findUnique({
          where: { email },
        });
        break;
      case "Teacher":
        existingUserByUsername = await prisma.teacher.findUnique({
          where: { username },
        });
        existingUserByEmail = await prisma.teacher.findUnique({
          where: { email },
        });
        break;
      case "Student":
        existingUserByUsername = await prisma.student.findUnique({
          where: { username },
        });
        existingUserByEmail = await prisma.student.findUnique({
          where: { email },
        });
        break;
      case "Parent":
        existingUserByUsername = await prisma.parent.findUnique({
          where: { username },
        });
        existingUserByEmail = await prisma.parent.findUnique({
          where: { email },
        });
        break;
      default:
        return NextResponse.json(
          {
            message:
              "Invalid user type. Must be one of Admin, Teacher, Student, or Parent.",
          },
          { status: 400 },
        );
    }

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "A user with this username already exists." },
        { status: 400 },
      );
    }

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 400 },
      );
    }

    // Hash password before saving to database (security best practice)
    const hashedPassword = await hashPassword(password);

    // Create new user in the database
    let newUser;
    switch (userType) {
      case "Admin":
        newUser = await prisma.admin.create({
          data: {
            username,
            password: hashedPassword,
            name,
            email,
            ...additionalFields,
          },
        });
        break;
      case "Teacher":
        if (!subjectsId || subjectsId.length === 0) {
          return NextResponse.json(
            { message: "At least one subject must be provided." },
            { status: 400 },
          );
        }
        const subjects = await prisma.subject.findUnique({
          where: { subjectId: subjectsId[0] },
        });
        newUser = await prisma.teacher.create({
          data: {
            username,
            password: hashedPassword,
            email,
            name,
            subjects: {
              connect: subjects?.id,
            },
            ...additionalFields,
          },
        });
        break;
      case "Student":
        const studentClass = await prisma.class.findUnique({
          where: { name: className },
        });
        if (!studentClass) {
          return NextResponse.json(
            { message: "Invalid class name provided." },
            { status: 400 },
          );
        }
        newUser = await prisma.student.create({
          data: {
            username,
            password: hashedPassword,
            name,
            email,
            classId: studentClass.id,
            parentContact,
            ...additionalFields,
          },
        });
        break;
      case "Parent":
        const parentClass = await prisma.class.findUnique({
          where: { name: className },
        });
        console.log(
          `Parent class ID: ${parentClass?.id}, Student username: ${studentUsername}`,
        );
        if (!parentClass) {
          return NextResponse.json(
            { message: "Invalid class name provided." },
            { status: 400 },
          );
        }
        const parentStudent = await prisma.student.findUnique({
          where: {
            username: studentUsername,
            classId: parentClass.id, // Ensure the student is in the specified class
          },
        });
        console.log(`Parent student: ${JSON.stringify(parentStudent)}`);
        if (!parentStudent) {
          console.log(
            `Student with username ${studentUsername} not found in class ID ${parentClass.id}`,
          );
          return NextResponse.json(
            {
              message:
                "Invalid student username or the student is not in the specified class.",
            },
            { status: 400 },
          );
        }
        newUser = await prisma.parent.create({
          data: {
            username,
            password: hashedPassword,
            email,
            name,
            ...additionalFields,
          },
        });
        break;
    }

    return NextResponse.json(
      {
        message: "User created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    // Log error and return a generic error message
    console.error("Error in registration:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error in Registration.",
        error,
      },
      { status: 500 },
    );
  } finally {
    // Ensure proper database disconnection after operations
    await prisma.$disconnect();
  }
};
