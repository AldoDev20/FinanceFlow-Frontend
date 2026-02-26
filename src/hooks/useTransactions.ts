import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsService, TransactionFilters } from '@/services/transactions.service'

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsService.getAll(filters),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: transactionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts-summary'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: transactionsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts-summary'] })
    },
  })
}
export function useTransfer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: transactionsService.transfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts-summary'] })
    },
  })
}

export function useDownloadPDF() {
  return useMutation({
    mutationFn: (filters?: TransactionFilters) => transactionsService.downloadPDF(filters),
  })
}

export function useDownloadExcel() {
  return useMutation({
    mutationFn: (filters?: TransactionFilters) => transactionsService.downloadExcel(filters),
  })
}
