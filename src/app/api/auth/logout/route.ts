import  jwt  from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { cors } from "@/lib/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  return cors(request, async () => {
    // Get user ID and user role from headers
    const accessToken = request.cookies.get("accessToken")?.value;
    try {
      // Check if the headers are present
      if (!accessToken) {
        return NextResponse.json(
          { error: "Unauthorized: Missing user data" },
          { status: 401 }
        );
      }
       const decoded = jwt.verify(
         accessToken,
         process.env.ACCESS_TOKEN_SECRET!
       ) as unknown as { userId: string; userType: string };

       // Access the payload
       const { userId, userType } = decoded as {
         userId: string;
         userType: string;
       };
      // Handle the logout logic based on user role
      switch (userType) {
        case "Admin":
          await prisma.admin.update({
            where: { id: userId },
            data: { refreshToken: null },
          });
          break;
        case "Teacher":
          await prisma.teacher.update({
            where: { id: userId },
            data: { refreshToken: null },
          });
          break;
        case "Student":
          await prisma.student.update({
            where: { id: userId },
            data: { refreshToken: null },
          });
          break;
        case "Parent":
          await prisma.parent.update({
            where: { id: userId },
            data: { refreshToken: null },
          });
          break;
        default:
          return NextResponse.json(
            { error: "Unauthorized: Invalid user role" },
            { status: 401 }
          );
      }

      // Prepare the response
      const response = NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
      );

      // Clear the cookies
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Internal Server Error", error },
        { status: 500 }
      );
    }
  });
};
