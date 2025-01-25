import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cors } from "@/lib/cors";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  return cors(request, async () => {
    try {
      const { id, action, role } = await request.json();

      if (!id || !action || !role) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      let updatedRecord;
      if (action.toUpperCase() === "CANCEL") {
        updatedRecord = await (prisma[role] as any).delete({
          where: { id },
        });
      } else {
        updatedRecord = await (prisma[role] as any).update({
          where: { id },
          data: { approved: action.toUpperCase() },
        });
      }

      return NextResponse.json(
        { message: "Action completed successfully", updatedRecord },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Internal Server Error", error },
        { status: 500 }
      );
    }
  });
};
