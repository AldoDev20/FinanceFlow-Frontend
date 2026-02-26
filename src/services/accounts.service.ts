import { apiClient } from './api/client'

export interface Account {
  id: string
  name: string
  type: 'bank' | 'cash' | 'creditCard' | 'other'
  balance: number
  currency: string
  icon?: string
  color?: string
}

export const accountsService = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: Account[] }>('/accounts')
    return response.data.data
  },
  
  getSummary: async () => {
    const response = await apiClient.get<{ success: boolean; data: any }>('/accounts/summary')
    return response.data.data
  },

  create: async (data: Partial<Account>) => {
    const response = await apiClient.post<{ success: boolean; data: Account }>('/accounts', data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/accounts/${id}`)
  }
}
