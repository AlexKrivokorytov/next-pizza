import { Api } from '@/shared/services/api-client';
import { Ingredient } from '@prisma/client';
import React from 'react';

interface IngredientItem {
  id: number;
  name: string;
}

interface UseIngredientsReturn {
  ingredients: IngredientItem[];
  loading: boolean;
}

/**
 * Custom React hook to fetch and provide a list of available ingredients.
 *
 * @returns Ingredients array and loading state.
 */
export const useIngredients = (): UseIngredientsReturn => {
  const [ingredients, setIngredients] = React.useState<IngredientItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const data = await Api.ingredients.getAll();
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  return {
    ingredients,
    loading,
  };
};
