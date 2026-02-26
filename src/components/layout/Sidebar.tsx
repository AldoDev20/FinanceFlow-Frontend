'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  Settings,
  X 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'

const navigation = [
  { name: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cuentas', href: '/accounts', icon: Wallet },
  { name: 'Transacciones', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Presupuestos', href: '/budgets', icon: PieChart },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen ? (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={onClose}
        />
      ) : null}

      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 border-r border-border-subtle bg-canvas px-4 py-8 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="mb-10 flex items-center justify-between px-2">
            <Link href="/dashboard" className="flex items-center gap-3 group/logo">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-primary text-canvas shadow-lg shadow-ink-primary/10 transition-transform duration-300 group-hover/logo:scale-105">
                <span className="font-display text-xl font-bold italic">F</span>
              </div>
              <span className="font-display text-2xl font-semibold tracking-tight text-ink-primary">
                Finance<span className="text-growth font-bold italic">Flow</span>
              </span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-ink-muted">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                    isActive 
                      ? "text-ink-primary font-semibold" 
                      : "text-ink-secondary hover:text-ink-primary"
                  )}
                >
                  {isActive ? (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-growth/10 rounded-xl -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    >
                      <motion.div 
                        className="absolute left-0 top-2 bottom-2 w-[3px] bg-growth rounded-full"
                        layoutId="activeStroke"
                      />
                    </motion.div>
                  ) : null}
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-300 z-10",
                    isActive ? "text-growth scale-110" : "text-ink-muted group-hover:text-ink-primary group-hover:scale-105"
                  )} />
                  <span className={cn(
                    "z-10 transition-colors duration-200",
                    isActive ? "font-semibold" : "group-hover:text-ink-primary"
                  )}>
                    {item.name}
                  </span>
                  {isActive ? (
                    <motion.div 
                      layoutId="activeDot"
                      className="ml-auto h-1 w-1 rounded-full bg-growth z-10" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <Link href="/settings" className="mt-auto border-t border-border-subtle pt-6 px-3 hover:bg-surface-2/50 transition-colors rounded-xl mb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-surface-3 flex items-center justify-center text-xs font-semibold text-ink-secondary italic shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-primary truncate max-w-[140px]">{user?.name || 'Usuario'}</span>
                <span className="text-[10px] text-growth font-bold uppercase tracking-wider">Plan Premium</span>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  )
}
