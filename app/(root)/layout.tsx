import type { Metadata } from 'next';
import { Header } from '@/components/shared';
import { ThemeProvider } from '@/providers/theme-provider';
import { NextAuthSessionProvider } from '@/providers/session-provider';

export const metadata: Metadata = {
  title: 'Next Pizza',
  description: 'Next Pizza - Pizza Delivery',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <NextAuthSessionProvider>
      <ThemeProvider>
        <main className="min-h-screen">
          <Header />
          {children}
          {modal}
        </main>
      </ThemeProvider>
    </NextAuthSessionProvider>
  );
}
