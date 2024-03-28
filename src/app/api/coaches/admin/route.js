import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export const fetchCache = 'default-no-store';

export async function GET(req) {
  try {
    let users = await prisma.user.findMany({
      where: {
        isActive: { equals: true },
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        isActive: true,
        coaches: {
          select: {
            specializations: true,
          },
        },
      },
    });
    users = users
      .filter(({ coaches }) => coaches)
      .map(({ coaches, ...user }) => ({
        specializations: coaches.specializations,
        ...user,
      }));
    return NextResponse.json(users, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
