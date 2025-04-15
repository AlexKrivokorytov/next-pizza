import React from 'react';
import { Container } from './container';
import { SortPopup } from './sort-popup';
import { Categories } from './categories';
import { cn } from '../../lib/utils';

interface TopBarProps {
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 bg-white py-5 shadow-lg shadow-black/5',
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories />
        <SortPopup />
      </Container>
    </div>
  );
};
