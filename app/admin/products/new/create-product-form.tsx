'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createProduct } from '@/lib/actions/admin';
import { Category, Ingredient } from '@prisma/client';

interface Props {
  categories: Category[];
  ingredients: Ingredient[];
}

export function CreateProductForm({ categories, ingredients }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    categoryId: categories[0]?.id || 1,
    price: '',
  });

  const [selectedBaseIngredients, setSelectedBaseIngredients] = useState<number[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  const toggleIngredient = (id: number, type: 'base' | 'addon') => {
    if (type === 'base') {
      setSelectedBaseIngredients(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedAddons(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
        baseIngredients: selectedBaseIngredients,
        ingredients: selectedAddons,
      });
      router.push('/admin/products');
    } catch (error) {
      alert('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              required 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder="E.g. Pepperoni" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              required
              className="w-full min-h-[100px] p-3 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Delicious pizza with..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                required 
                value={formData.imageUrl} 
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                placeholder="https://..." 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Price ($)</label>
              <Input 
                required 
                type="number"
                min="0"
                step="0.01"
                value={formData.price} 
                onChange={e => setFormData({ ...formData, price: e.target.value })} 
                placeholder="10.99" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold">Base Ingredients (Recipe)</h3>
            <p className="text-sm text-muted-foreground mb-4">These are the core ingredients of the product. They are used for filtering.</p>
            <div className="h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar">
              {ingredients.map(ing => (
                <label key={ing.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary rounded-md">
                  <input 
                    type="checkbox" 
                    checked={selectedBaseIngredients.includes(ing.id)}
                    onChange={() => toggleIngredient(ing.id, 'base')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{ing.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold">Add-ons (Optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">These are optional ingredients the user can pay to add to the product.</p>
            <div className="h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar">
              {ingredients.map(ing => (
                <label key={ing.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary rounded-md">
                  <input 
                    type="checkbox" 
                    checked={selectedAddons.includes(ing.id)}
                    onChange={() => toggleIngredient(ing.id, 'addon')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{ing.name} (+${ing.price})</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  );
}
