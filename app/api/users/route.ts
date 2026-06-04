import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api-handler';
import { UsersService } from '@/lib/db/users';

const createUserSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ApiError } from '@/lib/api-handler';

/**
 * Handles GET requests to fetch all users.
 */
export const GET = withApiHandler(async () => {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new ApiError('Unauthorized: Admin access required', 403);
  }

  const users = await UsersService.getAll();
  return NextResponse.json(users || []);
});

/**
 * Handles POST requests to create a new user.
 */
export const POST = withApiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validData = createUserSchema.parse(body);
  
  const user = await UsersService.create(validData);
  return NextResponse.json(user, { status: 201 });
});
