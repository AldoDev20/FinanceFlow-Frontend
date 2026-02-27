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
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useCreateTransaction, useTransfer } from '@/hooks/useTransactions'
import { Loader2, Plus, Minus, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  accountId: z.string().min(1, 'Selecciona una cuenta'),
  toAccountId: z.string().optional(),
  category: z.string().min(2, 'La categoría es requerida'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
}).refine((data) => {
  if (data.type === 'transfer' && !data.toAccountId) return false
  return true
}, {
  message: "Selecciona una cuenta de destino para la transferencia",
  path: ["toAccountId"]
})

type TransactionFormValues = z.infer<typeof transactionSchema>

export function TransactionForm() {
  const router = useRouter()
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const { mutate: createTransaction, isPending: isCreating } = useCreateTransaction()
  const { mutate: transferFunds, isPending: isTransferring } = useTransfer()

  const isPending = isCreating || isTransferring

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      accountId: '',
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const type = form.watch('type')
  const filteredCategories = categories?.filter(c => c.type === (type === 'transfer' ? 'expense' : type))

  function onSubmit(values: TransactionFormValues) {
    if (values.type === 'transfer' && values.toAccountId) {
      transferFunds({
        accountId: values.accountId,
        toAccountId: values.toAccountId,
        amount: values.amount,
        category: values.category,
        description: values.description,
        date: values.date,
      }, {
        onSuccess: () => {
          router.push('/transactions')
        },
      })
    } else {
      createTransaction(values, {
        onSuccess: () => {
          router.push('/transactions')
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Type Selector Tabs */}
        <div className="flex p-1 bg-surface-2 rounded-xl mb-8">
          {[
            { id: 'expense', label: 'Gasto', icon: Minus, color: 'text-expense' },
            { id: 'income', label: 'Ingreso', icon: Plus, color: 'text-growth' },
            { id: 'transfer', label: 'Transferencia', icon: ArrowLeftRight, color: 'text-accent' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => form.setValue('type', item.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                type === item.id 
                  ? "bg-surface-1 shadow-sm text-ink-primary" 
                  : "text-ink-muted hover:text-ink-secondary"
              )}
            >
              <item.icon size={16} className={cn(type === item.id ? item.color : "")} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">
                  {type === 'transfer' ? 'Desde cuenta' : 'Cuenta'}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-surface-2 border-border-subtle rounded-xl min-h-[44px]">
                      <SelectValue placeholder="Selecciona cuenta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-surface-1 border-border-strong">
                    {accounts?.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} ({new Intl.NumberFormat('es-MX', { style: 'currency', currency: acc.currency }).format(acc.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === 'transfer' && (
            <FormField
              control={form.control}
              name="toAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-ink-secondary">Hacia cuenta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-surface-2 border-border-subtle rounded-xl min-h-[44px]">
                        <SelectValue placeholder="Cuenta destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-surface-1 border-border-strong">
                      {accounts?.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">Monto</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted font-medium">$</span>
                    <Input 
                      type="number" 
                      inputMode="decimal"
                      step="any" 
                      placeholder="0.00"
                      className="pl-7 bg-surface-2 border-border-subtle rounded-xl h-11"
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-surface-2 border-border-subtle rounded-xl min-h-[44px]">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-surface-1 border-border-strong">
                    {filteredCategories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-ink-secondary">Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-surface-2 border-border-subtle rounded-xl h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ink-secondary">Descripción (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="¿En qué consiste esta transacción?" {...field} className="bg-surface-2 border-border-subtle rounded-xl h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1 text-ink-secondary rounded-xl h-11"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className={cn(
              "flex-1 rounded-xl h-11 shadow-md transition-all",
              type === 'income' ? "bg-growth hover:bg-growth/90 text-white shadow-growth/10" :
              type === 'expense' ? "bg-expense hover:bg-expense/90 text-white shadow-expense/10" :
              "bg-surface-3 hover:bg-surface-2 text-ink-primary border border-border-strong shadow-sm"
            )}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Guardar Transacción'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
