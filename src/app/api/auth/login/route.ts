// your API route
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Approve } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { cors } from "@/lib/cors"; // Import the custom cors function

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  // Use CORS middleware
  return cors(request, async (req: NextRequest, res: NextResponse) => {
    try {
      // Destructure required fields from request body
      const { userType, username, password } = await req.json();
      console.log(userType, username, password);
      if (!username || !password || !userType) {
        return NextResponse.json(
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
          return NextResponse.json(
            { message: "Invalid user type" },
            { status: 400 }
          );
      }

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Check if user is approved
      if (user.approved !== Approve.ACCEPTED) {
        return NextResponse.json(
          { message: "User not approved" },
          { status: 403 }
        );
      }

      // Validate password
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }

      // Return successful login response
      return NextResponse.json(
        { message: "Login successful", user, userRole: userType },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Internal Server Error in Login", error },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  });
};
