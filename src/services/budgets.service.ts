import { apiClient } from './api/client'

export interface Budget {
  id: string
  category_id: string
  amount: number
  spent: number
  is_active: boolean
  category?: {
    name: string
    color: string
    icon: string
  }
}

export const budgetsService = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: Budget[] }>('/budgets')
    return response.data.data
  },

  create: async (data: Partial<Budget>) => {
    const response = await apiClient.post<{ success: boolean; data: Budget }>('/budgets', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Budget>) => {
    const response = await apiClient.patch<{ success: boolean; data: Budget }>(`/budgets/${id}`, data)
    return response.data.data
  }
}
