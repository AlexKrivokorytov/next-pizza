import { prisma } from '@/prisma/prisma-client';
import { Prisma } from '@prisma/client';

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

    const itemsFilter: Prisma.ProductItemWhereInput = {
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
    };

    if (sizesArr && sizesArr.length > 0) {
      itemsFilter.size = { in: sizesArr };
    }

    if (pizzaTypesArr && pizzaTypesArr.length > 0) {
      itemsFilter.pizzaType = { in: pizzaTypesArr };
    }

    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: {
            AND: [
              ...(ingredientsArr && ingredientsArr.length > 0
                ? [
                    {
                      baseIngredients: {
                        some: {
                          id: { in: ingredientsArr },
                        },
                      },
                    },
                  ]
                : []),
              {
                items: {
                  some: itemsFilter,
                },
              },
            ],
          },
          include: {
            ingredients: true,
            baseIngredients: true,
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
