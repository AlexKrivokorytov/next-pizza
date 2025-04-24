import React from 'react';
import { Filters } from './use-filters';
import qs from 'qs';
import { useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import isEqual from 'lodash/isEqual';

// Interface to represent filter values in a format that can be compared with isEqual
interface SerializableFilters {
  prices: {
    priceFrom?: number;
    priceTo?: number;
  };
  pizzaTypes: string[];
  sizes: string[];
  selectedIngredients: string[];
}

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = React.useRef(false);
  const prevFiltersRef = React.useRef<SerializableFilters | null>(null);

  // Create a debounced version of the URL update function
  const debouncedUpdateUrl = useDebouncedCallback((query: string) => {
    if (query) {
      router.push(`?${query}`, {
        scroll: false,
      });
    } else {
      router.push(`${pathname}`, {
        scroll: false,
      });
    }
  }, 500); // 500ms debounce

  React.useEffect(() => {
    if (isMounted.current) {
      // Format filter data for URL in a way that can be compared with isEqual
      const currentFilters: SerializableFilters = {
        prices: filters.prices,
        pizzaTypes: Array.from(filters.pizzaTypes),
        sizes: Array.from(filters.sizes),
        selectedIngredients: Array.from(filters.selectedIngredients),
      };

      // Only update if filters have changed
      if (!prevFiltersRef.current || !isEqual(currentFilters, prevFiltersRef.current)) {
        prevFiltersRef.current = currentFilters;

        const params = {
          ...(filters.prices.priceFrom !== undefined && { priceFrom: filters.prices.priceFrom }),
          ...(filters.prices.priceTo !== undefined && { priceTo: filters.prices.priceTo }),
          ...(filters.pizzaTypes.size > 0 && { pizzaTypes: Array.from(filters.pizzaTypes) }),
          ...(filters.sizes.size > 0 && { sizes: Array.from(filters.sizes) }),
          ...(filters.selectedIngredients.size > 0 && {
            ingredients: Array.from(filters.selectedIngredients),
          }),
        };

        const query = qs.stringify(params, {
          arrayFormat: 'comma',
          skipNulls: true,
        });

        // Debounce the URL update
        debouncedUpdateUrl(query);
      }
    }

    isMounted.current = true;

    // Clean up the debounce on unmount
    return () => {
      debouncedUpdateUrl.cancel();
    };
  }, [
    filters.prices,
    filters.pizzaTypes,
    filters.sizes,
    filters.selectedIngredients,
    router,
    pathname,
    debouncedUpdateUrl,
  ]);
};
