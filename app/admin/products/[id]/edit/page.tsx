import { notFound } from 'next/navigation';
import { prisma } from '@/prisma/prisma-client';
import { EditProductForm } from './edit-product-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  const [product, categories, ingredients] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        baseIngredients: true,
        ingredients: true,
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.ingredient.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-1">
          Editing: <strong>{product.name}</strong>
        </p>
      </div>
      <EditProductForm product={product} categories={categories} ingredients={ingredients} />
    </div>
  );
}
