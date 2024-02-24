// pages/api/user.js (if using Next.js 13 or newer)
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json("Bad Request", { status: 404 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        lastname: true,
        email: true,
        phone: true,
        biography: true,
      },
    });

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function PUT(req) {
  const body = await req.json();

  try {
    const { email, ...data } = body;
    const res = await prisma.user.update({
      where: { email },
      data,
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
