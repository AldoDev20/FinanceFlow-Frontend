'use client'

import { motion } from 'framer-motion'
import { Plus, Target, Trophy, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useGoals, useUpdateGoal } from '@/hooks/useGoals'

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals()
  const { mutate: updateGoal } = useUpdateGoal()

  const handleContribute = (goalId: string, currentAmount: number, targetAmount: number) => {
    const contribution = prompt('¿Cuánto deseas aportar a esta meta?')
    if (contribution) {
      const amount = parseFloat(contribution)
      if (!isNaN(amount) && amount > 0) {
        updateGoal({
          id: goalId,
          data: { current_amount: Math.min(currentAmount + amount, targetAmount) }
        })
      }
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Metas de Ahorro</h1>
          <p className="text-ink-secondary mt-1">Visualiza y alcanza tus objetivos financieros.</p>
        </div>
        <Button className="bg-growth hover:bg-growth/90 text-white gap-2">
          <Plus size={18} />
          Nueva Meta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals && goals.length > 0 ? (
          goals.map((goal, index) => {
            const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
            const isCompleted = percentage >= 100

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-layer border-none overflow-hidden hover:shadow-md transition-all relative">
                  {isCompleted && (
                    <div className="absolute top-2 right-2">
                      <Trophy className="text-yellow-500 h-6 w-6 animate-bounce" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-ink-primary">
                      {goal.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1">
                      <div className="flex justify-between items-end">
                        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Progreso</p>
                        <span className="text-2xl font-bold text-ink-primary">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-3 bg-surface-3"
                        indicatorClassName="bg-growth"
                      />
                    </div>

                    <div className="flex justify-between py-2 border-y border-border-subtle/50">
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-ink-muted uppercase font-bold">Ahorrado</p>
                        <p className="text-sm font-bold text-growth">${goal.current_amount.toLocaleString()}</p>
                      </div>
                      <div className="w-px bg-border-subtle/50 mx-2" />
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-ink-muted uppercase font-bold">Objetivo</p>
                        <p className="text-sm font-bold text-ink-primary">${goal.target_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-surface-3 text-ink-primary hover:bg-surface-2 text-xs h-8">
                        Detalles
                      </Button>
                      <Button 
                        className="flex-1 bg-growth/10 text-growth hover:bg-growth/20 border-none text-xs h-8 font-bold"
                        onClick={() => handleContribute(goal.id, goal.current_amount, goal.target_amount)}
                      >
                        Aportar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center space-y-4 bg-surface-2 rounded-2xl border-2 border-dashed border-border-subtle">
            <div className="h-16 w-16 bg-surface-3 rounded-full flex items-center justify-center mx-auto">
              <Target className="text-ink-muted h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-ink-primary">Sin metas establecidas</h3>
              <p className="text-ink-muted max-w-xs mx-auto">Define tu primer objetivo de ahorro para empezar a construir tu futuro.</p>
            </div>
            <Button className="bg-growth hover:bg-growth/90 text-white">
              Crear mi primera meta
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
