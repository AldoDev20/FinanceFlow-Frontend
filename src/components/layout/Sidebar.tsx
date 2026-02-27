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
        "fixed left-0 top-0 z-50 h-full w-[280px] lg:w-[84px] border-r border-border-subtle bg-canvas py-8 transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1) lg:translate-x-0 flex flex-col items-center",
        isOpen ? "translate-x-0 shadow-2xl shadow-black/20" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col w-full items-center">
          {/* Logo Section */}
          <div className="mb-10 flex items-center justify-center">
            <Link href="/dashboard" className="group/logo relative">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink-primary text-canvas shadow-lg shadow-ink-primary/10 transition-transform duration-300 group-hover/logo:scale-105">
                <span className="font-display text-xl font-bold italic">F</span>
              </div>
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 space-y-4 w-full px-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "group relative flex items-center lg:flex-col lg:justify-center gap-4 lg:gap-1.5 rounded-xl px-4 lg:px-0 py-3.5 lg:py-3 transition-all duration-300",
                    isActive 
                      ? "text-growth bg-growth/8" 
                      : "text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
                  )}
                >
                  <div className="relative shrink-0">
                    <item.icon className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    {isActive ? (
                      <motion.div 
                        layoutId="activeSideIndicator"
                        className="absolute -left-6 lg:-left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 lg:h-4 bg-growth rounded-full shadow-[0_0_8px_rgba(58,138,112,0.4)]" 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    ) : null}
                  </div>
                  
                  {/* Name: visible on mobile, hover/active on desktop */}
                  <span className={cn(
                    "text-sm lg:text-[10px] font-medium transition-all duration-300",
                    isActive 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-1 lg:group-hover:translate-y-0"
                  )}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Profile Section */}
          <div className="mt-auto pt-6 px-2 w-full border-t border-border-subtle">
            <Link 
              href="/settings" 
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="group/profile flex items-center lg:flex-col lg:justify-center gap-4 lg:gap-1.5 p-4 lg:py-3 hover:bg-surface-2 rounded-xl transition-all"
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-surface-3 flex items-center justify-center text-sm font-semibold text-ink-secondary italic shadow-inner ring-2 ring-transparent group-hover/profile:ring-border-subtle transition-all overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex flex-col lg:items-center">
                <span className="text-sm lg:text-[10px] font-bold text-ink-primary">
                  {user?.name || 'Usuario'}
                </span>
                <span className="text-xs lg:hidden text-ink-muted">
                  Ver perfil
                </span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
