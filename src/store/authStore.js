import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useAuthStore = create(persist((set) => ({
  isAuthenticated: false,
  user: null,
  login: (username, password) => {
    // TODO: Replace with secure production server auth endpoint check when backend API is live
    if (username === 'admin' && password === 'admin123') {
      set({ isAuthenticated: true, user: { username } })
      return true
    }
    return false
  },
  logout: () => {
    set({ isAuthenticated: false, user: null })
  }
}), {
  name: 'chiya_admin_session',
  storage: createJSONStorage(() => sessionStorage),
  partialize: ({ isAuthenticated, user }) => ({ isAuthenticated, user }),
}))

export default useAuthStore
