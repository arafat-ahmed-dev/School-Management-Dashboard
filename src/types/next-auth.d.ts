/* eslint-disable no-unused-vars */
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    phone?: string | null;
    address?: string | null;
    img?: string | null;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string | null;
      phone?: string | null;
      address?: string | null;
      img?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    username?: string | null;
    phone?: string | null;
    address?: string | null;
    img?: string | null;
  }
}
