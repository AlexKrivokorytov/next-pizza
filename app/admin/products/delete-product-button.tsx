'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/admin';
import { useRouter } from 'next/navigation';

interface DeleteProductButtonProps {
  /** The product ID to delete. */
  productId: number;
}

/**
 * Client-side button to delete a product via the admin Server Action.
 * Shows a confirmation dialog before proceeding.
 *
 * @param productId - The ID of the product to delete.
 */
export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete product"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
