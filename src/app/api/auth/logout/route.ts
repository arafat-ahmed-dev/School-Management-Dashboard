import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cors } from "@/lib/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  return cors(request, async () => {
    const accessToken = request.cookies.get("accessToken")?.value;

    // Check if access token is missing
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: Missing access token" },
        { status: 401 }
      );
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as unknown as { userId: string; userType: string };

      const { userId, userType } = decoded;

      // Log user data for debugging
      console.log("userId: " + userId);
      console.log("userType: " + userType);

      // Find the active session for the user in the database
      const session = await prisma.session.findFirst({
        where: {
          userId: userId,
          userType: userType, // Query based on userId and userType
        },
      });

      // If no active session exists, return an error
      if (!session) {
        return NextResponse.json(
          { error: "No active session found" },
          { status: 400 }
        );
      }

      // Invalidate the session (delete the session record)
      await prisma.session.delete({
        where: { id: session.id },
      });

      // Handle the logout logic based on user role
      const updateData = { refreshToken: null };

      switch (userType) {
        case "Admin":
          await prisma.admin.update({
            where: { id: userId },
            data: updateData,
          });
          break;
        case "Teacher":
          await prisma.teacher.update({
            where: { id: userId },
            data: updateData,
          });
          break;
        case "Student":
          await prisma.student.update({
            where: { id: userId },
            data: updateData,
          });
          break;
        case "Parent":
          await prisma.parent.update({
            where: { id: userId },
            data: updateData,
          });
          break;
        default:
          return NextResponse.json(
            { error: "Unauthorized: Invalid user role" },
            { status: 401 }
          );
      }

      // Prepare the response to confirm logout
      const response = NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
      );

      // Clear cookies for logout
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    } catch (error) {
      // Log the error for debugging
      console.error("Error during logout:", error);

      const errorMessage = (error as Error).message;
      return NextResponse.json(
        { message: "Internal Server Error", error: errorMessage },
        { status: 500 }
      );
    }
  });
};
