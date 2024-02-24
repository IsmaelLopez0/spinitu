import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const emailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (emailFound) throw new Error("Email already exists");
    const { confirmPassword, ...userData } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...userData,
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
