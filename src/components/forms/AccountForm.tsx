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
            <FormItem>
              <FormLabel className="text-ink-secondary">Nombre de la cuenta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Nómina Banamex" {...field} className="bg-surface-2 border-border-subtle rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-surface-2 border-border-subtle rounded-lg">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-surface-1 border-border-strong">
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
              <FormItem>
                <FormLabel className="text-ink-secondary">Moneda</FormLabel>
                <FormControl>
                  <Input placeholder="MXN" {...field} className="bg-surface-2 border-border-subtle rounded-lg" />
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
            <FormItem>
              <FormLabel className="text-ink-secondary">Saldo Inicial</FormLabel>
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
                  className="bg-surface-2 border-border-subtle rounded-lg" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1 text-ink-secondary rounded-lg"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-growth hover:bg-growth/90 text-white rounded-lg shadow-md shadow-growth/10"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Guardar Cuenta'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
