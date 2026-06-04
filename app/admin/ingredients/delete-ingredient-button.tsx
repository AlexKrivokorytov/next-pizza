'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteIngredient } from '@/lib/actions/admin';
import { useRouter } from 'next/navigation';

interface DeleteIngredientButtonProps {
  /** The ingredient ID to delete. */
  ingredientId: number;
}

/**
 * Client-side button to delete an ingredient via the admin Server Action.
 * Shows a confirmation dialog before proceeding.
 *
 * @param ingredientId - The ID of the ingredient to delete.
 */
export function DeleteIngredientButton({ ingredientId }: DeleteIngredientButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = () => {
    if (!confirm('Delete this ingredient? It will be removed from all related pizzas.')) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteIngredient(ingredientId);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete ingredient:', error);
        alert('Failed to delete. It may be in use by cart items.');
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete ingredient"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
