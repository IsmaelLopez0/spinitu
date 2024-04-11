import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function POST(req) {
  const body = await req.json();
  try {
    const { userId, classId, position } = body;
    const [canReserv] = await prisma.membership.findMany({
      where: { user_id: userId, is_active: true },
      select: {
        id: true,
        days_to_access: true,
      },
    });
    if (canReserv.days_to_access <= 0) {
      throw new Error('User with no classes available');
    }
    const res = await Promise.all([
      prisma.reservation.create({
        data: { user_id: userId, class_id: classId, position },
      }),
      prisma.membership.update({
        where: { id: canReserv.id },
        data: {
          days_to_access: {
            increment: -1,
          },
        },
      }),
    ]);
    try {
      await prisma.membership.update({
        where: { id: canReserv.id, days_to_access: 0 },
        data: { end_date: new Date(), is_active: false },
      });
    } catch (err) {}
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
