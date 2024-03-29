import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function POST(req) {
  const body = await req.json();
  try {
    const { userId, classId, position } = body;
    const res = await prisma.reservation.create({
      data: { user_id: userId, class_id: classId, position },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
