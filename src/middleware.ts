import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = checkAuthentication(request); // Replace with actual authentication logic
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

const checkAuthentication = (request: NextRequest) => {
  // Implement your authentication logic here
  // For example, check for a valid token in cookies or headers
  const token = request.cookies.get("authToken");
  return token !== undefined; // Example check
};

export const config = {
  matcher: "/dashboard/:path*",
};
