import  bcryptjs  from 'bcryptjs';

import { NextRequest } from "next/server";
import prisma from "../../../../prisma";
import { any } from 'zod';

export const POST = async (request: NextRequest) => {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return Response.json({ message: "All field Required" }, { status: 422 });
    }
    const dbConnect:any = await prisma.$connect();
    if (dbConnect) {
      console.log("DataBase Connected Successfully", dbConnect);
    }
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user) {
      return Response.json({ message: "User already exisit" }, { status: 400 });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    return Response.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Internal Server Error in Registration" },
      { status: 500 }
    );
  } finally {
    // Close the database connection
    await prisma.$disconnect();
  }
};
