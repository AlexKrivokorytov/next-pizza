import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { Ingredient } from '@prisma/client';

/**
 * Fetches all available ingredients from the API.
 *
 * @returns Promise resolving to an array of ingredients.
 */
export const getAll = async (): Promise<Ingredient[]> => {
  return (await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS)).data;
};
