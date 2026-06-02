'use client';

import React from 'react';
import { useCartStore } from '@/store/cart';
import { calcTotalPizzaPrice } from '@/lib';
import { ChoosePizzaForm } from './choose-pizza-form';
import { ChooseProductForm } from './choose-product-form';

interface ProductFormProps {
  product: any;
  onSubmit?: () => void;
  className?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, className }) => {
  const { addItem } = useCartStore();
  const isPizzaForm = Boolean(product.items[0].pizzaType);

  const onSubmitPizza = (itemId: number, ingredientIds: number[]) => {
    const itemInfo = product.items.find((i: any) => i.id === itemId);
    const selectedIngredients = product.ingredients.filter((i: any) => ingredientIds.includes(i.id));
    const price = calcTotalPizzaPrice(itemInfo, new Set(ingredientIds), product.ingredients);
    
    addItem({
      id: Date.now(),
      productItemId: itemId,
      name: product.name,
      imageUrl: product.imageUrl,
      price,
      quantity: 1,
      ingredients: selectedIngredients.map((i: any) => ({ id: i.id, name: i.name, price: i.price }))
    });
    onSubmit?.();
  };

  const onSubmitProduct = (itemId: number) => {
    const itemInfo = product.items.find((i: any) => i.id === itemId);
    addItem({
      id: Date.now(),
      productItemId: itemId,
      name: product.name,
      imageUrl: product.imageUrl,
      price: itemInfo.price,
      quantity: 1,
    });
    onSubmit?.();
  };

  if (isPizzaForm) {
    return (
      <ChoosePizzaForm
        imageUrl={product.imageUrl}
        name={product.name}
        ingredients={product.ingredients}
        items={product.items}
        onClickAddCart={onSubmitPizza}
        classname={className}
      />
    );
  }

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      price={product.items[0].price}
      itemId={product.items[0].id}
      onClickAdd={onSubmitProduct}
      classname={className}
    />
  );
};
