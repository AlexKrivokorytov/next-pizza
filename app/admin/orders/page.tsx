import { prisma } from '@/prisma/prisma-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateStatusSelect } from './update-status-select';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders and their statuses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
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
                        <div className="truncate max-w-[200px]" title={order.address}>{order.address}</div>
                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                      </td>
                      <td className="p-4 align-middle font-bold">${order.totalAmount.toFixed(2)}</td>
                      <td className="p-4 align-middle w-[200px]">
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
        </CardContent>
      </Card>
    </div>
  );
}
