import { apiClient } from './api/client'

export interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
  is_active: boolean
}

export const goalsService = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: Goal[] }>('/goals')
    return response.data.data
  },

  create: async (data: Partial<Goal>) => {
    const response = await apiClient.post<{ success: boolean; data: Goal }>('/goals', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Goal>) => {
    const response = await apiClient.patch<{ success: boolean; data: Goal }>(`/goals/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/goals/${id}`)
  }
}
