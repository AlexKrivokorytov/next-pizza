'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createIngredient } from '@/lib/actions/admin';

/**
 * Form for creating a new ingredient in the admin panel.
 * Clears itself on successful submission.
 */
export function CreateIngredientForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
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
        await createIngredient({ name, price: priceNum, imageUrl });
        setName('');
        setPrice('');
        setImageUrl('');
        router.refresh();
      } catch {
        setError('Failed to create ingredient');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Ingredient</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Jalapeño"
            />
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
              placeholder="0.85"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/ingredients/jalapeno.png"
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Creating...' : 'Create Ingredient'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
