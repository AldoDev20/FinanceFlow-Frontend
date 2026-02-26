import * as React from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Transaction } from '@/services/transactions.service'
import { useDeleteTransaction } from '@/hooks/useTransactions'
import { TransactionItem } from './TransactionItem'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  const { mutate: deleteTransaction } = useDeleteTransaction()

  const handleDelete = React.useCallback((id: string) => {
    deleteTransaction(id)
  }, [deleteTransaction])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-surface-2" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-1 rounded-3xl border border-dashed border-border-strong px-6">
        <div className="h-20 w-20 rounded-full bg-surface-2 flex items-center justify-center text-ink-muted mb-6 shadow-inner">
          <ArrowLeftRight size={32} />
        </div>
        <p className="text-xl font-display font-medium text-ink-primary">No se encontraron movimientos</p>
        <p className="text-sm text-ink-muted mt-2 max-w-[280px]">Parece que no hay nada por aquí que coincida con tus filtros actuales.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionItem 
          key={transaction.id} 
          transaction={transaction} 
          onDelete={handleDelete} 
        />
      ))}
    </div>
  )
}
