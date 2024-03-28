import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export const fetchCache = 'default-no-store';

export async function POST(req) {
  const data = await req.json();
  try {
    const { userId, title, body } = data;
    const res = await prisma.notification.create({
      data: {
        user_id: userId,
        title,
        body,
      },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId');
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: Number(userId) },
      select: {
        id: true,
        fecha: true,
        title: true,
        body: true,
        leido: true,
      },
      orderBy: [{ leido: 'asc' }],
    });
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}

export async function PUT(req) {
  const data = await req.json();
  try {
    const { userId, notificationId } = data;
    const where = { user_id: userId };
    if (notificationId) {
      where.id = notificationId;
    }
    const res = await prisma.notification.update({
      where,
      data: { leido: true },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
