import { prisma } from '@/prisma/prisma-client';
import { User, Prisma, PaymentMethod } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { EmailService } from '@/lib/services/EmailService';

export interface RegisterUserDTO {
  email: string;
  password?: string;
  fullName: string;
}

export interface UpdateProfileDTO {
  fullName?: string;
  password?: string;
  phone?: string;
  address?: string;
  defaultPaymentMethod?: PaymentMethod;
}

/**
 * Service class for handling User-related business logic and database access.
 */
export class UserService {
  /**
   * Updates a user's profile and dispatches an email notification.
   * @param userId - The ID of the user to update
   * @param data - The data to update
   * @returns The updated user
   */
  static async updateProfile(userId: number, data: UpdateProfileDTO): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {};

    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.password) updateData.password = hashSync(data.password, 10);
    
    // We allow explicit empty strings to clear the values
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    
    if (data.defaultPaymentMethod !== undefined) {
      updateData.defaultPaymentMethod = data.defaultPaymentMethod;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Fire and forget email notification
    if (user.email) {
      await EmailService.sendProfileUpdateNotification(user.email, user.fullName);
    }

    return user;
  }

  /**
   * Finds a user by their email address.
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email },
    });
  }

  /**
   * Finds a user by their ID.
   */
  static async findById(id: number): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id },
    });
  }

  /**
   * Registers a new user.
   */
  static async registerUser(data: RegisterUserDTO): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        password: data.password ? hashSync(data.password, 10) : '',
        role: 'USER',
        verified: new Date(Date.now()), // For simplicity, automatically verify newly registered users
      },
    });
  }
}
