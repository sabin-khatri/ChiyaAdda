import { create } from 'zustand'
import { mockOrders } from '../data/mockData'

const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem('chiya_orders')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to parse orders', e)
  }
  // Seed with initial mock orders if empty or uninitialized
  try {
    localStorage.setItem('chiya_orders', JSON.stringify(mockOrders))
  } catch (e) {
    console.error('Failed to write seed orders', e)
  }
  return [...mockOrders]
}

const useOrdersStore = create((set) => ({
  orders: getStoredOrders(),
  addOrder: (order) => set((state) => {
    const updated = [order, ...state.orders]
    localStorage.setItem('chiya_orders', JSON.stringify(updated))
    return { orders: updated }
  }),
  updateOrderStatus: (id, newStatus) => set((state) => {
    const updated = state.orders.map((o) => 
      o.id === id ? { ...o, status: newStatus } : o
    )
    localStorage.setItem('chiya_orders', JSON.stringify(updated))
    return { orders: updated }
  }),
  syncOrders: () => set({ orders: getStoredOrders() })
}))

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'chiya_orders') {
      useOrdersStore.getState().syncOrders()
    }
  })
}

export default useOrdersStore
