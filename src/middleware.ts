import  jwt  from 'jsonwebtoken';
import { NextResponse, NextRequest } from "next/server";

export function verifyToken(token: string) {
  // Decode and verify the token using the secret key
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("accessToken");

  const currentPath = new URL(request.url).pathname;

  // Block access to login, forget password, and reset password pages if the token exists
  const authPages = ["/login", "/forget-password", "/reset-password"];
  if (tokenCookie) {
    try {
      const token = tokenCookie.value; // Extract the token value
      const decoded = verifyToken(token);
      const { userType } = decoded as { userId: string; userType: string };

      if (authPages.includes(currentPath)) {
        return NextResponse.redirect(
          new URL(`/${userType.toLowerCase()}`, request.url)
        );
      }
    } catch (error) {
      console.error("Error decoding token for redirect:", error);
    }
  } else {
    // Allow access to login, forget password, and reset password pages if no token is present
    if (authPages.includes(currentPath)) {
      return NextResponse.next();
    }
    // If no token cookie is present, redirect to the home page for protected paths
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = tokenCookie.value; // Extract the token value
  let decoded;

  try {
    // Verify the token and extract userId and userType
    decoded = verifyToken(token);

    const { userId, userType } = decoded as {
      userId: string;
      userType: string;
    };

    // Add user info to the request headers for use in downstream handlers
    request.headers.set("X-User-ID", userId);
    request.headers.set("X-User-Type", userType);

    // Log the headers to verify they are set
    console.log("X-User-ID:", userId);
    console.log("X-User-Type:", userType);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Invalid or expired token:", errorMessage);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If authenticated, proceed to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/list/:path*", // All list routes
    "/login", // Specific login route
    "/forget-password", // Specific forget-password route
    "/reset-password", // Specific reset-password route
    "/api/logout", // All API routes
  ], // Apply middleware to these paths
};
