import { prisma } from '@/prisma/prisma-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteProductButton } from './delete-product-button';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      items: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your store menu items.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Variants</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price From</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {products.map((product) => {
                    const lowestPrice = product.items.length > 0 
                      ? Math.min(...product.items.map(i => i.price)) 
                      : 0;

                    return (
                      <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-4 align-middle font-medium">{product.name}</td>
                        <td className="p-4 align-middle">{product.category.name}</td>
                        <td className="p-4 align-middle">{product.items.length} variants</td>
                        <td className="p-4 align-middle">${lowestPrice.toFixed(2)}</td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DeleteProductButton productId={product.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No products found.
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
  );
}
