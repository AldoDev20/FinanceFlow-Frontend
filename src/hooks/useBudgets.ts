import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetsService } from '@/services/budgets.service'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: budgetsService.getAll,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgetsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => budgetsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
