import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const API_VERSION = 'v1'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:3001/api/${API_VERSION}`

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('API Client: No token found in store for request:', config.url)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log explicit properties to avoid empty object in overlay
    console.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}`)
    console.error(`Status: ${error.response?.status}`)
    console.error(`Message: ${error.message}`)
    console.error(`Data:`, error.response?.data)

    // Handle global errors (e.g., 401 logout)
    if (error.response?.status === 401) {
      console.error('Unauthorized access - potential logout')
    }
    return Promise.reject(error)
  }
)
