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
    const userId = (payload as { userId: string }).userId;
    let userType = (payload as { userType?: string }).userType?.toLowerCase();

    if (!userType) {
      console.warn(
        "userType is missing in the refresh token payload. Defaulting to 'user'."
      );
    }
    if (!userId) {
      throw new Error("Invalid refresh token: userId is missing");
    }

    // Generate a new accessToken
    const newAccessToken = await new SignJWT({ userId, userType })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "1h")
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!));

    const response = NextResponse.redirect(new URL(`/${userType}`, req.url));
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.error("Invalid refresh token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
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
  console.log("Decoded Token:", payload); // Add logging
  const userId = (payload as { userId: string }).userId;
  let userType = (payload as { userType?: string }).userType;

  console.log("User ID:", userId);
  console.log("User Type:", userType);
  if (!userType) {
    console.warn(
      "userType is missing in the access token payload. Defaulting to 'user'."
    );
  }
  if (!userId) {
    throw new Error("Invalid access token: userId is missing");
  }
  return { userId, userType };
}
export default async function get(userId: string, userType: string, refreshToken: string) {
  if (
    typeof userId !== "string" ||
    typeof userType !== "string" ||
    typeof refreshToken !== "string"
  ) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  let user;
  switch (userType) {
    case "admin":
      user = await prisma.admin.findUnique({ where: { id: userId } });
      break;
    case "teacher":
      user = await prisma.teacher.findUnique({ where: { id: userId } });
      break;
    case "student":
      user = await prisma.student.findUnique({ where: { id: userId } });
      break;
    case "parent":
      user = await prisma.parent.findUnique({ where: { id: userId } });
      break;
    default:
      return NextResponse.json({ isValid: false }, { status: 400 });
  }

  if (!user || user.refreshToken !== refreshToken) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  return NextResponse.json({ isValid: true }, { status: 200 });
}
