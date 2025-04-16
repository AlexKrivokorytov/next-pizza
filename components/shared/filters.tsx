'use client';

import React from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '../../hooks/useFilterIngredients';

interface FiltersProps {
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({ className }) => {
  const { ingredients } = useFilterIngredients();

  const items = ingredients.map((item) => ({
    text: item.name,
    value: String(item.id),
  }));

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* upper checkbox */}
      <div className="flex flex-col gap-4">
        <FilterCheckbox text="Customizable" value="1" />
        <FilterCheckbox text="New Arrivals" value="2" />
      </div>

      {/* price filter */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="mb-3 font-bold">Price range</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50}
            defaultValue={0}
          />
          <Input type="number" min={5} max={50} placeholder="50" />
        </div>
        <RangeSlider min={0} max={50} step={1} value={[0, 50]} />
      </div>
      <CheckboxFiltersGroup
        title="Ingredients"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={true}
      />
    </div>
  );
};
