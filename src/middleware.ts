import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use jose for JWT verification and signing

const matchers = [
  { matcher: /^\/admin(.*)$/, allowedRoles: ["admin"] },
  { matcher: /^\/student(.*)$/, allowedRoles: ["student"] },
  { matcher: /^\/teacher(.*)$/, allowedRoles: ["teacher"] },
  { matcher: /^\/parent(.*)$/, allowedRoles: ["parent"] },
  { matcher: /^\/list\/teachers$/, allowedRoles: ["admin", "teacher"] },
  { matcher: /^\/list\/students$/, allowedRoles: ["admin", "teacher"] },
  { matcher: /^\/list\/parents$/, allowedRoles: ["admin", "teacher"] },
  { matcher: /^\/list\/subjects$/, allowedRoles: ["admin"] },
  { matcher: /^\/list\/classes$/, allowedRoles: ["admin", "teacher"] },
  {
    matcher: /^\/list\/exams$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    matcher: /^\/list\/assignments$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    matcher: /^\/list\/results$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    matcher: /^\/list\/attendance$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    matcher: /^\/list\/events$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
  {
    matcher: /^\/list\/announcements$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
  { matcher: /^\/list\/approvements$/, allowedRoles: ["admin"] },
  {
    matcher: /^\/profile$/,
    allowedRoles: ["admin", "teacher", "student", "parent"],
  },
];

export default async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const requestedPath = url.pathname;

  console.log("Requested Path:", requestedPath); // Add logging

  // Allow public access to the landing page without checking accessToken
  if (requestedPath === "/") {
    return NextResponse.next();
  }

  // Extract accessToken from the cookies
  const accessToken = req.cookies.get("accessToken")?.value;

  // Allow access to login, register, forgetpassword pages if no accessToken is provided
  if (
    !accessToken &&
    ["/login", "/register", "/forgetpassword"].includes(requestedPath)
  ) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from the login, register, forgetpassword page
  if (
    accessToken &&
    ["/login", "/register", "/forgetpassword"].includes(requestedPath)
  ) {
    let userType;
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!)
      );
      userType = (payload as { userType: string }).userType.toLowerCase(); // Convert to lowercase
      return NextResponse.redirect(new URL(`/${userType}`, req.url));
    } catch (error) {
      console.error("Invalid access token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect to login if no accessToken is provided
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verify the accessToken
  let userType;
  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!)
    );
    userType = (payload as { userType: string }).userType.toLowerCase(); // Convert to lowercase
  } catch (error) {
    console.error("Invalid access token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect public users to the landing page if they try to access restricted paths
  if (userType === "public" && requestedPath !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check access for protected routes
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher.test(requestedPath)) {
      // Match the route using requestedPath
      if (!allowedRoles.includes(userType)) {
        return NextResponse.redirect(new URL(`/${userType}`, req.url)); // Redirect to their dashboard
      }
      break; // If a match is found and userType is allowed, no further checks are needed
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/parent/:path*",
    "/list/:path*",
    "/profile",
    "/login",
    "/register",
    "/forgetpassword",
  ], // Paths to apply the middleware
};
