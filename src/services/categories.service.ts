import { apiClient } from './api/client'

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
  is_global: boolean
}

export const categoriesService = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: Category[] }>('/categories')
    return response.data.data
  },
  
  create: async (data: Partial<Category>) => {
    const response = await apiClient.post<{ success: boolean; data: Category }>('/categories', data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/categories/${id}`)
  }
}
