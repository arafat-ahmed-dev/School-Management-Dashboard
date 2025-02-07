import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { cors } from "@/lib/cors";
import connectToDatabase from "@/helper/databaseConnection";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  return cors(request, async () => {
    try {
      const { userType, username, password } = await request.json();

      if (!username || !password || !userType) {
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 422 }
        );
      }

      await connectToDatabase();

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

      if (user.approved !== "ACCEPTED" && user.approved !== "CANCEL") {
        return NextResponse.json(
          { message: "User not approved" },
          { status: 403 }
        );
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid user credentials" },
          { status: 401 }
        );
      }

      // Generate Access and Refresh Tokens
      const secretKey = new TextEncoder().encode(
        process.env.ACCESS_TOKEN_SECRET
      );
      const refreshSecretKey = new TextEncoder().encode(
        process.env.REFRESH_TOKEN_SECRET
      );

      const accessToken = await new SignJWT({
        userId: user.id,
        userType: userType,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "1h")
        .sign(secretKey);

      const refreshToken = await new SignJWT({
        userId: user.id,
        userType: userType,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || "7d")
        .sign(refreshSecretKey);

      const response = NextResponse.json(
        {
          message: "Login successful",
          user,
          userRole: userType,
          accessToken,
          refreshToken,
        },
        { status: 200 }
      );

      // Set Cookies
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600, // 1 hour
      });

      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 3600, // 7 days
      });

      return response;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(errorMessage);
      return NextResponse.json(
        { message: "Internal Server Error", error: errorMessage },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  });
};
