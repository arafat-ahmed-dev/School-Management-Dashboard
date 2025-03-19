import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../../prisma";
import { verifyPassword } from "@/lib/argon2";
// import { Admin, Parent, Student, Teacher } from "@prisma/client";
import { NextAuthOptions } from "next-auth"; // ✅ Updated from bcrypt to argon2

type UserType = "Admin" | "Student" | "Teacher" | "Parent";
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userType: { label: "User Type", type: "text" },
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials.userType
        ) {
          throw new Error("All fields are required");
        }
        const username = credentials?.username;
        // 🔹 Find user in multiple tables (Admin, Teacher, Student, Parent)
        let user;
        switch (credentials.userType) {
          case "Admin":
            user = await prisma.admin.findUnique({ where: { username } });
            break;
          case "Student":
            user = await prisma.student.findUnique({ where: { username } });
            break;
          case "Teacher":
            user = await prisma.teacher.findUnique({ where: { username } });
            break;
          case "Parent":
            user = await prisma.parent.findUnique({ where: { username } });
            break;
          default:
            return null;
        }

        // 🔹 Validate user and password
        if (!user) {
          throw new Error("User not found");
        }
        if (!(await verifyPassword(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }

        // 🔹 Ensure user is approved
        if (user.approved !== "ACCEPTED") {
          throw new Error("Your account is not approved yet.");
        }
        const userType: UserType =
          credentials.userType.toLowerCase() as UserType;
        // 🔹 Return user with required `role` field
        return {
          id: user.id,
          name: user.name, // Assuming there's a `name` field
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: userType as UserType, // Assign user role correctly
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Make sure `role` is returned properly
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
