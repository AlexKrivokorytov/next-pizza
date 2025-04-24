'use client';

import React from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useIngredients, useFilters, useQueryFilters } from '../../hooks';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/shared/lib/utils';

interface FiltersProps {
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({ className }) => {
  const { ingredients, loading } = useIngredients();
  const filters = useFilters();
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  // Use the query filters hook to handle URL updates
  useQueryFilters(filters);

  // Map ingredients to the format needed for CheckboxFiltersGroup
  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: item.name,
  }));

  const updatePrices = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0]);
    filters.setPrices('priceTo', prices[1]);
  };

  // Handler for input change with validation
  const handleInputChange = (name: 'priceFrom' | 'priceTo', value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      filters.setPrices(name, numValue);
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl p-5 shadow-sm transition-colors',
        isDarkPurple ? 'bg-secondary/70 shadow-gray-900/10' : 'bg-orange-50 shadow-orange-200/70',
        className,
      )}
    >
      <Title text="Filtering" size="sm" className="mb-5 font-bold" />

      {/* pizza types checkbox */}
      <CheckboxFiltersGroup
        title="Pizza types"
        name="pizzaTypes"
        className="mb-5"
        onClickCheckbox={filters.setPizzaTypes}
        selected={filters.pizzaTypes}
        items={[
          { text: 'Thin', value: '1' },
          { text: 'Traditional', value: '2' },
        ]}
      />

      <CheckboxFiltersGroup
        title="Sizes"
        name="sizes"
        className="mb-5"
        onClickCheckbox={filters.setSizes}
        selected={filters.sizes}
        items={[
          { text: '20 cm', value: '20' },
          { text: '30 cm', value: '30' },
          { text: '40 cm', value: '40' },
        ]}
      />

      {/* price filter */}
      <div
        className={cn(
          'mt-5 border-y py-6 pb-7',
          isDarkPurple ? 'border-y-gray-700' : 'border-y-orange-200',
        )}
      >
        <p className={cn('mb-3 font-bold', isDarkPurple ? 'text-foreground' : 'text-orange-900')}>
          Price range
        </p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50}
            value={filters.prices.priceFrom !== undefined ? String(filters.prices.priceFrom) : ''}
            onChange={(e) => handleInputChange('priceFrom', e.target.value)}
            className={cn(
              isDarkPurple
                ? 'border-gray-700 text-foreground placeholder:text-gray-500 focus-visible:ring-primary/70 bg-secondary/30'
                : 'border-orange-200 text-orange-900 placeholder:text-orange-400 focus-visible:ring-orange-500/70',
            )}
          />
          <Input
            type="number"
            min={0}
            max={50}
            placeholder="50"
            value={filters.prices.priceTo !== undefined ? String(filters.prices.priceTo) : ''}
            onChange={(e) => handleInputChange('priceTo', e.target.value)}
            className={cn(
              isDarkPurple
                ? 'border-gray-700 text-foreground placeholder:text-gray-500 focus-visible:ring-primary/70 bg-secondary/30'
                : 'border-orange-200 text-orange-900 placeholder:text-orange-400 focus-visible:ring-orange-500/70',
            )}
          />
        </div>
        <RangeSlider
          min={0}
          max={50}
          step={0.5}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 50]}
          onValueChange={updatePrices}
        />
      </div>
      <CheckboxFiltersGroup
        title="Ingredients"
        name="ingredients"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={filters.setSelectedIngredients}
        selected={filters.selectedIngredients}
      />
    </div>
  );
};
