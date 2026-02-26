'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, MoreHorizontal, Trash2 } from 'lucide-react'
import { Transaction } from '@/services/transactions.service'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface TransactionItemProps {
  transaction: Transaction
  onDelete: (id: string) => void
}

export const TransactionItem = React.memo(function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  return (
    <div 
      className="group flex items-center justify-between p-4 bg-surface-1 rounded-xl border border-border-subtle hover:bg-surface-2 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          transaction.type === 'income' ? "bg-growth/10 text-growth" : 
          transaction.type === 'expense' ? "bg-expense/10 text-expense" : 
          "bg-accent/10 text-accent"
        )}>
          {transaction.type === 'income' ? <ArrowUpRight size={20} /> : 
           transaction.type === 'expense' ? <ArrowDownRight size={20} /> : 
           <ArrowLeftRight size={20} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-primary tracking-tight">{transaction.description || transaction.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-medium text-ink-secondary">{transaction.accountName || 'Cuenta'}</span>
            <span className="text-[10px] text-ink-faint">•</span>
            <span className="text-[11px] text-ink-muted">
              {format(new Date(transaction.date), "d 'de' MMM", { locale: es })}
            </span>
            <span className="text-[10px] text-ink-faint">•</span>
            <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-ink-faint bg-surface-2/50 px-1.5 py-0.5 rounded">
              {transaction.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-lg font-display font-medium tracking-tight whitespace-nowrap",
          transaction.type === 'income' ? "text-growth" : 
          transaction.type === 'expense' ? "text-expense" : 
          "text-ink-primary"
        )}>
          {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(transaction.amount)}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface-1 border-border-strong">
            <DropdownMenuItem 
              className="text-expense focus:bg-expense/5 cursor-pointer"
              onClick={() => onDelete(transaction.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
})
