'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types/database'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantite: (id: string, quantite: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  totalItems: () => number
}

type PersistedCartState = Pick<CartStore, 'items'>

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.product_id === item.product_id && i.variante === item.variante
        )
        if (existing) {
          const newQty = Math.min(existing.quantite + item.quantite, item.stock)
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id ? { ...i, quantite: newQty } : i
            ),
          }))
        } else {
          set((state) => ({ items: [...state.items, item] }))
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantite: (id, quantite) => {
        if (quantite <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantite: Math.min(quantite, i.stock) } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () => get().items.reduce((sum, item) => sum + item.prix * item.quantite, 0),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantite, 0),
    }),
    {
      name: 'derbii-cart',
      partialize: (state): PersistedCartState => ({ items: state.items }),
      merge: (persistedState, currentState): CartStore => {
        const persisted = persistedState as Partial<PersistedCartState> | undefined

        return {
          ...currentState,
          items: Array.isArray(persisted?.items) ? persisted.items : currentState.items,
          isOpen: false,
        }
      },
    }
  )
)