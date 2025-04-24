import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import React from 'react';
import qs from 'qs';
import { useRouter } from 'next/navigation';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface QueryFilters extends PriceProps {
  pizzaTypes: string;
  sizes: string;
  ingredients: string;
}

export interface Filters {
  sizes: Set<string>;
  pizzaTypes: Set<string>;
  selectedIngredients: Set<string>;
  prices: PriceProps;
}

export interface ReturnProps extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setPizzaTypes: (value: string) => void;
  setSizes: (value: string) => void;
  setSelectedIngredients: (value: string) => void;
}

// Price constraints
const MIN_PRICE = 0;
const MAX_PRICE = 50;

export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as URLSearchParams;
  const router = useRouter();

  // Initialize selected ingredients from URL parameters
  const [selectedIngredients, { toggle: toggleIngredient }] = useSet(
    new Set<string>(searchParams.get('ingredients')?.split(',').filter(Boolean) || []),
  );

  // Initialize sizes from URL parameters
  const [sizes, { toggle: toggleSizes }] = useSet(
    new Set<string>(searchParams.get('sizes')?.split(',').filter(Boolean) || []),
  );

  // Initialize pizza types from URL parameters
  const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
    new Set<string>(searchParams.get('pizzaTypes')?.split(',').filter(Boolean) || []),
  );

  // Initialize price range from URL parameters
  const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });

  // Handle price updates with validation
  const updatePrice = (name: keyof PriceProps, value: number) => {
    // Enforce min and max constraints
    const constrainedValue = Math.min(Math.max(value, MIN_PRICE), MAX_PRICE);

    // Only update if the value is a valid number
    if (!isNaN(constrainedValue)) {
      setPrice((prev) => ({
        ...prev,
        [name]: constrainedValue,
      }));
    }
  };

  // Update URL when filters change
  React.useEffect(() => {
    const filters = {
      ...(prices.priceFrom !== undefined && { priceFrom: prices.priceFrom }),
      ...(prices.priceTo !== undefined && { priceTo: prices.priceTo }),
      ...(pizzaTypes.size > 0 && { pizzaTypes: Array.from(pizzaTypes) }),
      ...(sizes.size > 0 && { sizes: Array.from(sizes) }),
      ...(selectedIngredients.size > 0 && { ingredients: Array.from(selectedIngredients) }),
    };

    const query = qs.stringify(filters, {
      arrayFormat: 'comma',
      skipNulls: true,
    });

    router.push(`/?${query}`, { scroll: false });
  }, [prices, pizzaTypes, sizes, selectedIngredients, router]);

  return {
    sizes,
    pizzaTypes,
    selectedIngredients,
    prices,
    setPrices: updatePrice,
    setPizzaTypes: togglePizzaTypes,
    setSizes: toggleSizes,
    setSelectedIngredients: toggleIngredient,
  };
};
