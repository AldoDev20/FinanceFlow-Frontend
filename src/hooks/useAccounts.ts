import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsService } from '@/services/accounts.service'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountsService.getAll,
  })
}

export function useAccountSummary() {
  return useQuery({
    queryKey: ['accounts-summary'],
    queryFn: accountsService.getSummary,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: accountsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts-summary'] })
    },
  })
}
