import { notFound } from 'next/navigation';
import { prisma } from '@/prisma/prisma-client';
import { EditIngredientForm } from './edit-ingredient-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditIngredientPage({ params }: Props) {
  const { id } = await params;
  const ingredientId = Number(id);

  if (isNaN(ingredientId)) {
    notFound();
  }

  const ingredient = await prisma.ingredient.findUnique({ where: { id: ingredientId } });

  if (!ingredient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/ingredients"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Ingredients
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Ingredient</h1>
        <p className="text-muted-foreground mt-1">
          Updating: <strong>{ingredient.name}</strong>
        </p>
      </div>
      <EditIngredientForm ingredient={ingredient} />
    </div>
  );
}
