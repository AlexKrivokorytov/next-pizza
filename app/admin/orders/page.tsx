import { prisma } from '@/prisma/prisma-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateStatusSelect } from './update-status-select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      orderBy: { id: 'desc' },
      skip,
      take,
    }),
    prisma.order.count(),
  ]);

  const totalPages = Math.ceil(totalOrders / take);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders and their statuses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({totalOrders})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Address / Phone</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">#{order.id}</td>
                      <td className="p-4 align-middle">
                        <div className="font-medium">{order.fullName}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="truncate max-w-50" title={order.address}>{order.address}</div>
                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                      </td>
                      <td className="p-4 align-middle font-bold">${order.totalAmount.toFixed(2)}</td>
                      <td className="p-4 align-middle w-50">
                        <UpdateStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
                {page > 1 ? <Link href={`?page=${page - 1}`}>Previous</Link> : <span>Previous</span>}
              </Button>
              <div className="text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <Button variant="outline" size="sm" disabled={page >= totalPages} asChild={page < totalPages}>
                {page < totalPages ? <Link href={`?page=${page + 1}`}>Next</Link> : <span>Next</span>}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
