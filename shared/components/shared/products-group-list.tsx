'use client';

import React from 'react';
import { useIntersection } from 'react-use';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag } from 'lucide-react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className={cn('scroll-mt-20', className)} id={title} ref={intersectionRef}>
      <div className="flex items-center justify-between mb-6">
        <Title text={title} size="lg" className="font-extrabold" />
        <button
          className={cn(
            'flex items-center gap-1 text-sm font-medium transition-colors',
            isDarkPurple
              ? 'text-primary/80 hover:text-primary'
              : 'text-orange-500 hover:text-orange-600',
          )}
        >
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

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
        <motion.div
          className={cn('grid gap-6', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', listClassName)}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {items.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                name={product.name}
                imageUrl={product.imageUrl}
                price={product.items[0].price}
                id={product.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
