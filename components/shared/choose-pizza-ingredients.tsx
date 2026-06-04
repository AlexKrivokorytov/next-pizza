import React from 'react';
import { cn } from '@/lib/utils';
import { IngredientItem } from './ingredient-item';
import { Ingredient } from '@prisma/client';
import { useTheme } from '@/providers/theme-provider';

interface ChoosePizzaIngredientsProps {
  ingredients: Ingredient[];
  selectedIds: Set<number>;
  onClick: (id: number) => void;
  className?: string;
}

export const ChoosePizzaIngredients: React.FC<ChoosePizzaIngredientsProps> = ({
  ingredients,
  selectedIds,
  onClick,
  className,
}) => {
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';

  return (
    <div className={cn('flex flex-col flex-1 min-h-0', className)}>
      <h3
        className={cn(
          'text-xs sm:text-sm font-semibold mb-2',
          isDarkPurple ? 'text-foreground' : 'text-gray-800',
        )}
      >
        Add ingredients:
      </h3>
      <div
        className={cn(
          'grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg',
          'min-w-62.5 w-full',
          'overflow-y-auto grow',
          'scrollbar',
          isDarkPurple ? 'bg-muted' : 'bg-white',
        )}
      >
        {ingredients.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            imageUrl={ingredient.imageUrl}
            name={ingredient.name}
            price={ingredient.price}
            active={selectedIds.has(ingredient.id)}
            onClick={() => onClick(ingredient.id)}
            className="min-w-20 min-h-20 w-full h-full"
          />
        ))}
      </div>
    </div>
  );
};
