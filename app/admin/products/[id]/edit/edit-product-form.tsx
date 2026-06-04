'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateProduct } from '@/lib/actions/admin';
import { Category, Ingredient, Product } from '@prisma/client';

interface Props {
  product: Product & {
    category: Category;
    baseIngredients: Ingredient[];
    ingredients: Ingredient[];
  };
  categories: Category[];
  ingredients: Ingredient[];
}

/**
 * Form for editing an existing product in the admin panel.
 * Pre-fills all fields with current product data.
 *
 * @param product - The product with relations to edit.
 * @param categories - All available categories.
 * @param ingredients - All available ingredients.
 */
export function EditProductForm({ product, categories, ingredients }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [selectedBase, setSelectedBase] = useState<number[]>(
    product.baseIngredients.map((i) => i.id),
  );
  const [selectedAddons, setSelectedAddons] = useState<number[]>(
    product.ingredients.map((i) => i.id),
  );
  const [error, setError] = useState('');

  const toggleIngredient = (id: number, type: 'base' | 'addon') => {
    if (type === 'base') {
      setSelectedBase((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setSelectedAddons((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        await updateProduct(product.id, {
          name,
          description,
          imageUrl,
          categoryId: Number(categoryId),
          baseIngredients: selectedBase,
          ingredients: selectedAddons,
        });
        router.push('/admin/products');
        router.refresh();
      } catch {
        setError('Failed to update product');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Base Ingredients (Recipe)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Core ingredients used for search filtering.
            </p>
            <div className="h-[300px] overflow-y-auto space-y-1 pr-2 scrollbar">
              {ingredients.map((ing) => (
                <label
                  key={ing.id}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedBase.includes(ing.id)}
                    onChange={() => toggleIngredient(ing.id, 'base')}
                    className="rounded"
                  />
                  <span className="text-sm">{ing.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add-ons (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Optional paid add-ons users can add.
            </p>
            <div className="h-[300px] overflow-y-auto space-y-1 pr-2 scrollbar">
              {ingredients.map((ing) => (
                <label
                  key={ing.id}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(ing.id)}
                    onChange={() => toggleIngredient(ing.id, 'addon')}
                    className="rounded"
                  />
                  <span className="text-sm">
                    {ing.name} (+${ing.price.toFixed(2)})
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} size="lg" className="flex-1">
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
