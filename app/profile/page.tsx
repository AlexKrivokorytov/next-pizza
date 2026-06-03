import { Container, Title } from '@/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/');
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: { orders: true },
  });

  return (
    <Container className="my-10">
      <Title text={`Profile: ${user?.fullName}`} size="lg" className="font-extrabold mb-8" />

      <div className="flex gap-10">
        <div className="flex-1 rounded-xl bg-white dark:bg-gray-900 shadow-md p-7">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-xl bg-white dark:bg-gray-900 shadow-md p-7">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {user?.orders && user.orders.length > 0 ? (
            <ul className="space-y-4">
              {user.orders.map((order) => (
                <li key={order.id} className="border-b pb-4">
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">Total: ${order.totalAmount}</p>
                  <p className="text-sm text-gray-500">Status: {order.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          )}
        </div>
      </div>
    </Container>
  );
}
