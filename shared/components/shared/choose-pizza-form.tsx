import React from 'react';
import { cn } from '../../lib/utils';
import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { IngredientItem } from './ingredient-item';
import { useTheme } from '../../../providers/theme-provider';
import {
  PizzaSize,
  pizzaSizes,
  PizzaType,
  mapPizzaSize,
  mapPizzaType,
  pizzaTypes,
} from '../../constants/pizza';
import { Ingredient } from '@prisma/client';

interface ChoosePizzaFormProps {
  imageUrl: string;
  name: string;
  classname?: string;
  ingredients: Ingredient[];
  items?: any[];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<ChoosePizzaFormProps> = ({
  name,
  items,
  imageUrl,
  ingredients,
  onClickAdd,
  classname,
}) => {
  const { theme } = useTheme();
  const isDarkPurple = theme === 'dark-purple';
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, setSelectedIngredients] = React.useState<Set<number>>(new Set());

  // Calculate text details based on selected size and type
  const textDetails = `${size}cm, ${mapPizzaType[type]} dough`;

  // Calculate total price based on size and selected ingredients
  const basePrice = 15; // Base price in dollars
  const ingredientsPrice = Array.from(selectedIngredients).reduce((total, id) => {
    const ingredient = ingredients.find((ing) => ing.id === id);
    return total + (ingredient?.price || 0);
  }, 0);
  const totalPrice = `${basePrice + ingredientsPrice}$`;

  const toggleIngredient = (id: number) => {
    setSelectedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={cn(classname, 'flex flex-1')}>
      <div className="flex-1 flex items-center justify-center p-8">
        <PizzaImage imageUrl={imageUrl} size={size} />
      </div>
      <div
        className={cn(
          'w-[490px] p-7 flex flex-col',
          isDarkPurple ? 'bg-background' : 'bg-[#f9f9f9]',
        )}
      >
        <Title
          text={name}
          size="md"
          className={cn(
            'text-2xl font-extrabold mb-1',
            isDarkPurple ? 'text-foreground' : 'text-gray-800',
          )}
        />
        <p className={cn('text-sm', isDarkPurple ? 'text-muted-foreground' : 'text-gray-400')}>
          {textDetails}
        </p>

        <div className="flex flex-col gap-4 mt-5">
          <div>
            <h3
              className={cn(
                'text-sm font-semibold mb-2',
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

          <div>
            <h3
              className={cn(
                'text-sm font-semibold mb-2',
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

          <div>
            <h3
              className={cn(
                'text-sm font-semibold mb-2',
                isDarkPurple ? 'text-foreground' : 'text-gray-800',
              )}
            >
              Add ingredients:
            </h3>
            <div
              className={cn(
                'grid grid-cols-3 gap-3 p-5 rounded-lg h-[420px] overflow-auto scrollbar',
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
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={onClickAdd}
          className={cn(
            'h-[55px] px-10 text-base rounded-[18px] w-full mt-10 font-bold',
            isDarkPurple
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-[#7848f8] hover:bg-[#7848f8]/90 text-white',
          )}
        >
          Add to cart for {totalPrice}
        </Button>
      </div>
    </div>
  );
};
