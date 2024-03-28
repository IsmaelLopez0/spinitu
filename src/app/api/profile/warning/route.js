import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/libs/prisma';
import { genericFetch } from '@/libs/externalAPIs';

export async function PUT(req) {
  const body = await req.json();

  try {
    const { email } = body;
    const currentPassword = await prisma.user.findUnique({
      where: { email },
      select: {
        password: true,
      },
    });
    const matchPassword = await bcrypt.compare(
      body.currentPassword,
      currentPassword.password,
    );
    if (!matchPassword) throw new Error('Wrong password');

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    const params = {
      url: '/user',
      body: {
        email,
        password: hashedPassword,
      },
      method: 'PUT',
    };
    const res = await genericFetch(params);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  try {
    const { email } = body;
    await prisma.user.update({ where: { email }, data: { isActive: false } });
    return NextResponse.json('Ok', { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
