import { cn } from '@/shared/lib/utils';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useTheme } from '@/providers/theme-provider';

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  active?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IngredientItem: React.FC<Props> = ({
  className,
  active,
  price,
  name,
  imageUrl,
  loading,
  onClick,
}) => {
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`Select ${name} ingredient${active ? ' (selected)' : ''}`}
      className={cn(
        'flex items-center flex-col p-1 rounded-md w-32 text-center relative',
        'cursor-pointer transition-all duration-200',
        isDarkPurple
          ? cn(
              'bg-card hover:bg-card/80',
              'shadow-none hover:shadow-md focus:shadow-md',
              active && 'border-2 border-primary bg-card/80',
            )
          : cn(
              'bg-white shadow-md hover:shadow-lg focus:shadow-lg',
              active && 'border-2 border-primary',
            ),
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        {
          'opacity-75 cursor-wait': loading,
        },
        className,
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {active && (
        <CircleCheck
          className="absolute top-2 right-2 text-primary animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}
      <div className="relative w-[110px] h-[110px]">
        <Image
          src={imageUrl}
          alt={`${name} ingredient`}
          fill
          sizes="110px"
          className="object-contain transition-transform duration-200 group-hover:scale-105"
          priority={false}
        />
      </div>
      <span
        className={cn(
          'text-xs mb-1 mt-2',
          isDarkPurple ? 'text-muted-foreground' : 'text-gray-600',
        )}
      >
        {name}
      </span>
      <span className={cn('font-bold', isDarkPurple ? 'text-foreground' : 'text-gray-900')}>
        {price} $
      </span>
    </div>
  );
};
