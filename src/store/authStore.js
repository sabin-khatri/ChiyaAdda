import { create } from 'zustand'

const useAuthStore = create((set) => ({
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
}))

export default useAuthStore
