import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const [emailFound, userFound] = await Promise.all([
      prisma.user.findUnique({
        where: {
          email: data.email,
        },
      }),
      prisma.user.findUnique({
        where: {
          email: data.email,
        },
      }),
    ]);
    if (userFound) throw new Error("User already exists");
    if (emailFound) throw new Error("Email already exists");
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });
    const { password, ...user } = newUser;
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
