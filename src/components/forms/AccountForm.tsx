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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useCreateAccount } from '@/hooks/useAccounts'
import { Loader2 } from 'lucide-react'

const accountSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.enum(['bank', 'cash', 'creditCard', 'other']),
  currency: z.string().min(3, 'Código de moneda inválido (ej: USD, MXN)'),
  initialBalance: z.number(),
  color: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountSchema>

export function AccountForm() {
  const router = useRouter()
  const { mutate: createAccount, isPending } = useCreateAccount()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'bank',
      currency: 'MXN',
      initialBalance: 0,
      color: 'bg-accent',
    },
  })

  function onSubmit(values: AccountFormValues) {
    createAccount(values, {
      onSuccess: () => {
        router.push('/accounts')
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold tracking-wide text-ink-secondary">Nombre de la cuenta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Nómina Banamex" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold tracking-wide text-ink-secondary">Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl bg-surface-2/40 backdrop-blur-sm border-border-subtle focus:ring-4 focus:ring-growth/10 focus:border-growth transition-all">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass-card border-border-strong min-w-[160px]">
                    <SelectItem value="bank">Banco</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="creditCard">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold tracking-wide text-ink-secondary">Moneda</FormLabel>
                <FormControl>
                  <Input placeholder="MXN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold tracking-wide text-ink-secondary">Saldo Inicial</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  inputMode="decimal"
                  step="any" 
                  {...field} 
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? 0 : parseFloat(val));
                  }}
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
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="growth"
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Guardar Cuenta'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
