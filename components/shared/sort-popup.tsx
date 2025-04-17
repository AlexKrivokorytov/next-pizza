'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../providers/theme-provider';

export const SortPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSortType, setSelectedSortType] = useState('Popular');
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSortTypeSelect = (sortType: string) => {
    setSelectedSortType(sortType);
    setIsOpen(false);
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
          {selectedSortType}
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
            'absolute right-0 top-10 min-w-[180px] rounded-lg p-2 shadow-xl',
            isDarkPurple ? 'bg-secondary' : 'bg-white',
          )}
        >
          {['Popular', 'Price: Low to High', 'Price: High to Low'].map((sortType) => (
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
              {sortType}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
