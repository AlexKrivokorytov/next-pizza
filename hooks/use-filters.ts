import { useFilterIngredients } from './use-filter-ingredients';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import React from 'react';
import qs from 'qs';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface FiltersReturnProps {
  ingredients: {
    text: string;
    value: string;
  }[];
  loading: boolean;
  selectedIngredients: Set<string>;
  toggleId: (id: string) => void;
  sizes: Set<string>;
  toggleSizes: (size: string) => void;
  pizzaTypes: Set<string>;
  togglePizzaTypes: (type: string) => void;
  prices: PriceProps;
  updatePrice: (name: keyof PriceProps, value: number) => void;
  setPrice: React.Dispatch<React.SetStateAction<PriceProps>>;
}

// Price constraints
const MIN_PRICE = 0;
const MAX_PRICE = 50;

export const useFilters = (): FiltersReturnProps => {
  const searchParams = useSearchParams() as unknown as URLSearchParams;
  const router = useRouter();

  const {
    ingredients: rawIngredients,
    loading,
    toggleId,
    selectedIngredients,
    setSelectedIngredients,
  } = useFilterIngredients(searchParams.get('ingredients')?.split(',') || []);

  const [sizes, { toggle: toggleSizes }] = useSet(
    new Set<string>(searchParams.get('sizes')?.split(',') || []),
  );

  const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
    new Set<string>(searchParams.get('pizzaTypes')?.split(',') || []),
  );

  const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });

  // Map ingredients to the format needed for CheckboxFiltersGroup
  const ingredients = rawIngredients.map((item) => ({
    text: item.name,
    value: String(item.id),
  }));

  const updatePrice = (name: keyof PriceProps, value: number) => {
    // Enforce min and max constraints
    const constrainedValue = Math.min(Math.max(value, MIN_PRICE), MAX_PRICE);

    // Only update if the value is a valid number
    if (!isNaN(constrainedValue)) {
      setPrice({
        ...prices,
        [name]: constrainedValue,
      });
    }
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
    ingredients,
    loading,
    selectedIngredients,
    toggleId,
    sizes,
    toggleSizes,
    pizzaTypes,
    togglePizzaTypes,
    prices,
    updatePrice,
    setPrice,
  };
};
