'use client';

import React from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '../../lib/utils';
import { useCartStore } from '@/shared/store/cart';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    description?: string;
    items: Array<{
      id: number;
      price: number;
      size?: number;
      type?: string;
    }>;
    ingredients?: Array<{
      id: number;
      name: string;
    }>;
  } | null;
}

/**
 * Modal dialog for displaying product details, options, and add-to-cart functionality.
 *
 * @param isOpen - Whether the modal is visible.
 * @param onClose - Handler to close the modal.
 * @param product - Product object with details, items, and ingredients.
 *
 * @returns A modal dialog with product information and cart actions.
 */
export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const { theme } = useTheme();
  const { addItem } = useCartStore();
  const isDarkPurple = theme === 'dark-purple';
  const [selectedItem, setSelectedItem] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  // Reset state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedItem(0);
      setQuantity(1);
    }
  }, [product]);

  // Close modal on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const currentItem = product.items[selectedItem];
  const totalPrice = currentItem.price * quantity;

  const handleAddToCart = () => {
    if (!product || !currentItem) return;

    addItem({
      id: Math.random(), // This would normally come from the server
      productItemId: currentItem.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: currentItem.price,
      quantity: quantity,
      ingredients: product.ingredients?.map((ing) => ({
        id: ing.id,
        name: ing.name,
        price: 0, // We don't have ingredient prices in this example
      })),
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50',
              'w-full max-w-3xl h-auto max-h-[90vh] overflow-auto rounded-xl p-6',
              isDarkPurple ? 'bg-gray-900' : 'bg-white',
              'flex flex-col md:flex-row gap-8',
            )}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-4 right-4 p-2 rounded-full',
                isDarkPurple
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              )}
            >
              <X size={20} />
            </button>

            {/* Product image */}
            <div className="w-full md:w-1/2 relative h-[280px] md:h-[350px] rounded-xl overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                quality={95}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Product details */}
            <div className="w-full md:w-1/2 flex flex-col">
              <h2
                className={cn(
                  'text-2xl font-bold mb-2',
                  isDarkPurple ? 'text-white' : 'text-gray-800',
                )}
              >
                {product.name}
              </h2>

              {/* Description if available */}
              {product.description && (
                <p className={cn('mb-4 text-sm', isDarkPurple ? 'text-gray-400' : 'text-gray-600')}>
                  {product.description}
                </p>
              )}

              {/* Ingredients if available */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-4">
                  <p
                    className={cn(
                      'text-sm font-medium mb-1',
                      isDarkPurple ? 'text-gray-300' : 'text-gray-700',
                    )}
                  >
                    Ingredients:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.map((ingredient) => (
                      <span
                        key={ingredient.id}
                        className={cn(
                          'inline-block text-xs py-1 px-2 rounded-full',
                          isDarkPurple ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600',
                        )}
                      >
                        {ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size/Type options if more than one */}
              {product.items.length > 1 && (
                <div className="mb-4">
                  <p
                    className={cn(
                      'text-sm font-medium mb-2',
                      isDarkPurple ? 'text-gray-300' : 'text-gray-700',
                    )}
                  >
                    {product.items[0].size ? 'Size:' : 'Type:'}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.items.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(index)}
                        className={cn(
                          'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                          selectedItem === index
                            ? isDarkPurple
                              ? 'bg-primary text-white'
                              : 'bg-orange-500 text-white'
                            : isDarkPurple
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                        )}
                      >
                        {item.size ? `${item.size}"` : item.type}{' '}
                        {item.price !== product.items[0].price && `(${formatPrice(item.price)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mb-4">
                <p
                  className={cn(
                    'text-sm font-medium mb-2',
                    isDarkPurple ? 'text-gray-300' : 'text-gray-700',
                  )}
                >
                  Quantity:
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                    disabled={quantity <= 1}
                    className={cn(
                      'p-2 rounded-lg',
                      isDarkPurple
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50',
                    )}
                  >
                    <Minus size={18} />
                  </button>
                  <span
                    className={cn('mx-4 font-bold', isDarkPurple ? 'text-white' : 'text-gray-800')}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className={cn(
                      'p-2 rounded-lg',
                      isDarkPurple
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    )}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-sm', isDarkPurple ? 'text-gray-400' : 'text-gray-500')}>
                    Total:
                  </span>
                  <span
                    className={cn(
                      'text-xl font-bold',
                      isDarkPurple ? 'text-white' : 'text-gray-800',
                    )}
                  >
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    'w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                    isDarkPurple
                      ? 'bg-primary hover:bg-primary/90 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white',
                  )}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
