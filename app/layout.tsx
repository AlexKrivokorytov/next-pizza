import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Header } from '../components/shared';
import { ThemeProvider } from '../providers/theme-provider';

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Next Pizza',
  description: 'Next Pizza - Pizza Delivery',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <ThemeProvider>
          <main className="min-h-screen">
            <Header />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
