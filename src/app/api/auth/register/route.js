import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/libs/prisma';
import { genericFetch } from '@/libs/externalAPIs';

export async function POST(request) {
  try {
    const data = await request.json();
    const emailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (emailFound) throw new Error('Email already exists');
    let hashedPassword;
    const isUser = data.rol === 'USER';
    if (!isUser) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }
    const {
      confirmPassword,
      specializations,
      membershipTypeId,
      paymentMethod,
      createdBy,
      ...userData
    } = data;
    const newData = { ...userData };
    if (hashedPassword) {
      newData.password = hashedPassword;
    }
    const newUser = await prisma.user.create({ data: newData });
    if (isUser && membershipTypeId) {
      const params = {
        url: '/membership',
        method: 'POST',
        body: { userId: newUser.id, membershipTypeId },
      };
      await genericFetch(params);
    }
    if (paymentMethod) {
      const body = {
        userId: newUser.id,
        membershipTypeId,
        receptionstId: createdBy,
        method: paymentMethod,
      };
      const params = { url: '/membership', method: 'POST', body };
      genericFetch(params);
    }
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

export async function PUT(request) {
  try {
    const data = await request.json();
    const emailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!emailFound) throw new Error('The email does not exist');
    const { specializations, membershipTypeId, ...userData } = data;
    const newData = { ...userData };
    delete newData.password;
    delete newData.confirmPassword;
    const newUser = await prisma.user.update({
      where: { email: data.email },
      data: newData,
    });
    if (specializations) {
      const specializationsParsed = specializations
        .split(',')
        .map((e) => e.trim());
      await prisma.coach.update({
        where: { user_id: newUser.id },
        data: {
          specializations: JSON.stringify(specializationsParsed),
        },
      });
    }
    const { password, ...user } = newUser;
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json('Something went wrong', { status: 400 });
  }
}
