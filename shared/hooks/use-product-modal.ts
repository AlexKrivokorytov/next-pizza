import { create } from 'zustand';

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  items: Array<{
    id: number;
    price: number;
    size?: number;
    type?: string;
  }>;
  ingredients?: Array<{
    id: number;
    name: string;
  }>;
};

interface ProductModalStore {
  isOpen: boolean;
  product: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

/**
 * Zustand store for managing the product modal state and selected product.
 *
 * @returns Modal open state, selected product, and modal control handlers.
 */
export const useProductModal = create<ProductModalStore>((set) => ({
  isOpen: false,
  product: null,
  openModal: (product) => set({ isOpen: true, product }),
  closeModal: () => set({ isOpen: false }),
}));
