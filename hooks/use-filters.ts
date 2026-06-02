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

/**
 * Custom React hook to manage pizza filter state and sync with URL parameters.
 *
 * @returns Filter state, setters, and handlers for pizza filtering.
 */
export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as URLSearchParams;

  // Initialize selected ingredients from URL parameters
  const [selectedIngredients, setSelectedIngredients] = React.useState<Set<string>>(
    new Set<string>(searchParams.get('ingredients')?.split(',').filter(Boolean) || []),
  );

  // Initialize sizes from URL parameters
  const [sizes, setSizes] = React.useState<Set<string>>(
    new Set<string>(searchParams.get('sizes')?.split(',').filter(Boolean) || []),
  );

  // Initialize pizza types from URL parameters
  const [pizzaTypes, setPizzaTypes] = React.useState<Set<string>>(
    new Set<string>(searchParams.get('pizzaTypes')?.split(',').filter(Boolean) || []),
  );

  // Initialize price range from URL parameters
  const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });

  // Hydrate from localStorage on mount if searchParams is empty
  React.useEffect(() => {
    // If there are searchParams, the user came from a shared link or already has active filters.
    const hasSearchParams = Array.from(searchParams.keys()).length > 0;
    
    if (!hasSearchParams) {
      try {
        const savedFiltersStr = localStorage.getItem('pizza-filters');
        if (savedFiltersStr) {
          const savedFilters = JSON.parse(savedFiltersStr);
          
          if (savedFilters.ingredients) setSelectedIngredients(new Set(savedFilters.ingredients));
          if (savedFilters.sizes) setSizes(new Set(savedFilters.sizes));
          if (savedFilters.pizzaTypes) setPizzaTypes(new Set(savedFilters.pizzaTypes));
          if (savedFilters.prices) setPrice(savedFilters.prices);
        }
      } catch (e) {
        console.error('Failed to parse filters from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage when filters change
  React.useEffect(() => {
    const filtersToSave = {
      ingredients: Array.from(selectedIngredients),
      sizes: Array.from(sizes),
      pizzaTypes: Array.from(pizzaTypes),
      prices
    };
    localStorage.setItem('pizza-filters', JSON.stringify(filtersToSave));
  }, [selectedIngredients, sizes, pizzaTypes, prices]);

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

  // Toggle helpers
  const toggleIngredient = (value: string) => {
    setSelectedIngredients(prev => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const toggleSizes = (value: string) => {
    setSizes(prev => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const togglePizzaTypes = (value: string) => {
    setPizzaTypes(prev => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

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
