// /shared/components/shared/modals/choose-product-modal.tsx
// /shared/components/shared/modals/choose-product-modal.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ProductForm } from '../product-form';
import { ProductWithRelations } from '@/@types/prisma';
import { useTheme } from '@/providers/theme-provider';

interface ChooseProductModalProps {
  product: ProductWithRelations;
  classname?: string;
}

/**
 * Modal dialog for choosing a product or pizza, displaying the appropriate form.
 *
 * @param product - Product object with relations (ingredients, items, etc.).
 * @param classname - Additional class names for the modal container.
 *
 * @returns A modal dialog with a product or pizza selection form.
 */
export const ChooseProductModal: React.FC<ChooseProductModalProps> = ({ product, classname }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'p-0 w-[95vw] max-w-[1060px] max-h-[90vh] overflow-hidden rounded-2xl',
          isDarkPurple ? 'bg-secondary border-border' : 'bg-white border-none',
          classname,
        )}
      >
        <ProductForm product={product} onSubmit={() => router.back()} />
        <DialogTitle className="sr-only">{product?.name || 'Product Details'}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};
