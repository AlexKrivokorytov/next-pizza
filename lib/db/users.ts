import { prisma } from '@/prisma/prisma-client';
import { User, Prisma } from '@prisma/client';

export class UsersService {
  /**
   * Fetches all users.
   * 
   * @returns Array of users
   */
  static async getAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  /**
   * Creates a new user.
   * 
   * @param data User creation data
   * @returns Created user
   */
  static async create(data: Omit<Prisma.UserCreateInput, 'verified'>): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        verified: new Date(),
      },
    });
  }

  /**
   * Finds a user by email.
   * 
   * @param email User email
   * @returns User or null
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email },
    });
  }
}
