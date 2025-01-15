import bcryptjs from "bcryptjs";
import { NextRequest } from "next/server";
import { PrismaClient, Approve } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { userType, username, password, name, ...additionalFields } =
      await request.json();

    if (!userType || !username || !password || !name) {
      return Response.json(
        { message: "All fields are required" },
        { status: 422 }
      );
    }

    // Validate username and password formats
    if (username.length < 3 || password.length < 6) {
      return Response.json(
        { message: "Username must be at least 3 characters and password at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if username already exists
    let existingUser;
    switch (userType) {
      case "Admin":
        existingUser = await prisma.admin.findUnique({ where: { username } });
        break;
      case "Teacher":
        existingUser = await prisma.teacher.findUnique({ where: { username } });
        break;
      case "Student":
        existingUser = await prisma.student.findUnique({ where: { username } });
        break;
      case "Parent":
        existingUser = await prisma.parent.findUnique({ where: { username } });
        break;
      default:
        return Response.json({ message: "Invalid user type" }, { status: 400 });
    }

    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Set approval status based on user type
    const approved = userType === "Admin" ? Approve.ACCEPTED : Approve.PENDING;

    // Log the data being sent to Prisma
    console.log("Creating new user with data:", {
      username,
      password: hashedPassword,
      name,
      ...additionalFields,
    });

    // Create new user with appropriate fields
    let newUser;
    switch (userType) {
      case "Admin":
        newUser = await prisma.admin.create({
          data: {
            username,
            password: hashedPassword,
            name,
            approved,
            ...additionalFields,
          },
        });
        break;
      case "Teacher":
        newUser = await prisma.teacher.create({
          data: {
            username,
            password: hashedPassword,
            approved,
            ...additionalFields,
          },
        });
        break;
      case "Student":
        newUser = await prisma.student.create({
          data: {
            username,
            password: hashedPassword,
            approved,
            ...additionalFields,
          },
        });
        break;
      case "Parent":
        newUser = await prisma.parent.create({
          data: {
            username,
            password: hashedPassword,
            approved,
            ...additionalFields,
          },
        });
        break;
    }
    return Response.json(
      {
        message: "User created successfully",
        requiresApproval: !approved,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({
      message: "Internal Server Error in Registration",
      error,
    });
  } finally {
    // disconnect the database
    await prisma.$disconnect();
  }
};
