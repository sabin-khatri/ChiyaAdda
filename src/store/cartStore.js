import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],
  pickupMode: 'pickup', // 'pickup' or 'delivery'
  deliveryFee: 0,
  eta: '15-20 Mins',
  appliedPromo: '',
  discountRate: 0, // e.g. 0.15 for 15%

  applyPromoCode: (code) => {
    const formatted = code.toUpperCase().trim()
    if (formatted === 'CHIYA_LOVE') {
      set({ appliedPromo: 'CHIYA_LOVE', discountRate: 0.15 })
      return true
    } else if (formatted === '10_OFF') {
      set({ appliedPromo: '10_OFF', discountRate: 0.10 })
      return true
    } else if (formatted === 'FREE_MOMO') {
      // Treat as flat Rs. 250 discount (or we can represent flat rate discounts)
      set({ appliedPromo: 'FREE_MOMO', discountRate: 0.20 }) // 20% off
      return true
    }
    return false
  },

  setPickupMode: (mode) => set({
    pickupMode: mode,
    deliveryFee: mode === 'delivery' ? 120 : 0,
    eta: mode === 'delivery' ? '35-45 Mins' : '15-20 Mins'
  }),

  addItem: (item) => set((state) => {
    // Generate unique ID based on options
    let cartItemId = `${item.id}`;
    if (item.options) {
      const optionsString = Object.entries(item.options)
        .map(([k, v]) => `${k}:${v}`)
        .sort()
        .join('-');
      cartItemId = `${item.id}-${optionsString}`;
    }

    const existingItem = state.items.find((i) => i.cartItemId === cartItemId);
    if (existingItem) {
      return {
        items: state.items.map((i) => 
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...item, cartItemId, quantity: 1 }] };
  }),

  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter((i) => i.cartItemId !== cartItemId)
  })),

  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map((i) => 
      i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
    )
  })),

  clearCart: () => set({ items: [], pickupMode: 'pickup', deliveryFee: 0, eta: '15-20 Mins', appliedPromo: '', discountRate: 0 }),

  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}))

export default useCartStore;
