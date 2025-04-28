// /shared/components/shared/modals/choose-product-modal.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelations } from '../../../../@types/prisma';
import { ChoosePizzaForm } from '../choose-pizza-form';
import { useTheme } from '../../../../providers/theme-provider';

interface ChooseProductModalProps {
  product: ProductWithRelations;
  classname?: string;
}

export const ChooseProductModal: React.FC<ChooseProductModalProps> = ({ product, classname }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';
  const isPizzaForm = Boolean(product.items[0].pizzaType);

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'p-0 w-[95vw] max-w-[1060px] max-h-[90vh] overflow-hidden rounded-2xl',
          isDarkPurple ? 'bg-secondary border-border' : 'bg-white border-none',
          classname,
        )}
      >
        {isPizzaForm ? (
          <ChoosePizzaForm
            imageUrl={product?.imageUrl || ''}
            name={product?.name || ''}
            ingredients={product.ingredients}
            items={product.items}
          />
        ) : (
          <ChooseProductForm imageUrl={product?.imageUrl || ''} name={product?.name || ''} />
        )}
        <DialogTitle className="sr-only">{product?.name || 'Product Details'}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};
