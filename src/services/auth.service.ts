import { apiClient } from './api/client'

export interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      avatarUrl?: string
    }
    tokens: {
      accessToken: string
      refreshToken: string
    }
  }
}

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data.data
  },
  
  register: async (data: any) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data.data
  },

  googleLogin: async (idToken: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { idToken })
    return response.data.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
  }
}
