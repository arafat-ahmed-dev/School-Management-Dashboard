import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("accessToken");

  // If no token cookie is present, redirect to the login page
  if (!tokenCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = tokenCookie.value; // Extract the token value
  console.log(token)
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    // Add user info to the request headers for use in downstream handlers
    request.headers.set("X-User-ID", decoded.userId);
    request.headers.set("X-User-Type", decoded.userType);
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If authenticated, proceed to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*" , "/list/:path*"], // Apply middleware only to paths under /dashboard
};
