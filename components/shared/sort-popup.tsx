'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '@/providers/theme-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';

export type SortType = 'popular' | 'price_asc' | 'price_desc';

const sortLabels: Record<SortType, string> = {
  popular: 'Popular',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
};

/**
 * Sort popup component for selecting pizza sorting order (e.g., popular, price).
 * Synced with URL search params.
 *
 * @returns A dropdown UI for selecting sort type.
 */
export const SortPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedSortType = (searchParams.get('sortBy') as SortType) || 'popular';
  
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSortTypeSelect = (sortType: SortType) => {
    setIsOpen(false);
    
    // Parse current params
    const currentParams = qs.parse(searchParams.toString());
    
    // Update sort param
    const newParams = {
      ...currentParams,
      sortBy: sortType,
    };
    
    // Remove if default
    if (sortType === 'popular') {
      delete (newParams as any).sortBy;
    }
    
    const query = qs.stringify(newParams, { skipNulls: true, arrayFormat: 'comma' });
    router.push(`?${query}`, { scroll: false });
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'flex cursor-pointer items-center rounded-lg p-1 px-3 text-sm transition-colors',
          isDarkPurple ? 'bg-secondary hover:bg-secondary/80' : 'bg-gray-100 hover:bg-gray-200',
        )}
        onClick={togglePopup}
      >
        <span className={cn('mr-1', isDarkPurple ? 'text-foreground' : 'text-gray-900')}>
          Sort by:
        </span>
        <b className={cn('mr-1', isDarkPurple ? 'text-foreground' : 'text-gray-900')}>
          {sortLabels[selectedSortType]}
        </b>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen ? 'rotate-180' : '',
            isDarkPurple ? 'text-foreground' : 'text-gray-500',
          )}
        />
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-10 min-w-45 rounded-lg p-2 shadow-xl',
            isDarkPurple ? 'bg-secondary' : 'bg-white',
          )}
        >
          {(Object.entries(sortLabels) as [SortType, string][]).map(([sortType, label]) => (
            <div
              key={sortType}
              className={cn(
                'cursor-pointer rounded px-3 py-2 text-sm transition-colors',
                sortType === selectedSortType
                  ? cn(isDarkPurple ? 'bg-secondary/80 text-primary' : 'bg-gray-100 text-gray-900')
                  : cn(
                      'hover:bg-opacity-60',
                      isDarkPurple
                        ? 'text-foreground hover:bg-secondary/80'
                        : 'text-gray-500 hover:bg-gray-100',
                    ),
              )}
              onClick={() => handleSortTypeSelect(sortType)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
