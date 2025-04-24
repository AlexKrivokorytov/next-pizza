'use client';

import React from 'react';
import { Container } from './container';
import { SortPopup } from './sort-popup';
import { Categories } from './categories';
import { cn } from '../../lib/utils';
import { useTheme } from '../../../providers/theme-provider';
import { Category } from '@prisma/client';
import { categories } from '../../../prisma/constants';

interface TopBarProps {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ categories, className }) => {
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <div
      className={cn(
        'sticky top-0 z-10 py-5 shadow-lg',
        isDarkPurple ? 'bg-card shadow-purple-900/10' : 'bg-white shadow-black/5',
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories items={categories} />
        <SortPopup />
      </Container>
    </div>
  );
};
