'use client';

import { cn } from '@/shared/lib/utils';
import React, { useState } from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowRight, ShoppingCart, User } from 'lucide-react';
import { SearchInput } from './search-input';
import { ThemeToggle } from './theme-toggle';
import { useCartStore } from '@/shared/store/cart';
import { CartDropdown } from '../cart/cart-dropdown';

interface HeaderProps {
  className?: string;
}

/**
 * Main site header with logo, search, theme toggle, sign-in, and cart controls.
 *
 * @param className - Additional class names for the header.
 *
 * @returns The header element with navigation and controls.
 */
export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { totalItems, totalAmount } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header className={cn('border border-b', className)}>
      <Container className="flex items-center justify-between py-8">
        {/* left part */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src={'/logo.png'} alt="logo" width={45} height={45} />
            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">better taste forever</p>
            </div>
          </div>
        </Link>
        <div className="mx-10 flex-1">
          <SearchInput />
        </div>
        {/* right part */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" className="flex items-center gap-1">
            <User size={24} />
            Sign in
          </Button>
          <div className="relative">
            <Button className="group relative" onClick={toggleCart}>
              <b>{totalAmount.toFixed(2)}$</b>
              <span className="h-full w-[1px] bg-white/30 mx-3" />
              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <ShoppingCart size={16} className="relative" strokeWidth={2} />
                <b>{totalItems}</b>
              </div>
              <ArrowRight
                size={20}
                className="absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              />
            </Button>
            <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      </Container>
    </header>
  );
};
