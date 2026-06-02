import { prisma } from '@/prisma/prisma-client';
import { Ingredient } from '@prisma/client';

export class IngredientsService {
  /**
   * Fetches all available ingredients.
   * 
   * @returns Array of ingredients
   */
  static async getAll(): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({});
  }
}
