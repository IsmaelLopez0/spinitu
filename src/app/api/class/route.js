import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { convertTZ } from '@/libs/_utilsFunctions';

export const fetchCache = 'default-no-store';

export async function POST(req) {
  const body = await req.json();
  try {
    const dateStart = new Date(body.dateStart);
    const name = `Class ${convertTZ(dateStart)}`;
    const description = `Class schedule ${dateStart.toTimeString()}`;
    const res = await prisma.class.create({
      data: {
        name,
        description,
        level: 'MEDIUM',
        date_start: new Date(dateStart),
        duration: new Date(0, 0, 0, 1),
        is_active: true,
        instructor_id: body.instructorId,
      },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}

export async function GET(req) {
  const firstDayWeek = req.nextUrl.searchParams.get('firstDayWeek');
  const lastDayWeek = req.nextUrl.searchParams.get('lastDayWeek');
  if (!firstDayWeek || !lastDayWeek) {
    return NextResponse.json('Bad Request', { status: 404 });
  }
  const gt = new Date(firstDayWeek);
  const lte = new Date(lastDayWeek);
  try {
    const res = await prisma.class.findMany({
      where: {
        date_start: { gt, lte },
      },
      select: {
        id: true,
        name: true,
        description: true,
        date_start: true,
        instructor_id: true,
        couchesDisponibility: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
    const classes = {};
    res.forEach((item) => {
      classes[item.date_start.getTime()] = {
        ...item,
        couchesDisponibility: item.couchesDisponibility.map(({ user }) => ({
          ...user,
        })),
      };
    });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}

export async function PUT(req) {
  const body = await req.json();
  try {
    const { classId, instructorId } = body;
    const res = await prisma.class.update({
      where: { id: classId },
      data: { instructor_id: instructorId },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
