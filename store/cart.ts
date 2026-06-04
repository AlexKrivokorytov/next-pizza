import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
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
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const calcTotalAmount = (items: CartItem[]) => 
  Math.round(items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100) / 100;
const calcTotalItems = (items: CartItem[]) => items.reduce((acc, item) => acc + item.quantity, 0);

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
          const newItems = items.map((i) =>
            i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          );
          set({
            items: newItems,
            totalItems: calcTotalItems(newItems),
            totalAmount: calcTotalAmount(newItems),
          });
        } else {
          const newItems = [...items, item];
          set({
            items: newItems,
            totalItems: calcTotalItems(newItems),
            totalAmount: calcTotalAmount(newItems),
          });
        }
      },

      removeItem: (id: string) => {
        const { items } = get();
        const itemToRemove = items.find((i) => i.id === id);

        if (itemToRemove) {
          const newItems = items.filter((i) => i.id !== id);
          set({
            items: newItems,
            totalItems: calcTotalItems(newItems),
            totalAmount: calcTotalAmount(newItems),
          });
        }
      },

      updateQuantity: (id: string, quantity: number) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);

        if (item) {
          const newItems = items.map((i) => (i.id === id ? { ...i, quantity } : i));
          set({
            items: newItems,
            totalItems: calcTotalItems(newItems),
            totalAmount: calcTotalAmount(newItems),
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate totals on load to wipe away any old floating-point bugs stored in cache
          state.totalAmount = calcTotalAmount(state.items);
          state.totalItems = calcTotalItems(state.items);
        }
      },
    },
  ),
);
