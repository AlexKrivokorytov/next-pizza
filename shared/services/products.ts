import { Product } from '@prisma/client';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';

/**
 * Searches for products by query string using the API.
 *
 * @param query - The search query string.
 * @returns Promise resolving to an array of products.
 */
export const search = async (query: string): Promise<Product[]> => {
  const response = await axiosInstance.get<{ products: Product[] }>(ApiRoutes.SEARCH_PRODUCTS, {
    params: { query },
  });
  return response.data.products;
};
