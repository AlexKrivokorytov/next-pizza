'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';

/**
 * Root app providers wrapper — SessionProvider + ThemeProvider.
 * Must be a client component since both providers use React context.
 *
 * @param children - Child components to wrap.
 * @returns Providers tree wrapping children.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
