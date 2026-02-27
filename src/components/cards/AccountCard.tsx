'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Banknote, Building2, CreditCard, Wallet, MoreVertical } from 'lucide-react'
import { Account } from '@/services/accounts.service'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const iconMap = {
  bank: Building2,
  cash: Wallet,
  creditCard: CreditCard,
  other: Banknote,
}

export function AccountCard({ account }: { account: Account }) {
  const Icon = iconMap[account.type] || Banknote

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-card group cursor-pointer active:scale-[0.98] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg",
            account.color || "bg-accent"
          )}>
            <Icon size={22} className="group-hover:scale-110 transition-transform" />
          </div>
          <button className="text-ink-muted hover:text-ink-primary opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-white/10 rounded-lg">
            <MoreVertical size={16} />
          </button>
        </div>
        
        <div className="mt-5">
          <p className="text-sm font-medium text-ink-secondary tracking-tight">{account.name}</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-3xl font-display font-medium tracking-tight text-ink-primary">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: account.currency }).format(account.balance)}
            </h3>
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-[0.1em] bg-surface-2 px-1.5 py-0.5 rounded">
              {account.type}
            </span>
          </div>
        </div>
        
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-ink-faint">
            <span>Uso de cuenta</span>
            <span>100%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-3/30 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'circOut' }}
              className="h-full bg-gradient-to-r from-growth to-growth/60 shadow-[0_0_8px_rgba(58,138,112,0.4)]" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
