'use client'

import { motion } from 'framer-motion'
import { User, Shield, Bell, Globe, LogOut, ChevronRight, Moon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const sections = [
    {
      title: 'Cuenta',
      items: [
        { icon: User, label: 'Perfil', sublabel: 'Nombre, email y avatar', color: 'text-blue-500' },
        { icon: Shield, label: 'Seguridad', sublabel: 'Contraseña y autenticación', color: 'text-green-500' },
      ]
    },
    {
      title: 'Preferencias',
      items: [
        { icon: Moon, label: 'Apariencia', sublabel: 'Modo oscuro y tema', color: 'text-purple-500' },
        { icon: Bell, label: 'Notificaciones', sublabel: 'Alertas de gastos', color: 'text-orange-500' },
        { icon: Globe, label: 'Idioma', sublabel: 'Español (MX)', color: 'text-cyan-500' },
      ]
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Configuración</h1>
        <p className="text-ink-secondary mt-1">Administra tu perfil y preferencias de la aplicación.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Card */}
        <Card className="card-layer border-none overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-surface-3 flex items-center justify-center text-2xl font-bold text-ink-secondary italic shadow-inner">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-ink-primary">{user?.name || 'Usuario'}</h2>
                <p className="text-ink-muted">{user?.email || 'email@ejemplo.com'}</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-growth/10 text-growth text-xs font-bold rounded-full border border-growth/20">Plan Premium</span>
                  <span className="px-2 py-0.5 bg-surface-3 text-ink-muted text-xs font-medium rounded-full">Socio desde 2024</span>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex border-border-subtle text-ink-primary hover:bg-surface-2">
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-sm font-bold text-ink-muted uppercase tracking-widest pl-2">{section.title}</h3>
            <Card className="card-layer border-none divide-y divide-border-subtle/50">
              {section.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx}
                  className="w-full flex items-center justify-between p-4 hover:bg-surface-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-surface-3 ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-primary">{item.label}</p>
                      <p className="text-xs text-ink-muted">{item.sublabel}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-ink-muted" />
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          className="w-full py-6 bg-expense/5 text-expense hover:bg-expense hover:text-white border-2 border-expense/20 transition-all font-bold text-sm gap-2 rounded-2xl shadow-sm"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </motion.div>
  )
}
