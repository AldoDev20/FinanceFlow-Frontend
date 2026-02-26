'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRegister } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { mutate: register, isPending } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-md card-layer p-4 shadow-xl border-none">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-growth flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-growth/20">
            FF
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-ink-primary">Crea tu cuenta</CardTitle>
          <CardDescription className="text-ink-secondary">
            Empieza a gestionar tus finanzas de forma inteligente hoy mismo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink-secondary" htmlFor="name">
                Nombre completo
              </label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-surface-2 border-border-subtle focus:border-growth focus:ring-growth/20 transition-all rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink-secondary" htmlFor="email">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-surface-2 border-border-subtle focus:border-growth focus:ring-growth/20 transition-all rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink-secondary" htmlFor="password">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-surface-2 border-border-subtle focus:border-growth focus:ring-growth/20 transition-all rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink-secondary" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="bg-surface-2 border-border-subtle focus:border-growth focus:ring-growth/20 transition-all rounded-lg"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-growth hover:bg-growth/90 text-white font-semibold h-11 rounded-lg transition-all shadow-md shadow-growth/10 mt-2"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear Cuenta'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-ink-muted">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="text-growth hover:underline font-semibold">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
