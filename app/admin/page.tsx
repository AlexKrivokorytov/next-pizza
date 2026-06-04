import { prisma } from '@/prisma/prisma-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pizza, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';
import { RevenueChart, OrderStatusChart } from './dashboard-charts';
import { SyncSearchButton } from './sync-search-button';

/**
 * Aggregates order data into daily revenue buckets for the last 14 days.
 */
function buildDailyRevenue(
  orders: Array<{ totalAmount: number; status: string; id: number; createdAt: Date }>,
): Array<{ date: string; revenue: number; orders: number }> {
  const days = 14;
  const map = new Map<string, { revenue: number; orders: number }>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map.set(key, { revenue: 0, orders: 0 });
  }

  const succeeded = orders.filter((o) => o.status === 'SUCCEEDED');
  succeeded.forEach((order) => {
    const d = new Date(order.createdAt);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (map.has(key)) {
      const existing = map.get(key)!;
      map.set(key, {
        revenue: existing.revenue + order.totalAmount,
        orders: existing.orders + 1,
      });
    }
  });

  return [...map.entries()].map(([date, v]) => ({
    date,
    revenue: parseFloat(v.revenue.toFixed(2)),
    orders: v.orders,
  }));
}

export default async function AdminDashboardPage() {
  const [totalUsers, totalProducts, allOrders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({
      select: { id: true, fullName: true, totalAmount: true, status: true, email: true, createdAt: true },
      orderBy: { id: 'desc' },
    }),
  ]);

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter((o) => o.status === 'SUCCEEDED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = allOrders.slice(0, 5);
  const dailyRevenue = buildDailyRevenue(allOrders);

  const statusCounts = [
    { name: 'PENDING', value: allOrders.filter((o) => o.status === 'PENDING').length },
    { name: 'SUCCEEDED', value: allOrders.filter((o) => o.status === 'SUCCEEDED').length },
    { name: 'CANCELED', value: allOrders.filter((o) => o.status === 'CANCELED').length },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome to the Next Pizza admin panel.</p>
        </div>
        <SyncSearchButton />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From successful orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Lifetime orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Pizza className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items in the menu</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue (last 14 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={dailyRevenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusCounts.length > 0 ? (
              <OrderStatusChart data={statusCounts} />
            ) : (
              <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">{order.fullName}</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-bold">${order.totalAmount.toFixed(2)}</div>
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'SUCCEEDED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No recent orders</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
