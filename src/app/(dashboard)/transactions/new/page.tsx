'use client'

import { TransactionForm } from '@/components/forms/TransactionForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTransactionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href="/transactions" 
        className="flex items-center text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors w-fit"
      >
        <ChevronLeft size={16} className="mr-1" />
        Volver a movimientos
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Registrar Movimiento</h1>
        <p className="text-ink-secondary">Ingresa los detalles de tu nueva operación financiera.</p>
      </div>

      <Card className="card-layer border-none shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-ink-primary">Detalles de la Transacción</CardTitle>
          <CardDescription className="text-ink-muted">
            Los gastos reducen el balance, los ingresos lo aumentan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>
    </div>
  )
}
