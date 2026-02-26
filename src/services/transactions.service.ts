import { apiClient } from './api/client'

export interface Transaction {
  id: string
  accountId: string
  category: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  description?: string
  date: string
  toAccountId?: string // For transfers
  accountName?: string
}

export interface TransactionFilters {
  accountId?: string
  category?: string
  startDate?: string
  endDate?: string
  type?: 'income' | 'expense' | 'transfer'
  limit?: number
  offset?: number
}

export const transactionsService = {
  getAll: async (filters?: TransactionFilters) => {
    const response = await apiClient.get<{ success: boolean; data: Transaction[] }>('/transactions', {
      params: filters,
    })
    return response.data.data
  },

  create: async (data: Partial<Transaction>) => {
    const response = await apiClient.post<{ success: boolean; data: Transaction }>('/transactions', data)
    return response.data.data
  },

  transfer: async (data: { accountId: string; toAccountId: string; amount: number; category: string; description?: string; date: string }) => {
    const response = await apiClient.post<{ success: boolean; data: any }>('/transactions/transfer', data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/transactions/${id}`)
  },

  downloadPDF: async (filters?: TransactionFilters) => {
    const response = await apiClient.get('/transactions/export/pdf', {
      params: filters,
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.pdf')
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  downloadExcel: async (filters?: TransactionFilters) => {
    const response = await apiClient.get('/transactions/export/excel', {
      params: filters,
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}
