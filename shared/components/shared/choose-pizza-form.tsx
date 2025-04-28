// /shared/components/shared/choose-pizza-form.tsx
import React from 'react';
import { cn } from '../../lib/utils';
import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { IngredientItem } from './ingredient-item';
import { useTheme } from '../../../providers/theme-provider';
import { useSet } from 'react-use';
import { PizzaSize, pizzaSizes, PizzaType, mapPizzaType, pizzaTypes } from '../../constants/pizza';
import { Ingredient, ProductItem } from '@prisma/client';

interface ChoosePizzaFormProps {
  imageUrl: string;
  name: string;
  classname?: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  onClickAddCart?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<ChoosePizzaFormProps> = ({
  name,
  items,
  imageUrl,
  ingredients,
  onClickAddCart,
  classname,
}) => {
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: toggleIngredient }] = useSet<number>(new Set());

  // Calculate text details based on selected size and type
  const textDetails = `${size}cm, ${mapPizzaType[type]} dough `;

  // Calculate total price based on selected pizza and ingredients
  const selectedPizza = items.find((item) => item.pizzaType === type && item.size === size);
  const basePrice = selectedPizza?.price || 0;
  const ingredientsPrice = Array.from(selectedIngredients).reduce((total, id) => {
    const ingredient = ingredients.find((ing) => ing.id === id);
    return total + (ingredient?.price || 0);
  }, 0);
  const totalPrice = `${basePrice + ingredientsPrice}$`;

  // Check if current combination is available
  const isAvailable = Boolean(selectedPizza);

	console.log('selectedPizza', selectedPizza);

  return (
    <div
      className={cn(
        classname,
        'flex flex-col lg:flex-row flex-1 h-full max-h-[inherit] w-full overflow-hidden',
      )}
    >
      {/* Left side: Pizza Image Area */}
      <div className="flex items-center justify-center p-4 sm:p-5 lg:p-6 max-w-full lg:max-w-[50%] lg:flex-1">
        <div className="relative w-full flex items-center justify-center">
          {/* Pizza container with responsive sizing */}
          <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-none mx-auto">
            {/* Background circles - only show on screens wider than 1024px (lg) */}
            <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
              {/* Use relative units or scale with container? Let's try relative units based on container */}
            </div>
            {/* Pizza Image Component */}
            <PizzaImage imageUrl={imageUrl} size={size} />
          </div>
        </div>
      </div>

      {/* Right side: Pizza Options Area */}
      <div
        className={cn(
          'w-full lg:w-[50%] p-4 sm:p-5 lg:p-6 flex flex-col overflow-y-auto',
          'mt-2 lg:mt-0 lg:border-l lg:border-border',
          isDarkPurple ? 'bg-background' : 'bg-[#f9f9f9]',
          'max-h-[50vh] lg:max-h-full', // Limit height on smaller screens
        )}
      >
        <Title
          text={name}
          size="md"
          className={cn(
            'text-lg sm:text-xl md:text-2xl font-extrabold mb-1',
            isDarkPurple ? 'text-foreground' : 'text-gray-800',
          )}
        />
        <p
          className={cn(
            'text-xs sm:text-sm',
            isDarkPurple ? 'text-muted-foreground' : 'text-gray-400',
          )}
        >
          {textDetails}
        </p>

        <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-5 flex-grow min-h-0">
          {/* Size Options */}
          <div>
            <h3
              className={cn(
                'text-xs sm:text-sm font-semibold mb-2',
                isDarkPurple ? 'text-foreground' : 'text-gray-800',
              )}
            >
              Size:
            </h3>
            <GroupVariants
              items={pizzaSizes}
              selectedValue={String(size)}
              onClick={(selectedValue) => setSize(Number(selectedValue) as PizzaSize)}
            />
          </div>

          {/* Dough Type Options */}
          <div>
            <h3
              className={cn(
                'text-xs sm:text-sm font-semibold mb-2',
                isDarkPurple ? 'text-foreground' : 'text-gray-800',
              )}
            >
              Dough Type:
            </h3>
            <GroupVariants
              items={pizzaTypes}
              selectedValue={String(type)}
              onClick={(selectedValue) => setType(Number(selectedValue) as PizzaType)}
            />
          </div>

          {/* Ingredients Options - Allow this section to scroll */}
          <div className="flex flex-col flex-1 min-h-0">
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
                'min-w-[250px] w-full',
                'overflow-y-auto flex-grow',
                'scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent',
                isDarkPurple ? 'bg-muted' : 'bg-white',
              )}
            >
              {ingredients.map((ingredient) => (
                <IngredientItem
                  key={ingredient.id}
                  imageUrl={ingredient.imageUrl}
                  name={ingredient.name}
                  price={ingredient.price}
                  active={selectedIngredients.has(ingredient.id)}
                  onClick={() => toggleIngredient(ingredient.id)}
                  className="min-w-[80px] min-h-[80px] w-full h-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={onClickAddCart}
          disabled={!isAvailable}
          className={cn(
            'h-[40px] sm:h-[45px] md:h-[50px] px-4 sm:px-6 text-sm sm:text-base rounded-lg w-full mt-4 sm:mt-6 font-bold flex-shrink-0',
            isDarkPurple ? 'bg-primary hover:bg-primary/90' : 'bg-primary hover:bg-primary/90',
            !isAvailable && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isAvailable ? `Add to cart for ${totalPrice}` : 'This variant is not available'}
        </Button>
      </div>
    </div>
  );
};
