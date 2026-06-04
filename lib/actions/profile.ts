'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';
import { UserService } from '../services/UserService';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  defaultPaymentMethod: z.nativeEnum(PaymentMethod).optional(),
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const userId = Number(session.user.id);
    const parsedData = profileSchema.parse(data);

    // Delegate the actual DB update and side-effects to the UserService
    await UserService.updateProfile(userId, {
      fullName: parsedData.fullName,
      password: parsedData.password ? parsedData.password : undefined,
      phone: parsedData.phone !== undefined ? parsedData.phone : undefined,
      address: parsedData.address !== undefined ? parsedData.address : undefined,
      defaultPaymentMethod: parsedData.defaultPaymentMethod,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    if (error instanceof z.ZodError) {
      throw new Error('Validation failed');
    }
    throw new Error('Failed to update profile');
  }
}
