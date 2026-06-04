import React from 'react';
import { cn } from '../../lib/utils';
import { PizzaImage } from './pizza-image';
import { Title } from './title';
import { Button } from '../ui';

interface ChooseProductFormProps {
  imageUrl: string;
  name: string;
  price: number;
  itemId: number;
  classname?: string;
  onClickAdd?: (itemId: number) => void;
}

/**
 * Displays a form for choosing a pizza product with image, name, and add-to-cart button.
 *
 * @param imageUrl - Product image URL.
 * @param name - Product name.
 * @param classname - Additional class names for the form container.
 * @param onClickAdd - Handler for the add-to-cart button.
 *
 * @returns A form section with product details and add-to-cart action.
 */
export const ChooseProductForm: React.FC<ChooseProductFormProps> = ({
  name,
  imageUrl,
  price,
  itemId,
  onClickAdd,
  classname,
}) => {
  return (
    <div className={cn(classname, 'flex')}>
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="relative">
          <img
            src={imageUrl || '/images/default-pizza.png'}
            alt={name}
            className="relative left-2 top-2 transition-all z-10 duration-300 w-95 h-95"
          />
        </div>
      </div>

      <div className="w-1/2 p-8 flex flex-col">
        <Title text={name} size="md" className="text-2xl font-extrabold mb-1" />
        <p className="text-gray-500 text-sm mb-6">{name}</p>

        <Button
          onClick={() => onClickAdd?.(itemId)}
          className="h-13.75 px-10 text-base rounded-4.5 w-full mt-10"
        >
          Add to cart for {price}$
        </Button>
      </div>
    </div>
  );
};
