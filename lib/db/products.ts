import { prisma } from '@/prisma/prisma-client';
import { Product } from '@prisma/client';

export class ProductsService {
  /**
   * Searches for products by name.
   * 
   * @param query Search query string
   * @param limit Maximum number of products to return
   * @returns Array of matching products
   */
  static async search(query: string, limit: number = 5): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
    });
  }
}
