'use client'

import { motion } from 'framer-motion'
import { Plus, PiggyBank, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useBudgets } from '@/hooks/useBudgets'

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useBudgets()

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
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Presupuestos</h1>
          <p className="text-ink-secondary mt-1">Controla tus límites de gasto por categoría.</p>
        </div>
        <Button className="bg-growth hover:bg-growth/90 text-white gap-2">
          <Plus size={18} />
          Nuevo Presupuesto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets && budgets.length > 0 ? (
          budgets.map((budget, index) => {
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100)
            const isOver = budget.spent > budget.amount

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-layer border-none overflow-hidden hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-ink-primary">
                        {budget.category?.name || 'Categoría'}
                      </CardTitle>
                      {isOver && <AlertCircle className="text-expense h-5 w-5" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Consumido</p>
                        <p className="text-xl font-bold text-ink-primary">
                          ${budget.spent.toLocaleString()} / <span className="text-ink-secondary text-sm font-normal">${budget.amount.toLocaleString()}</span>
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isOver ? 'bg-expense/10 text-expense' : 'bg-growth/10 text-growth'}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    <Progress 
                      value={percentage} 
                      className="h-2 bg-surface-3"
                      indicatorClassName={isOver ? 'bg-expense' : 'bg-growth'}
                    />
                    
                    <p className="text-xs text-ink-muted italic">
                      {isOver 
                        ? `Te has excedido por $${(budget.spent - budget.amount).toLocaleString()}` 
                        : `Te quedan $${(budget.amount - budget.spent).toLocaleString()} para este mes`}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center space-y-4 bg-surface-2 rounded-2xl border-2 border-dashed border-border-subtle">
            <div className="h-16 w-16 bg-surface-3 rounded-full flex items-center justify-center mx-auto">
              <PiggyBank className="text-ink-muted h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-ink-primary">Sin presupuestos activos</h3>
              <p className="text-ink-muted max-w-xs mx-auto">Empieza a controlar tus gastos creando tu primer presupuesto por categoría.</p>
            </div>
            <Button variant="outline" className="border-growth text-growth hover:bg-growth/10">
              Configurar primer límite
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
