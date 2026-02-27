'use client'

import { GoalForm } from '@/components/forms/GoalForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NewGoalPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link 
          href="/goals" 
          className="flex items-center text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors w-fit group"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a metas
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Nueva Meta de Ahorro</h1>
        <p className="text-ink-secondary">Define tus sueños y empieza el camino para alcanzarlos.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-none shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <div className="h-32 w-32 rounded-full bg-growth blur-3xl" />
          </div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl font-bold text-ink-primary">Configuración de la Meta</CardTitle>
            <CardDescription className="text-ink-muted">
              Define el nombre y el monto objetivo para tu nuevo reto.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <GoalForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
