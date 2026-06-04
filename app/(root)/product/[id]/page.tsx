import { Container, ProductForm } from '@/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      category: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const isPizzaForm = Boolean(product.items[0]?.pizzaType);

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1 rounded-xl bg-white dark:bg-gray-900 shadow-md overflow-hidden">
        <ProductForm product={product} className="w-full" />
      </div>
    </Container>
  );
}
