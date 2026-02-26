import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService, Category } from '@/services/categories.service'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
