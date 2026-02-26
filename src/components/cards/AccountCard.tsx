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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-layer overflow-hidden border-none transition-all cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg",
            account.color || "bg-accent"
          )}>
            <Icon size={24} />
          </div>
          <button className="text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-surface-2 rounded">
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
        
        <div className="mt-6 h-1 w-full bg-surface-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-growth transition-all duration-500" 
            style={{ width: '100%' }} // Simple indicator
          />
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
