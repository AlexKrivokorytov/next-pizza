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
    // Ingredients
    ingredients,
    loading,
    selectedIngredients,
    toggleIngredient,
    setSelectedIngredients,

    // Sizes
    sizes,
    toggleSize,

    // Pizza Types
    pizzaTypes,
    togglePizzaType,

    // Prices
    prices,
    updatePrice,
  } = useFilters();

  return (
    <div className={className}>
      <Title text="Filtering" size="sm" className="mb-5 font-bold" />

      {/* pizza types checkbox */}
      <CheckboxFiltersGroup
        title="Pizza types"
        name="pizzaTypes"
        className="mb-5"
        onClickCheckbox={togglePizzaType}
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
        onClickCheckbox={toggleSize}
        selected={sizes}
        items={[
          { text: '20 cm', value: '20' },
          { text: '30 cm', value: '30' },
          { text: '40 cm', value: '40' },
        ]}
      />

      <CheckboxFiltersGroup
        title="Ingredients"
        name="ingredients"
        className="mb-5"
        onClickCheckbox={toggleIngredient}
        selected={selectedIngredients}
        items={ingredients}
        loading={loading}
      />

      <Title text="Price" size="sm" className="mb-5 font-bold" />

      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="From"
          value={prices.priceFrom || ''}
          onChange={(e) => updatePrice('priceFrom', Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="To"
          value={prices.priceTo || ''}
          onChange={(e) => updatePrice('priceTo', Number(e.target.value))}
        />
      </div>
    </div>
  );
};
