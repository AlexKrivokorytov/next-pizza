import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Pizza, Carrot } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export const metadata = {
  title: 'Admin Panel | Next Pizza',
  description: 'Manage your Next Pizza store',
};

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Pizza },
  { href: '/admin/ingredients', label: 'Ingredients', icon: Carrot },
  { href: '/admin/categories', label: 'Categories', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-full">
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/admin" className="text-xl font-black text-primary">
            🍕 Admin Panel
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {adminLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  <link.icon size={20} className="text-gray-500" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t flex flex-col gap-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-foreground text-center">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-end px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm font-medium">{session.user.name}</span>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-background/50">
          {children}
        </div>
      </main>
    </div>
  );
}
