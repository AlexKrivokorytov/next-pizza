'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useCategoryStore } from '../../store/category';
import { useTheme } from '../../providers/theme-provider';

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
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <nav
      className={cn(
        'inline-flex gap-1 p-1 rounded-2xl',
        isDarkPurple ? 'bg-secondary' : 'bg-gray-50',
        className,
      )}
    >
      {categories.map(({ id, name }, index) => (
        <a
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5 transition-colors',
            categoryActiveId === id
              ? cn(
                  'shadow-md text-primary',
                  isDarkPurple
                    ? 'bg-secondary/80 shadow-purple-900/30'
                    : 'bg-white shadow-gray-200',
                )
              : cn(
                  'hover:bg-opacity-60',
                  isDarkPurple ? 'hover:bg-secondary/80' : 'hover:bg-gray-100',
                ),
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
