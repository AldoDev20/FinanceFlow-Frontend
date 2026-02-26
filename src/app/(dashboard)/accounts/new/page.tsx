'use client'

import { AccountForm } from '@/components/forms/AccountForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewAccountPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href="/accounts" 
        className="flex items-center text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors w-fit"
      >
        <ChevronLeft size={16} className="mr-1" />
        Volver a cuentas
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Nueva Cuenta</h1>
        <p className="text-ink-secondary">Configura una nueva fuente de ingresos o gastos.</p>
      </div>

      <Card className="card-layer border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-ink-primary">Detalles de la Cuenta</CardTitle>
          <CardDescription className="text-ink-muted">
            Define el nombre, tipo de cuenta y su saldo inicial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm />
        </CardContent>
      </Card>
    </div>
  )
}
