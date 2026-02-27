'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { useCreateGoal } from '@/hooks/useGoals'
import { Loader2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const goalSchema = z.object({
  name: z.string().min(2, 'El nombre de la meta es requerido'),
  target_amount: z.number().positive('El monto objetivo debe ser mayor a 0'),
  current_amount: z.number().min(0, 'El monto actual no puede ser negativo'),
  deadline: z.string().optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

export function GoalForm() {
  const router = useRouter()
  const { mutate: createGoal, isPending } = useCreateGoal()

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      name: '',
      target_amount: 0,
      current_amount: 0,
      deadline: '',
    },
  })

  function onSubmit(values: GoalFormValues) {
    createGoal(values, {
      onSuccess: () => {
        router.push('/goals')
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-growth/5 rounded-2xl border border-growth/10 mb-6">
          <div className="h-10 w-10 bg-growth/10 rounded-xl flex items-center justify-center">
            <Target className="text-growth h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink-primary">Define tu objetivo</p>
            <p className="text-xs text-ink-secondary">Visualiza lo que quieres lograr y cuánto necesitas.</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ink-secondary">Nombre de la Meta</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: Viaje a Japón, Auto nuevo, Fondo de emergencia" 
                  {...field} 
                  className="bg-surface-2/40 backdrop-blur-sm border-border-subtle rounded-xl h-11 focus:border-growth/30 focus:ring-4 focus:ring-growth/5 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">Monto Objetivo</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted font-medium transition-colors group-focus-within:text-growth">$</span>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      className="pl-7 bg-surface-2/40 backdrop-blur-sm border-border-subtle rounded-xl h-11 focus:border-growth/30 focus:ring-4 focus:ring-growth/5 transition-all"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : parseFloat(val));
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">Monto Inicial (Opcional)</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted font-medium transition-colors group-focus-within:text-growth">$</span>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      className="pl-7 bg-surface-2/40 backdrop-blur-sm border-border-subtle rounded-xl h-11 focus:border-growth/30 focus:ring-4 focus:ring-growth/5 transition-all"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : parseFloat(val));
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ink-secondary">Fecha Objetivo (Opcional)</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className="bg-surface-2/40 backdrop-blur-sm border-border-subtle rounded-xl h-11 focus:border-growth/30 focus:ring-4 focus:ring-growth/5 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1 text-ink-secondary hover:bg-surface-2 rounded-xl h-11 transition-all"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-growth hover:bg-growth/90 text-white rounded-xl h-11 shadow-lg shadow-growth/10 transition-all font-bold"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Crear Meta'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
