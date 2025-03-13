import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma";
import { SignJWT } from "jose";

export const GET = async (request: NextRequest) => {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;
  console.log(refreshToken);
  if (accessToken) {
    return NextResponse.json({
      message: "Access token is valid",
    });
  }
  // Check if refresh token is missing
  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh token is missing" },
      { status: 401 },
    );
  }

  try {
    // Check if refresh token is valid
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as unknown as { userId: string; userType: string };
    const { userId, userType } = decoded;

    // Log user data for debugging
    console.log("userId: " + userId);
    console.log("userType: " + userType);

    // Fetch user data from your database
    let user;
    switch (userType) {
      case "Admin":
        user = await prisma.admin.findUnique({ where: { id: userId } });
        break;
      case "Teacher":
        user = await prisma.teacher.findUnique({ where: { id: userId } });
        break;
      case "Student":
        user = await prisma.student.findUnique({ where: { id: userId } });
        break;
      case "Parent":
        user = await prisma.parent.findUnique({ where: { id: userId } });
        break;
      default:
        return NextResponse.json(
          { message: "Invalid user type" },
          { status: 400 },
        );
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new access token
    const secretKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const accessToken = await new SignJWT({
      userId: user.id,
      userType,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "1h")
      .sign(secretKey);

    // set new access token in cookie
    const response = NextResponse.json({
      message: "Token refreshed",
      user,
      userRole: userType,
      accessToken,
    });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
    });

    // Return response with the new token
    return response; // <-- Don't forget to return the response!
  } catch (error) {
    console.error(error); // Log for debugging
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 },
    );
  }
};
