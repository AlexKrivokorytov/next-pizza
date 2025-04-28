'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { useTheme } from '@/providers/theme-provider';

export type Variant = {
  name: string;
  value: string;
  disabled?: boolean;
};

interface Props {
  items: readonly Variant[];
  onClick?: (value: Variant['value']) => void;
  selectedValue?: Variant['value'];
  className?: string;
}

export const GroupVariants: React.FC<Props> = ({ items, onClick, className, selectedValue }) => {
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <div
      className={cn(
        className,
        'flex justify-between rounded-2xl p-1 select-none',
        isDarkPurple ? 'bg-secondary' : 'bg-gray-50',
      )}
    >
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onClick?.(item.value)}
          className={cn(
            'flex items-center justify-center cursor-pointer h-11 px-5 flex-1 rounded-2xl',
            'transition-all duration-300 ease-in-out',
            item.value === selectedValue
              ? cn(
                  'shadow-md',
                  isDarkPurple
                    ? 'bg-secondary/80 text-white shadow-purple-900/30'
                    : 'bg-white text-foreground shadow-gray-200',
                )
              : cn(
                  'hover:bg-opacity-60',
                  isDarkPurple
                    ? 'text-white/70 hover:bg-secondary/80 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                ),
            item.disabled && 'opacity-50 pointer-events-none',
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
