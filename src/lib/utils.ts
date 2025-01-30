import { clsx, type ClassValue } from "clsx";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import prisma from "../../prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleRefreshToken(
  refreshToken: string,
  req: NextRequest
) {
  try {
    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!)
    );

    const userId = payload.userId as string;
    const userType = (payload.userType as string)?.toLowerCase() || "user";

    if (!userId) {
      throw new Error("Invalid refresh token: userId is missing");
    }

    // Generate a new access token
    const newAccessToken = await new SignJWT({ userId, userType })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "1h")
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!));

    // Fetch user data from database
    const user = await getUserById(userId, userType);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Construct response with JSON data
    const response = NextResponse.json({
      success: true,
      user: {
        userId,
        userType,
        data: user, // User details from DB
      },
    });

    // Set the new accessToken in HttpOnly cookies
    response.cookies.set("accessToken", newAccessToken, { httpOnly: true });

    return response;
  } catch (error) {
    console.error("Invalid refresh token:", error);
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}


async function getUserById(userId: string, userType: string) {
  switch (userType) {
    case "admin":
      return prisma.admin.findUnique({ where: { id: userId } });
    case "teacher":
      return prisma.teacher.findUnique({ where: { id: userId } });
    case "student":
      return prisma.student.findUnique({ where: { id: userId } });
    case "parent":
      return prisma.parent.findUnique({ where: { id: userId } });
    default:
      return null;
  }
}

export async function getUser(accessToken: string) {
  if (!accessToken) {
    throw new Error("Access token is missing");
  }

  const { payload } = await jwtVerify(
    accessToken,
    new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!)
  );

  const userId = payload.userId as string;
  const userType = (payload.userType as string) || "user";

  if (!userId) {
    throw new Error("Invalid access token: userId is missing");
  }

  const user = await getUserById(userId, userType);
  if (!user) {
    return null;
  }

  return { userId, userType, data: user };
}

export default async function verifyUser(
  userId: string,
  userType: string,
  refreshToken: string
) {
  if (!userId || !userType || !refreshToken) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  const user = await getUserById(userId, userType);

  if (!user || user.refreshToken !== refreshToken) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  return NextResponse.json({ isValid: true }, { status: 200 });
}
