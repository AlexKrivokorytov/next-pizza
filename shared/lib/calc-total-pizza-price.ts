import { Ingredient, ProductItem } from '@prisma/client';

/**
 * Calculates the total price of a pizza including selected ingredients.
 *
 * @param selectedPizza - The selected pizza item (base).
 * @param selectedIngredients - Set of selected ingredient IDs.
 * @param ingredients - List of all available ingredients.
 *
 * @returns The total price of the pizza with selected ingredients.
 */
export function calcTotalPizzaPrice(
  selectedPizza: ProductItem | undefined,
  selectedIngredients: Set<number>,
  ingredients: Ingredient[],
): number {
  const basePrice = selectedPizza?.price || 0;
  const ingredientsPrice = Array.from(selectedIngredients).reduce((total, id) => {
    const ingredient = ingredients.find((ing) => ing.id === id);
    return total + (ingredient?.price || 0);
  }, 0);
  return basePrice + ingredientsPrice;
}
