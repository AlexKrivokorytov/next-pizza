'use client';

import { useTransition } from 'react';
import { updateUserRole } from '@/lib/actions/admin';
import { UserRole } from '@prisma/client';

interface Props {
  userId: number;
  currentRole: UserRole;
}

export function UpdateRoleSelect({ userId, currentRole }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
      } catch (err) {
        alert('Failed to update role');
      }
    });
  };

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={isPending}
      className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        currentRole === 'ADMIN' ? 'text-primary font-bold' : ''
      }`}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
