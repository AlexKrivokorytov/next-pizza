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

interface PriceProps {
  priceFrom: number;
  priceTo: number;
}

export const Filters: React.FC<FiltersProps> = ({ className }) => {
  const { ingredients, loading, toggleId, selectedIds } =
    useFilterIngredients();
  const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: 0,
    priceTo: 50,
  });

  const items = ingredients.map((item) => ({
    text: item.name,
    value: String(item.id),
  }));

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({
      ...prices,
      [name]: value,
    });
  };

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* upper checkbox */}
      <div className="flex flex-col gap-4">
        <FilterCheckbox
          name="customizable"
          text="Customizable"
          value="1"
        />
        <FilterCheckbox
          name="newArrivals"
          text="New Arrivals"
          value="2"
        />
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
            value={String(prices.priceFrom)}
            onChange={(e) =>
              updatePrice('priceFrom', Number(e.target.value))
            }
          />
          <Input
            type="number"
            min={5}
            max={50}
            placeholder="50"
            value={String(prices.priceTo)}
            onChange={(e) =>
              updatePrice('priceTo', Number(e.target.value))
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={50}
          step={0.1}
          value={[prices.priceFrom, prices.priceTo]}
          // onValueChange={(value) => {
          //   setPrice({
          //     priceFrom: value[0],
          //     priceTo: value[1],
          //   });
          // }}
          onValueChange={([from, to]) =>
            setPrice({ priceFrom: from, priceTo: to })
          }
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
        onClickCheckbox={toggleId}
        selectedIds={selectedIds}
      />
    </div>
  );
};
