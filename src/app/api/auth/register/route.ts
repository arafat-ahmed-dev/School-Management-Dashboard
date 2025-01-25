import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Approve } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { userType, username, password, name, email, ...additionalFields } =
      await request.json();
    console.log(userType, username, password, name, email, additionalFields);

    // Validate required fields
    if (!userType || !username || !password || !name || !email) {
      return NextResponse.json(
        {
          message:
            "All fields (userType, username, password, name, email) are required.",
        },
        { status: 422 }
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
        { status: 400 }
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
          { status: 400 }
        );
    }

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "A user with this username already exists." },
        { status: 400 }
      );
    }

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 400 }
      );
    }

    // Hash password before saving to database (security best practice)
    const hashedPassword = await bcryptjs.hash(password, 10);


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
        newUser = await prisma.teacher.create({
          data: {
            username,
            password: hashedPassword,
            email,
            name,

            ...additionalFields,
          },
        });
        break;
      case "Student":
        newUser = await prisma.student.create({
          data: {
            username,
            password: hashedPassword,
            name,
            email,

            ...additionalFields,
          },
        });
        break;
      case "Parent":
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
      { status: 201 }
    );
  } catch (error) {
    // Log error and return a generic error message
    console.error("Error in registration:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error in Registration.",
        error: error,
      },
      { status: 500 }
    );
  } finally {
    // Ensure proper database disconnection after operations
    await prisma.$disconnect();
  }
};
