import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Next Pizza — Order Online',
  description:
    'Order your favourite pizzas, snacks and drinks online. Fresh ingredients, fast delivery.',
  keywords: ['pizza', 'delivery', 'order online', 'next pizza'],
  openGraph: {
    title: 'Next Pizza',
    description: 'Order your favourite pizzas online',
    type: 'website',
  },
};

export default function MainRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link data-rh="true" rel="icon" href="/logo.png" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
