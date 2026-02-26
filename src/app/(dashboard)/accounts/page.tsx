'use client'

import { Plus, Wallet } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AccountCard } from '@/components/cards/AccountCard'
import { useAccounts, useAccountSummary } from '@/hooks/useAccounts'
import { Skeleton } from '@/components/ui/skeleton'

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts()
  const { data: summary } = useAccountSummary()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Mis Cuentas</h1>
          <p className="text-ink-secondary mt-1">Gestiona tus bancos, efectivo y tarjetas de un solo vistazo.</p>
        </div>
        <Link href="/accounts/new">
          <Button className="bg-growth hover:bg-growth/90 text-white rounded-lg shadow-md shadow-growth/10">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cuenta
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-surface-2 animate-pulse" />
          ))
        ) : accounts?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-surface-1 rounded-2xl border border-dashed border-border-strong text-center">
            <div className="h-16 w-16 rounded-full bg-surface-2 flex items-center justify-center text-ink-muted mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-lg font-semibold text-ink-primary">No hay cuentas registradas</h3>
            <p className="text-sm text-ink-muted mt-1 max-w-xs">
              Agregue su primera cuenta bancaria o billetera para empezar a rastrear sus finanzas.
            </p>
            <Link href="/accounts/new" className="mt-6">
              <Button variant="outline" className="rounded-lg border-border-strong text-ink-primary">
                Añadir Primera Cuenta
              </Button>
            </Link>
          </div>
        ) : (
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))
        )}
      </div>

      {!isLoading && accounts && accounts.length > 0 && (
        <div className="mt-12 p-6 bg-surface-2 rounded-2xl border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-growth/10 text-growth flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-secondary">Balance Consolidado</p>
              <h2 className="text-3xl font-bold text-ink-primary">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(summary?.totalBalance || 0)}
              </h2>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-surface-1 rounded-lg border border-border-strong">
              <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Cuentas Activas</p>
              <p className="text-lg font-bold text-ink-primary">{accounts.length}</p>
            </div>
            {/* Additional stats could go here */}
          </div>
        </div>
      )}
    </motion.div>
  )
}
