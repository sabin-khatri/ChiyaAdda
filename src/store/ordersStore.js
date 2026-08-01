import { create } from 'zustand'
import { mockOrders } from '../data/mockData'

const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem('chiya_orders')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to parse orders', e)
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
