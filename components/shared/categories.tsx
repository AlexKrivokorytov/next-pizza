'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useCategoryStore } from '../../store/category';

interface CategoryProps {
  className?: string;
  activeIndex?: number;
}
const categories = [
  { id: 1, name: 'Pizzas' },
  { id: 2, name: 'Breakfast' },
  { id: 3, name: 'Snacks' },
  { id: 4, name: 'Cocktails' },
  { id: 5, name: 'Coffee' },
  { id: 6, name: 'Drinks' },
  { id: 7, name: 'Desserts' },
  { id: 8, name: 'Desserts' }, // Duplicate
];

export const Categories: React.FC<CategoryProps> = ({ className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  return (
    <nav className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {categories.map(({ id, name }, index) => (
        <a
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5 transition-colors',
            categoryActiveId === id
              ? 'bg-white shadow-md shadow-gray-200 text-primary'
              : 'hover:bg-gray-100',
          )}
          href={`/#${name}`}
          key={index}
        >
          <button>{name}</button>
        </a>
      ))}
    </nav>
  );
};
