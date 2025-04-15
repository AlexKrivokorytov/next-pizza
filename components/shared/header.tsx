import { cn } from '@/lib/utils';
import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowRight, ShoppingCart, User } from 'lucide-react';
import { SearchInput } from './search-input';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn('border border-b', className)}>
      <Container className="flex items-center justify-between py-8">
        {/* left part */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image
              src={'/logo.png'}
              alt="logo"
              width={45}
              height={45}
            />
            <div>
              <h1 className="text-2xl uppercase font-black">
                Next Pizza
              </h1>
              <p className="text-sm text-gray-400 leading-3">
                better taste forever
              </p>
            </div>
          </div>
        </Link>
        <div className="mx-10 flex-1">
          <SearchInput />
        </div>
        {/* right part */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-1"
          >
            <User size={24} />
            Sign in
          </Button>
          <div>
            <Button className="group relative">
              <b>13$</b>
              <span className="h-full w-[1px] bg-white/30 mx-3" />
              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <ShoppingCart
                  size={16}
                  className=" relative"
                  strokeWidth={2}
                />
                <b>3</b>
              </div>
              <ArrowRight
                size={20}
                className=" absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
