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
      className="group flex items-center justify-between p-4 bg-surface-1/40 backdrop-blur-md rounded-2xl border border-border-subtle hover:bg-surface-2/60 hover:border-growth/20 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-11 w-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner",
          transaction.type === 'income' ? "bg-growth/20 text-growth" : 
          transaction.type === 'expense' ? "bg-expense/20 text-expense" : 
          "bg-accent/20 text-accent"
        )}>
          {transaction.type === 'income' ? <ArrowUpRight size={22} /> : 
           transaction.type === 'expense' ? <ArrowDownRight size={22} /> : 
           <ArrowLeftRight size={22} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-primary tracking-tight group-hover:translate-x-0.5 transition-transform">{transaction.description || transaction.category}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-bold text-ink-secondary/70 uppercase tracking-wider">{transaction.accountName || 'Cuenta'}</span>
            <span className="text-[10px] text-ink-faint">•</span>
            <span className="text-[11px] text-ink-muted">
              {format(new Date(transaction.date), "d 'de' MMM", { locale: es })}
            </span>
            <span className="text-[10px] text-ink-faint">•</span>
            <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-ink-muted bg-surface-3/50 px-2 py-0.5 rounded-full border border-border-subtle">
              {transaction.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={cn(
          "text-xl font-display font-medium tracking-tight whitespace-nowrap",
          transaction.type === 'income' ? "text-growth" : 
          transaction.type === 'expense' ? "text-expense" : 
          "text-ink-primary"
        )}>
          {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(transaction.amount)}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border-border-strong min-w-[140px]">
            <DropdownMenuItem 
              className="text-expense focus:bg-expense/10 focus:text-expense cursor-pointer font-medium"
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
