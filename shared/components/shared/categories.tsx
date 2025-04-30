'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useCategoryStore } from '../../store/category';
import { useTheme } from '../../../providers/theme-provider';
import { Category } from '@prisma/client';

interface CategoryProps {
  className?: string;
  activeIndex?: number;
  items: Category[];
}

/**
 * Navigation bar for pizza categories with active state highlighting.
 *
 * @param items - Array of category objects to display.
 * @param className - Additional class names for the navigation bar.
 *
 * @returns A navigation bar with category buttons.
 */
export const Categories: React.FC<CategoryProps> = ({ items, className }) => {
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
      {items.map(({ id, name }, index) => (
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
