import { prisma } from '@/prisma/prisma-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { CreateIngredientForm } from './create-ingredient-form';
import { DeleteIngredientButton } from './delete-ingredient-button';

export default async function AdminIngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { id: 'asc' },
    include: {
      baseProducts: { select: { id: true } },
      products: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
          <p className="text-muted-foreground mt-1">
            Manage base and add-on ingredients for all products.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Ingredients ({ingredients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Image
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Used In
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {ingredients.map((ingredient) => (
                        <tr
                          key={ingredient.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            <div className="relative h-10 w-10 rounded-md overflow-hidden bg-secondary">
                              <Image
                                src={ingredient.imageUrl}
                                alt={ingredient.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          </td>
                          <td className="p-4 align-middle font-medium">{ingredient.name}</td>
                          <td className="p-4 align-middle">${ingredient.price.toFixed(2)}</td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {ingredient.baseProducts.length} pizzas (base),{' '}
                            {ingredient.products.length} (addon)
                          </td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/ingredients/${ingredient.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <DeleteIngredientButton ingredientId={ingredient.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {ingredients.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No ingredients found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <CreateIngredientForm />
        </div>
      </div>
    </div>
  );
}
