import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option"; // Adjust path if needed

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ user: session.user });
}
