import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { hashSync } from 'bcrypt';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api-handler';
import { ApiError } from '@/lib/api-handler';

import { rateLimit } from '@/lib/rate-limit';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const isAllowed = await rateLimit(`rate_limit:register:${ip}`, 5, 60 * 60); // 5 requests per hour

  if (!isAllowed) {
    throw new ApiError('Too many registration attempts. Please try again later.', 429);
  }

  const body = await req.json();
  const data = registerSchema.parse(body);

  const existingUser = await prisma.user.findFirst({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError('User already exists', 400);
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      fullName: data.fullName,
      password: hashSync(data.password, 10),
      role: 'USER',
      verified: new Date(Date.now()), // For simplicity, automatically verify newly registered users
    },
  });

  return NextResponse.json({ id: user.id, email: user.email, fullName: user.fullName });
});
