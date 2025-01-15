import { NextRequest } from "next/server";
import { PrismaClient, Admin, Teacher, Student, Parent } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 422 }
      );
    }

    // Check user type and find user
    const user =
      ((await prisma.admin.findUnique({ where: { username } })) as Admin) ||
      ((await prisma.teacher.findUnique({ where: { username } })) as Teacher) ||
      ((await prisma.student.findUnique({ where: { username } })) as Student) ||
      ((await prisma.parent.findUnique({ where: { username } })) as Parent);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is approved
    if ("approved" in user && !user.approved) {
      return Response.json({ message: "User not approved" }, { status: 403 });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }

    return Response.json(
      { message: "Login successful", user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Internal Server Error in Login" },
      { status: 500 }
    );
  }
};
