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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            <Link href={item.title === 'Saldo Total' ? '/accounts' : '/transactions'}>
              <Card className="card-layer group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-transform">
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-growth/5 blur-2xl group-hover:bg-growth/10 transition-colors rounded-full" />
                
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink-muted group-hover:text-ink-primary transition-colors">
                    {item.title}
                  </span>
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg",
                    item.title === 'Saldo Total' ? "bg-surface-3 text-ink-primary" : 
                    item.title === 'Ingresos Mensuales' ? "bg-growth text-white" : "bg-expense text-white"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-display font-medium text-ink-primary tracking-tight group-hover:translate-x-1 transition-transform inline-block">
                    {item.amount}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm",
                      item.trend === 'up' ? "bg-growth/15 text-growth" : "bg-expense/15 text-expense"
                    )}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3 rotate-180" />
                      )}
                      <span>{item.change}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-ink-faint">
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="card-layer h-full border-none">
            <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
              <CardTitle className="text-xs uppercase tracking-[0.25em] font-bold text-ink-muted leading-none">Evolución Financiera</CardTitle>
              <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-growth" /> Ingresos</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-expense" /> Gastos</div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FinancialAreaChart data={last6Months} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="card-layer h-full border-none">
            <CardHeader className="pt-6 px-6">
              <CardTitle className="text-xs uppercase tracking-[0.25em] font-bold text-ink-muted">Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CategoryPieChart data={pieData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
