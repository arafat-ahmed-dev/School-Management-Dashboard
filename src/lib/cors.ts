import { NextRequest, NextResponse } from "next/server";

// cors.ts
export const cors = async (req: NextRequest, next: Function) => {
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*"); // You can replace '*' with your domain
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return res;
  }

  // Call the next handler if the request is not an OPTIONS
  return next(req, res);
};
