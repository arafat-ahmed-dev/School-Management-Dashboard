import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { cors } from "@/lib/cors";
import prisma from "../../../../../prisma";

const ALLOWED_APPROVAL_ROLES = ["student", "teacher", "parent", "admin"] as const;

export const POST = async (request: NextRequest) => {
  return cors(request, async () => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return NextResponse.json(
          { message: "Unauthorized: Authentication required" },
          { status: 401 }
        );
      }

      if (session.user.role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden: Admin privileges required" },
          { status: 403 }
        );
      }

      const { id, action, role } = await request.json();

      if (!id || !action || !role) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      const normalizedRole = role.toLowerCase();
      if (!ALLOWED_APPROVAL_ROLES.includes(normalizedRole as any)) {
        return NextResponse.json(
          { message: "Invalid role specified" },
          { status: 400 }
        );
      }

      let updatedRecord;
      if (action.toUpperCase() === "CANCEL") {
        updatedRecord = await (prisma[normalizedRole as keyof typeof prisma] as any).delete({
          where: { id },
        });
      } else {
        updatedRecord = await (prisma[normalizedRole as keyof typeof prisma] as any).update({
          where: { id },
          data: { approved: action.toUpperCase() },
        });
      }

      return NextResponse.json(
        { message: "Action completed successfully", updatedRecord },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in approval action:", error);
      return NextResponse.json(
        { message: "Internal Server Error", error: (error as Error).message },
        { status: 500 }
      );
    }
  });
};

