'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateIngredient } from '@/lib/actions/admin';
import { Ingredient } from '@prisma/client';

interface Props {
  ingredient: Ingredient;
}

/**
 * Form for editing an existing ingredient in the admin panel.
 *
 * @param ingredient - The ingredient to edit.
 */
export function EditIngredientForm({ ingredient }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [name, setName] = React.useState(ingredient.name);
  const [price, setPrice] = React.useState(String(ingredient.price));
  const [imageUrl, setImageUrl] = React.useState(ingredient.imageUrl);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a positive number');
      return;
    }

    startTransition(async () => {
      try {
        await updateIngredient(ingredient.id, { name, price: priceNum, imageUrl });
        router.push('/admin/ingredients');
        router.refresh();
      } catch {
        setError('Failed to update ingredient');
      }
    });
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Edit Ingredient</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Price ($)</label>
            <Input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
