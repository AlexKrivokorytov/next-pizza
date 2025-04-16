'use client';

import { cn } from '@/lib/utils';
import { Api } from '@/services/api-client';
import { Product } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useClickAway } from 'react-use';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFirstFocus, setIsFirstFocus] = React.useState(true);
  const ref = React.useRef(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  const debouncedSearch = useDebouncedCallback(
    async (query: string) => {
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
    },
    200,
  );

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

  return (
    <>
      {focused && (
        <div
          className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out"
          style={{ opacity: focused ? 1 : 0 }}
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
            focused ? 'text-primary' : 'text-gray-400',
          )}
        />
        <input
          className={cn(
            'rounded-2xl outline-none w-full pl-11 transition-all duration-300',
            focused ? 'bg-white shadow-inner' : 'bg-gray-100',
          )}
          type="text"
          placeholder="Search for pizza..."
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {focused && (
          <div
            className={cn(
              'absolute w-full bg-white rounded-xl py-2 top-14 shadow-md z-30',
              isFirstFocus
                ? 'animate-popup-in'
                : 'transition-all duration-300 ease-in-out',
              products.length > 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none',
              isLoading ? 'animate-pulse' : '',
            )}
          >
            {isLoading ? (
              <div className="px-3 py-2 text-gray-500">
                Loading...
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Link
                  onClick={onClickItem}
                  key={product.id}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10 transition-colors duration-200"
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
              <div className="px-3 py-2 text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
