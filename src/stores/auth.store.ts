import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

const AUTH_COOKIE_NAME = 'auth-token'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_COOKIE_NAME, token)
          // Set cookie for Server Component visibility
          Cookies.set(AUTH_COOKIE_NAME, token, { 
            expires: 7, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
        }
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_COOKIE_NAME)
          Cookies.remove(AUTH_COOKIE_NAME)
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
