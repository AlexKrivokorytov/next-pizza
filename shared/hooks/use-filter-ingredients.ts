import { Api } from '@/shared/services/api-client';
import { Ingredient } from '@prisma/client';
import React from 'react';
import { useSet } from 'react-use';

interface ReturnProps {
  ingredients: Ingredient[];
  loading: boolean;
  selectedIngredients: Set<string>;
  toggleId: (id: string) => void;
  setSelectedIngredients: (ids: string[]) => void;
}

/**
 * Custom React hook to fetch and manage pizza ingredients with selection state.
 *
 * @param values - Initial selected ingredient IDs.
 *
 * @returns Ingredients, loading state, selected ingredients, and selection handlers.
 */
export const useFilterIngredients = (values: string[] = []): ReturnProps => {
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedIds, { toggle, add }] = useSet(new Set<string>(values));

  React.useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const ingredients = await Api.ingredients.getAll();
        setIngredients(ingredients);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  const setSelectedIngredients = (ids: string[]) => {
    ids.forEach((id) => add(id));
  };

  return {
    ingredients,
    loading,
    selectedIngredients: selectedIds,
    toggleId: toggle,
    setSelectedIngredients,
  };
};
