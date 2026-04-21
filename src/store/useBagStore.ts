import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BagItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string; // Add weight e.g., "250g"
  image?: string;
}

interface BagStore {
  items: BagItem[];
  addItem: (product: any, selectedWeight: string, selectedPrice: number) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, quantity: number) => void;
  clearBag: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useBagStore = create<BagStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedWeight, selectedPrice) => {
        const currentItems = get().items;
        // Unique check based on ID AND weight
        const existingItem = currentItems.find(
          (item) => item.id === product.id && item.weight === selectedWeight
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id && item.weight === selectedWeight
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                price: Number(selectedPrice),
                quantity: 1,
                weight: selectedWeight,
                image: product.images?.[0], // Still keep if available, though we hide them
              },
            ],
          });
        }
      },
      removeItem: (id, weight) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.weight === weight)),
        });
      },
      updateQuantity: (id, weight, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, weight);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.weight === weight ? { ...item, quantity } : item
          ),
        });
      },
      clearBag: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "shopping-bag-storage",
    }
  )
);
