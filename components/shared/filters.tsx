'use client';

import React from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilters } from '../../hooks/use-filters';

interface FiltersProps {
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({ className }) => {
  const {
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
  } = useFilters();

  // Handler for input change with validation
  const handleInputChange = (name: 'priceFrom' | 'priceTo', value: string) => {
    const numValue = Number(value);
    updatePrice(name, numValue);
  };

  return (
    <div className={className}>
      <Title text="Filtering" size="sm" className="mb-5 font-bold" />

      {/* pizza types checkbox */}
      <CheckboxFiltersGroup
        title="Pizza types"
        name="pizzaTypes"
        className="mb-5"
        onClickCheckbox={togglePizzaTypes}
        selected={pizzaTypes}
        items={[
          { text: 'Thin', value: '1' },
          { text: 'Traditional', value: '2' },
        ]}
      />

      <CheckboxFiltersGroup
        title="Sizes"
        name="sizes"
        className="mb-5"
        onClickCheckbox={toggleSizes}
        selected={sizes}
        items={[
          { text: '20 cm', value: '20' },
          { text: '30 cm', value: '30' },
          { text: '40 cm', value: '40' },
        ]}
      />

      {/* price filter */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="mb-3 font-bold">Price range</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50}
            value={prices.priceFrom !== undefined ? String(prices.priceFrom) : ''}
            onChange={(e) => handleInputChange('priceFrom', e.target.value)}
          />
          <Input
            type="number"
            min={0}
            max={50}
            placeholder="50"
            value={prices.priceTo !== undefined ? String(prices.priceTo) : ''}
            onChange={(e) => handleInputChange('priceTo', e.target.value)}
          />
        </div>
        <RangeSlider
          min={0}
          max={50}
          step={0.5}
          value={[prices.priceFrom || 0, prices.priceTo || 50]}
          onValueChange={([priceFrom, priceTo]) => setPrice({ priceFrom, priceTo })}
        />
      </div>
      <CheckboxFiltersGroup
        title="Ingredients"
        name="ingredients"
        className="mt-5"
        limit={6}
        defaultItems={ingredients.slice(0, 6)}
        items={ingredients}
        loading={loading}
        onClickCheckbox={toggleId}
        selected={selectedIngredients}
      />
    </div>
  );
};
