'use client';

import React from 'react';
import { useIntersection } from '@/hooks/use-intersection';
import { ShoppingBag } from 'lucide-react';
import { Title } from './title';
import { cn } from '../../lib/utils';
import { ProductCard } from './product-card';
import { useCategoryStore } from '../../store/category';
import { useTheme } from '@/providers/theme-provider';

interface ProductsGroupListProps {
  title: string;
  items: any[];
  categoryId: number;
  className?: string;
  listClassName?: string;
}

/**
 * Displays a group of products for a category with animation and intersection tracking.
 *
 * @param title - The group title.
 * @param items - Array of product items to display.
 * @param categoryId - Category ID for intersection tracking.
 * @param className - Additional class names for the group container.
 * @param listClassName - Additional class names for the product list grid.
 *
 * @returns A section with a title and a grid of product cards.
 */
export const ProductsGroupList: React.FC<ProductsGroupListProps> = ({
  className,
  title,
  items,
  listClassName,
  categoryId,
}) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
    threshold: 0.4,
  });

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [intersection?.isIntersecting, setActiveCategoryId, categoryId]);



  return (
    <div className={cn('scroll-mt-20', className)} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-6" />

      {items.length === 0 ? (
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-lg',
            isDarkPurple ? 'bg-secondary/50' : 'bg-orange-50',
          )}
        >
          <ShoppingBag
            className={cn('w-12 h-12 mb-4', isDarkPurple ? 'text-gray-600' : 'text-orange-300')}
          />
          <p
            className={cn('text-lg font-medium', isDarkPurple ? 'text-gray-400' : 'text-gray-500')}
          >
            No products in this category yet
          </p>
        </div>
      ) : (
        <div className={cn('grid gap-6', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', listClassName)}>
          {items.map((product) => (
            <div key={product.id} className="transition-opacity duration-300">
              <ProductCard
                name={product.name}
                imageUrl={product.imageUrl}
                price={product.items[0].price}
                id={product.id}
                productItemId={product.items[0].id}
                ingredients={product.ingredients}
                description={product.description}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
