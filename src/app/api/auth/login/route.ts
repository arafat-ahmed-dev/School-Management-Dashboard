import { NextRequest } from "next/server";
import { PrismaClient, Admin, Teacher, Student, Parent } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const {userType ,  username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 422 }
      );
    }

    // Check user type and find user
    let user;
    if (userType === 'Admin') {
      user = await prisma.admin.findUnique({ where: { username } });
    } else if (userType === 'Teacher') {
      user = await prisma.teacher.findUnique({ where: { username } });
    } else if (userType === 'Student') {
      user = await prisma.student.findUnique({ where: { username } });
    } else if (userType === 'Parent') {
      user = await prisma.parent.findUnique({ where: { username } });
    } else {
      return Response.json({ message: "Invalid user type" }, { status: 400 });
    }
      
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is approved
    if (!user.approved) {
      return Response.json({ message: "User not approved" }, { status: 403 });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }

    // Log successful login
    console.log(`User ${username} logged in successfully.`);

    return Response.json(
      { message: "Login successful", user , userRole : userType}, 
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Internal Server Error in Login" , error},
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
    console.log("disconnect the database");
  }
};
