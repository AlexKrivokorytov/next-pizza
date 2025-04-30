'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/shared/store/cart';

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  imageUrl: string;
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
  className,
}) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: Math.random(), // This should be a proper ID in a real implementation
      productItemId: Number(id) || 0,
      name,
      imageUrl,
      price,
      quantity: 1,
    });
  };

  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
          <Image
            className="w-[215px] h-[215px] object-cover"
            src={imageUrl}
            alt={name}
            width={215}
            height={215}
            priority
          />
        </div>
        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
        <p className="text-sm text-gray-400">
          Cream sauce, mozzarella, pepperoni, bacon, ground beef, fried onions, spinach, BBQ sauce.
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[20px]">
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
