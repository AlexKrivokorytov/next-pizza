import React from 'react';
import { cn } from '../../lib/utils';

interface CategoryProps {
  className?: string;
  activeIndex?: number;
}

export const Categories: React.FC<CategoryProps> = ({
  className,
  activeIndex = 0,
}) => {
  const categories = [
    'Пиццы',
    'Комбо',
    'Закуски',
    'Коктейли',
    'Кофе',
    'Напитки',
    'Десерты',
		'Десерты',
  ];

  return (
    <nav
      className={cn(
        'inline-flex gap-1 bg-gray-50 p-1 rounded-2xl',
        className,
      )}
    >
      {categories.map((category, index) => (
        <a
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5 transition-colors',
            activeIndex === index
              ? 'bg-white shadow-md shadow-gray-200 text-primary'
              : 'hover:bg-gray-100',
          )}
          key={index}
        >
          {category}
        </a>
      ))}
    </nav>
  );
};

