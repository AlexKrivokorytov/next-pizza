import { prisma } from '@/prisma/prisma-client';

export interface CategorySearchParams {
  priceFrom?: number;
  priceTo?: number;
  sizesArr?: number[];
  pizzaTypesArr?: number[];
  ingredientsArr?: number[];
  sortBy?: string;
}

export class CategoryService {
  /**
   * Fetches categories with products filtered by search parameters.
   * 
   * @param params Category search filters
   * @returns Array of categories with filtered products
   */
  static async getCategoriesWithProducts(params: CategorySearchParams) {
    const { priceFrom, priceTo, sizesArr, pizzaTypesArr, ingredientsArr, sortBy = 'popular' } = params;

    const priceFilter = {
      ...(priceFrom !== undefined && { gte: priceFrom }),
      ...(priceTo !== undefined && { lte: priceTo }),
    };

    const pizzaSizes = sizesArr?.filter(s => [20, 30, 40].includes(s));
    const snackSizes = sizesArr?.filter(s => [6, 9, 12].includes(s));
    const drinkSizes = sizesArr?.filter(s => [300, 400, 500].includes(s));

    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: {
            ingredients: ingredientsArr
              ? {
                  some: {
                    id: {
                      in: ingredientsArr,
                    },
                  },
                }
              : undefined,
            OR: [
              {
                categoryId: 1, // Pizzas
                items: {
                  some: {
                    ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
                    ...(pizzaSizes && pizzaSizes.length > 0 && { size: { in: pizzaSizes } }),
                    ...(pizzaTypesArr && { pizzaType: { in: pizzaTypesArr } }),
                  },
                },
              },
              {
                categoryId: 3, // Snacks
                items: {
                  some: {
                    ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
                    ...(snackSizes && snackSizes.length > 0 && { size: { in: snackSizes } }),
                  },
                },
              },
              {
                categoryId: { in: [2, 4, 5] }, // Drinks & Cocktails
                items: {
                  some: {
                    ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
                    ...(drinkSizes && drinkSizes.length > 0 && { size: { in: drinkSizes } }),
                  },
                },
              },
              {
                categoryId: { notIn: [1, 2, 3, 4, 5] }, // Fallback
                items: {
                  some: {
                    ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
                  },
                },
              },
            ],
          },
          include: {
            ingredients: true,
            items: {
              orderBy: {
                price: 'asc',
              },
            },
          },
        },
      },
    });

    // Filter out categories with no products and apply sorting
    return categories
      .filter((category) => category.products.length > 0)
      .map((category) => {
        const sortedProducts = [...category.products].sort((a, b) => {
          // Get the lowest price from items for product A
          const priceA = Math.min(...a.items.map((i) => i.price));
          // Get the lowest price from items for product B
          const priceB = Math.min(...b.items.map((i) => i.price));

          switch (sortBy) {
            case 'price_asc':
              return priceA - priceB;
            case 'price_desc':
              return priceB - priceA;
            case 'popular':
            default:
              // For popular, we'll sort by ID descending (newest) as a fallback
              // since there's no rating field
              return b.id - a.id;
          }
        });

        return {
          ...category,
          products: sortedProducts,
        };
      });
  }
}
