import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/libs/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const emailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
        isActive: true,
      },
    });
    if (emailFound) throw new Error('Email already exists');
    const { confirmPassword, specializations, ...userData } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    if (specializations) {
      const specializationsParsed = specializations
        .split(',')
        .map((e) => e.trim());
      await prisma.coach.create({
        data: {
          user_id: newUser.id,
          specializations: JSON.stringify(specializationsParsed),
        },
      });
    }
    const { password, ...user } = newUser;
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
