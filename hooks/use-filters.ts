import { useRouter, useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import qs from 'qs';
import React from 'react';
import { useFilterIngredients } from './use-filter-ingredients';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface QueryFilters extends PriceProps {
  pizzaTypes: string[];
  sizes: string[];
  ingredients: string[];
}

interface UseFiltersReturn {
  // Ingredients
  ingredients: Array<{ text: string; value: string }>;
  loading: boolean;
  selectedIngredients: Set<string>;
  toggleIngredient: (id: string) => void;
  setSelectedIngredients: (ids: string[]) => void;

  // Sizes
  sizes: Set<string>;
  toggleSize: (size: string) => void;

  // Pizza Types
  pizzaTypes: Set<string>;
  togglePizzaType: (type: string) => void;

  // Prices
  prices: PriceProps;
  updatePrice: (name: keyof PriceProps, value: number) => void;
}

export const useFilters = (): UseFiltersReturn => {
  const searchParams = useSearchParams() as unknown as URLSearchParams;
  const router = useRouter();

  // Ingredients
  const { ingredients, loading, toggleId, selectedIngredients, setSelectedIngredients } =
    useFilterIngredients(searchParams.get('ingredients')?.split(',') || []);

  const items = ingredients.map((item) => ({
    text: item.name,
    value: String(item.id),
  }));

  // Sizes
  const [sizes, { toggle: toggleSizes }] = useSet(
    new Set<string>(searchParams.get('sizes')?.split(',') || []),
  );

  // Pizza Types
  const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
    new Set<string>(searchParams.get('pizzaTypes')?.split(',') || []),
  );

  // Prices
  const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({
      ...prices,
      [name]: value,
    });
  };

  // Update URL when filters change
  React.useEffect(() => {
    const filters = {
      ...prices,
      pizzaTypes: Array.from(pizzaTypes),
      sizes: Array.from(sizes),
      ingredients: Array.from(selectedIngredients),
    };

    const query = qs.stringify(filters, {
      arrayFormat: 'comma',
    });

    router.push(`/?${query}`, { scroll: false });
  }, [prices, pizzaTypes, sizes, selectedIngredients, router]);

  return {
    // Ingredients
    ingredients: items,
    loading,
    selectedIngredients,
    toggleIngredient: toggleId,
    setSelectedIngredients,

    // Sizes
    sizes,
    toggleSize: toggleSizes,

    // Pizza Types
    pizzaTypes,
    togglePizzaType: togglePizzaTypes,

    // Prices
    prices,
    updatePrice,
  };
};
