import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  try {
    const { classId, userId } = body;
    const res = await prisma.classCoachDisponibility.create({
      data: { class_id: classId, user_id: userId },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
