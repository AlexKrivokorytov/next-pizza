import { ChooseProductModal } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the params to resolve the Promise

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      items: true,
    },
  });

  if (!product) {
    notFound();
  }

  return <ChooseProductModal product={product} />;
}