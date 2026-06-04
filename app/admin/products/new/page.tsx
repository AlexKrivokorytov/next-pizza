import { prisma } from '@/prisma/prisma-client';
import { CreateProductForm } from './create-product-form';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground mt-1">Add a new item to your menu.</p>
      </div>

      <CreateProductForm 
        categories={categories} 
        ingredients={ingredients} 
      />
    </div>
  );
}
