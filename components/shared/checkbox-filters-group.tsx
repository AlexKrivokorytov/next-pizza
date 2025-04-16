'use client';

import React from 'react';
import {
  FilterCheckboxProps,
  FilterCheckbox,
} from './filter-checkbox';
import { Input } from '../ui/input';
import { Skeleton } from '../ui';

type Item = FilterCheckboxProps;

interface CheckboxFiltersGroupProps {
  title: string;
  items: Item[];
  defaultItems: Item[];
  limit?: number;
  loading?: boolean;
  searchInputPlaceHolder?: string;
  className?: string;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
}

export const CheckboxFiltersGroup: React.FC<
  CheckboxFiltersGroupProps
> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  loading = false,
  searchInputPlaceholder = 'Search...',
  className,
  onChange,
  defaultValue,
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState('');
  const onChangeSearchInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValue(e.target.value);
  };

  if (loading) {
    return (
      <div className={className}>
        <p className="font-bold mb-3">{title}</p>
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-6 mb-4 rounded-[8px] bg-gray-300"
            />
          ))}
        </div>
      </div>
    );
  }

  const list = showAll
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : defaultItems.slice(0, limit);

  return (
    <div className={className}>
      <p className="font-bold mb-3">{title}</p>
      {showAll && (
        <div className="mb-5">
          <Input
            onChange={onChangeSearchInput}
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
        {list.map((item, index) => (
          <FilterCheckbox
            key={index}
            text={item.text}
            value={item.value}
            endAdornment={item.endAdornment}
            checked={false}
            onCheckedChange={(ids) => console.log(ids)}
          />
        ))}
      </div>

      {items.length > limit && (
        <div
          className={
            showAll ? 'border-t border-t-neutral-100 mt-4' : ''
          }
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary mt-3"
          >
            {showAll ? 'Скрыть' : '+ Показать все'}
          </button>
        </div>
      )}
    </div>
  );
};
