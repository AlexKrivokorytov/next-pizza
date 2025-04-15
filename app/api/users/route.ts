import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma/prisma-client';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    // Ensure users is always an array
    const usersArray = users || [];
    return NextResponse.json(usersArray);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const user = await prisma.user.create({
      data: data,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
