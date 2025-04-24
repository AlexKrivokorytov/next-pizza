'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useCartStore } from '@/shared/store/cart';
import Image from 'next/image';
import { Button } from '@/shared/components/ui';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/providers/theme-provider';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { items, totalAmount, removeItem, updateQuantity } = useCartStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full right-0 mt-2 w-[400px] z-50 rounded-lg shadow-lg overflow-hidden"
      ref={dropdownRef}
    >
      <div
        className={cn(
          'p-4 max-h-[500px] overflow-y-auto',
          theme === 'dark-purple'
            ? 'bg-[#1f1934] border border-purple-800'
            : 'bg-white border border-gray-200',
        )}
      >
        <h3 className="text-lg font-bold mb-4">Your Cart</h3>

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productItemId} className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.productItemId, Math.max(1, item.quantity - 1))
                      }
                    >
                      <Minus size={16} />
                    </Button>

                    <span className="w-5 text-center">{item.quantity}</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.productItemId, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => removeItem(item.productItemId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>

              <Button className="w-full">Checkout</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
