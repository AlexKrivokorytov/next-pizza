'use client';

import { cn } from '@/shared/lib/utils';
import { Api } from '@/shared/services/api-client';
import { Product } from '@prisma/client';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useClickAway } from 'react-use';
import { useDebouncedCallback } from 'use-debounce';
import { useTheme } from '@/providers/theme-provider';

interface Props {
  className?: string;
}

/**
 * Search input component for pizzas with debounced API search and result dropdown.
 *
 * @param className - Additional class names for the search input container.
 *
 * @returns An interactive search input with results dropdown and clear button.
 */
export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFirstFocus, setIsFirstFocus] = React.useState(true);
  const ref = React.useRef(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  useClickAway(ref, () => {
    setFocused(false);
  });

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await Api.products.search(query);
      setProducts(response);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, 200);

  // Fetch products when component mounts or when search query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Fetch initial products when input is focused
  const handleFocus = () => {
    setFocused(true);
    if (products.length === 0) {
      debouncedSearch('');
    }
  };

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery('');
    setProducts([]);
  };

  // Reset first focus state when input is blurred
  const handleBlur = () => {
    setIsFirstFocus(false);
  };

  // Clear the search query
  const handleClear = () => {
    setSearchQuery('');
    debouncedSearch('');
    router.push('/');
  };

  return (
    <>
      {focused && (
        <div
          className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out"
          style={{ opacity: focused ? 1 : 0 }}
          onClick={() => setFocused(false)}
        />
      )}

      <div
        ref={ref}
        className={cn(
          'flex rounded-2xl flex-1 justify-between relative h-11 z-30 transition-all duration-300 ease-in-out',
          focused ? 'shadow-lg scale-[1.02]' : '',
          className,
        )}
      >
        <Search
          className={cn(
            'absolute top-1/2 translate-y-[-50%] left-3 h-5 transition-colors duration-300',
            focused ? 'text-primary' : isDarkPurple ? 'text-foreground/60' : 'text-gray-400',
          )}
        />
        <input
          className={cn(
            'rounded-2xl outline-none w-full pl-11 pr-10 transition-all duration-300',
            isDarkPurple
              ? cn(
                  'bg-secondary/80 focus:bg-secondary text-foreground',
                  focused ? 'shadow-inner' : '',
                )
              : cn(
                  'focus:bg-white text-gray-900',
                  focused ? 'bg-white shadow-inner' : 'bg-gray-100',
                ),
          )}
          type="text"
          placeholder="Search for pizza..."
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full',
              isDarkPurple
                ? 'text-foreground/60 hover:text-foreground'
                : 'text-gray-400 hover:text-gray-600',
              'hover:bg-gray-100/10 transition-colors',
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {focused && (
          <div
            className={cn(
              'absolute w-full rounded-xl py-2 top-14 shadow-md z-30',
              isDarkPurple ? 'bg-secondary' : 'bg-white',
              isFirstFocus ? 'animate-popup-in' : 'transition-all duration-300 ease-in-out',
              products.length > 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none',
              isLoading ? 'animate-pulse' : '',
            )}
          >
            {isLoading ? (
              <div
                className={cn('px-3 py-2', isDarkPurple ? 'text-foreground/60' : 'text-gray-500')}
              >
                Loading...
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Link
                  onClick={onClickItem}
                  key={product.id}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 transition-colors duration-200',
                    isDarkPurple
                      ? 'hover:bg-secondary/80 text-foreground'
                      : 'hover:bg-primary/10 text-gray-900',
                  )}
                  href={`/product/${product.id}`}
                >
                  <img
                    className="rounded-sm h-8 w-8 object-cover"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                  <span>{product.name}</span>
                </Link>
              ))
            ) : (
              <div
                className={cn('px-3 py-2', isDarkPurple ? 'text-foreground/60' : 'text-gray-500')}
              >
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
