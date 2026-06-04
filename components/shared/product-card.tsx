'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { Ingredient } from '@prisma/client';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id?: string;
  productItemId?: number;
  name: string;
  price: number;
  imageUrl: string;
  ingredients?: Ingredient[];
  description?: string;
  className?: string;
}

/**
 * Displays a pizza product card with image, name, price, and add-to-cart button.
 *
 * @param id - Product item ID.
 * @param name - Product name.
 * @param price - Product price.
 * @param imageUrl - Product image URL.
 * @param className - Additional class names for the card.
 *
 * @returns A card element with product details and add-to-cart functionality.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  ingredients,
  description,
  className,
  productItemId,
}) => {
  const { addItem } = useCartStore();
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: crypto.randomUUID(), 
      productItemId: productItemId || Number(id) || 0,
      name,
      imageUrl,
      price,
      quantity: 1,
    });
  };



  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-65">
          <Image
            className="w-53.75 h-53.75 object-cover"
            src={imageUrl}
            alt={name}
            width={215}
            height={215}
            priority
          />
        </div>
        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
        
        {/* Base Ingredients Description */}
        {description && (
          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Ingredient Object Pills with Mini Images (Add-ons) */}
        {ingredients && ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 max-h-18 overflow-hidden">
            {ingredients.slice(0, 3).map((ingredient) => (
              <div
                key={ingredient.id}
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full border text-2.75 font-medium',
                  isDarkPurple
                    ? 'bg-secondary/40 border-gray-700 text-gray-300'
                    : 'bg-gray-100 border-gray-200 text-gray-600',
                )}
              >
                <img
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  className="w-3.5 h-3.5 object-contain"
                />
                <span>{ingredient.name}</span>
              </div>
            ))}
            
            {ingredients.length > 3 && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full border text-2.75 font-medium',
                  isDarkPurple
                    ? 'bg-secondary/40 border-gray-700 text-gray-300'
                    : 'bg-gray-100 border-gray-200 text-gray-600',
                )}
              >
                <span>+{ingredients.length - 3} more</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-5">
            from <b>{price} $</b>
          </span>
          <Button variant="secondary" onClick={handleAddToCart}>
            <Plus size={20} className="mr-1" />
            Add
          </Button>
        </div>
      </Link>
    </div>
  );
};
