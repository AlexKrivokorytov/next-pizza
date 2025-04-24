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
        const existingItem = items.find((i) => i.productItemId === item.productItemId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productItemId === item.productItemId ? { ...i, quantity: i.quantity + 1 } : i,
            ),
            totalItems: get().totalItems + 1,
            totalAmount: get().totalAmount + item.price,
          });
        } else {
          set({
            items: [...items, item],
            totalItems: get().totalItems + 1,
            totalAmount: get().totalAmount + item.price,
          });
        }
      },

      removeItem: (productItemId: number) => {
        const { items } = get();
        const itemToRemove = items.find((i) => i.productItemId === productItemId);

        if (itemToRemove) {
          set({
            items: items.filter((i) => i.productItemId !== productItemId),
            totalItems: get().totalItems - itemToRemove.quantity,
            totalAmount: get().totalAmount - itemToRemove.price * itemToRemove.quantity,
          });
        }
      },

      updateQuantity: (productItemId: number, quantity: number) => {
        const { items } = get();
        const item = items.find((i) => i.productItemId === productItemId);

        if (item) {
          const quantityDiff = quantity - item.quantity;

          set({
            items: items.map((i) => (i.productItemId === productItemId ? { ...i, quantity } : i)),
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
