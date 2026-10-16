import prisma from "../../../../prisma";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });

    return Response.json(
      { status: "ok", database: "connected" },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Health check database connection failed:", error);

    return Response.json(
      { status: "error", database: "disconnected" },
      { status: 503, headers: noStoreHeaders }
    );
  }
}
