import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const requestedPath = req.nextUrl.pathname;
  console.log(token?.role);
  console.log("Requested Path:", requestedPath);

  // If user is authenticated and visits root path, redirect to their dashboard
  if (requestedPath === "/" && token) {
    return NextResponse.redirect(new URL(`/${token.role}`, req.url));
  }

  // If user is not authenticated and visits root path, show login page
  if (requestedPath === "/" && !token) {
    return NextResponse.next();
  }

  if (!token) {
    
    // Allow access to root path (which now shows login)
    if (requestedPath === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token.role === "public" && requestedPath !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher.test(requestedPath)) {
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
      }
      break;
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
  ],
};
