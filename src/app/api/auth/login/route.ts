import { NextRequest } from "next/server";
import { PrismaClient, Approve } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    // Destructure required fields from request
    const { userType, username, password } = await request.json();

    // Validate required fields
    if (!username || !password || !userType) {
      return Response.json(
        { message: "All fields are required" },
        { status: 422 }
      );
    }

    // Check user type and find the respective user in the database
    let user;
    switch (userType) {
      case "Admin":
        user = await prisma.admin.findUnique({ where: { username } });
        break;
      case "Teacher":
        user = await prisma.teacher.findUnique({ where: { username } });
        break;
      case "Student":
        user = await prisma.student.findUnique({ where: { username } });
        break;
      case "Parent":
        user = await prisma.parent.findUnique({ where: { username } });
        break;
      default:
        return Response.json({ message: "Invalid user type" }, { status: 400 });
    }

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is approved
    if (user.approved !== Approve.ACCEPTED) {
      return Response.json({ message: "User not approved" }, { status: 403 });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }

    // Return successful login response
    return Response.json(
      { message: "Login successful", user, userRole: userType },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors gracefully
    return Response.json(
      { message: "Internal Server Error in Login", error },
      { status: 500 }
    );
  } finally {
    // Ensure proper database disconnection
    await prisma.$disconnect();
  }
};
