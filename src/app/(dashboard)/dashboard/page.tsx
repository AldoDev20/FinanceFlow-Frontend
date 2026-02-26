'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, CreditCard, Banknote, PieChart, Loader2, ArrowLeftRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccountSummary } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

// Dynamic imports for heavy charts
const FinancialAreaChart = dynamic(
  () => import('@/components/features/charts/FinancialAreaChart').then(mod => mod.FinancialAreaChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full bg-surface-2 animate-pulse rounded-xl" /> }
)

const CategoryPieChart = dynamic(
  () => import('@/components/features/charts/CategoryPieChart').then(mod => mod.CategoryPieChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full bg-surface-2 animate-pulse rounded-xl" /> }
)

export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useAccountSummary()
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactions()

  const isLoading = isLoadingSummary || isLoadingTransactions

  // Current month totals
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)

  const currentMonthTransactions = transactions 
    ? transactions.filter(t => {
        const date = parseISO(t.date)
        return isWithinInterval(date, { start: startOfCurrentMonth, end: endOfCurrentMonth })
      }) 
    : []

  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const monthlyExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  // Evolution data (Last 6 months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const monthDate = subMonths(now, 5 - i)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    
    const monthTransactions = transactions?.filter(t => {
      const date = parseISO(t.date)
      return isWithinInterval(date, { start: monthStart, end: monthEnd })
    }) || []

    return {
      name: format(monthDate, 'MMM', { locale: es }).replace('.', ''),
      ingresos: monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
      gastos: monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    }
  })

  // Category data (Current month expenses)
  const categoryTotals = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  const metrics = [
    { 
      title: 'Saldo Total', 
      amount: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(summary?.totalBalance || 0), 
      change: '+0.0%', 
      trend: 'up', 
      icon: Wallet,
      color: 'text-ink-primary'
    },
    { 
      title: 'Ingresos Mensuales', 
      amount: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monthlyIncome),
      change: '+0.0%', 
      trend: 'up', 
      icon: ArrowUpRight,
      color: 'text-growth'
    },
    { 
      title: 'Gastos Mensuales', 
      amount: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monthlyExpense),
      change: '+0.0%', 
      trend: 'down', 
      icon: ArrowDownRight,
      color: 'text-expense'
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-growth" />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="relative">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-growth/5 blur-[120px] rounded-full pointer-events-none" />
        <h1 className="text-4xl font-display font-medium tracking-tight text-ink-primary">Dashboard</h1>
        <p className="text-ink-secondary mt-2 max-w-prose leading-relaxed">Bienvenido de nuevo, aquí está tu resumen financiero.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={item.title === 'Saldo Total' ? '/accounts' : '/transactions'}>
              <Card className="card-layer overflow-hidden border-none transition-all cursor-pointer group hover:bg-surface-2/30">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-muted group-hover:text-ink-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner",
                    item.title === 'Saldo Total' ? "bg-surface-3 text-ink-primary" : 
                    item.title === 'Ingresos Mensuales' ? "bg-growth/10 text-growth" : "bg-expense/10 text-expense"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-display font-medium text-ink-primary tracking-tight">{item.amount}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                      item.trend === 'up' ? "bg-growth/10 text-growth" : "bg-expense/10 text-expense"
                    )}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3 rotate-180" />
                      )}
                      <span>{item.change}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-ink-faint">
                      vs prev
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-layer border-none h-full overflow-hidden">
            <CardHeader className="border-b border-border-subtle bg-surface-2/30">
              <CardTitle className="text-sm uppercase tracking-[0.2em] font-bold text-ink-muted leading-none">Evolución Financiera</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FinancialAreaChart data={last6Months} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-layer border-none h-full overflow-hidden">
            <CardHeader className="border-b border-border-subtle bg-surface-2/30">
              <CardTitle className="text-sm uppercase tracking-[0.2em] font-bold text-ink-muted">Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CategoryPieChart data={pieData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
