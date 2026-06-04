'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from '@/lib/actions/admin';
import { OrderStatus } from '@prisma/client';

interface Props {
  orderId: number;
  currentStatus: OrderStatus;
}

export function UpdateStatusSelect({ orderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (err) {
        alert('Failed to update status');
      }
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        currentStatus === 'SUCCEEDED' ? 'text-green-600 font-bold' :
        currentStatus === 'PENDING' ? 'text-yellow-600 font-bold' :
        currentStatus === 'CANCELED' ? 'text-red-600 font-bold' : ''
      }`}
    >
      <option value="PENDING">PENDING</option>
      <option value="SUCCEEDED">SUCCEEDED</option>
      <option value="CANCELED">CANCELED</option>
    </select>
  );
}
