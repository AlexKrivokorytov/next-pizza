import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  productItemId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  ingredients?: { id: number; name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productItemId: number) => void;
  updateQuantity: (productItemId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (item: CartItem) => {
        const { items } = get();
        // Check if item exists with same productItemId AND same ingredients
        const existingItem = items.find((i) => {
          if (i.productItemId !== item.productItemId) return false;
          
          const existingIngredients = i.ingredients?.map(ing => ing.id).sort().join(',') || '';
          const newIngredients = item.ingredients?.map(ing => ing.id).sort().join(',') || '';
          
          return existingIngredients === newIngredients;
        });

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
            totalItems: get().totalItems + item.quantity,
            totalAmount: get().totalAmount + item.price * item.quantity,
          });
        } else {
          set({
            items: [...items, item],
            totalItems: get().totalItems + item.quantity,
            totalAmount: get().totalAmount + item.price * item.quantity,
          });
        }
      },

      removeItem: (id: number) => {
        const { items } = get();
        const itemToRemove = items.find((i) => i.id === id);

        if (itemToRemove) {
          set({
            items: items.filter((i) => i.id !== id),
            totalItems: get().totalItems - itemToRemove.quantity,
            totalAmount: get().totalAmount - itemToRemove.price * itemToRemove.quantity,
          });
        }
      },

      updateQuantity: (id: number, quantity: number) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);

        if (item) {
          const quantityDiff = quantity - item.quantity;

          set({
            items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
            totalItems: get().totalItems + quantityDiff,
            totalAmount: get().totalAmount + item.price * quantityDiff,
          });
        }
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
