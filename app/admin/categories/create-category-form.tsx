'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCategory } from '@/lib/actions/admin';

export function CreateCategoryForm() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createCategory(name);
      setName('');
    } catch (error) {
      alert('Failed to create category. It might already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Category Name</label>
        <Input 
          required 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="E.g. Desserts" 
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Category'}
      </Button>
    </form>
  );
}
