import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/hash";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    return NextResponse.json({
      success: true,
      message: "Password hashed successfully",
      data: {
        originalPassword: password,
        hashedPassword,
        hashLength: hashedPassword.length,
      },
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Password Hash Demo API",
    description: "Send a POST request with a 'password' field to hash it",
    example: {
      method: "POST",
      body: {
        password: "your-password-here",
      },
    },
    endpoints: {
      "POST /api/demo/hash-password": "Hash a password",
    },
  });
}
