'use client'

import Link from 'next/link'
import { Bell, Menu, Search, User, Settings } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      inputRef.current?.blur()
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center border-b border-white/5 bg-canvas/60 backdrop-blur-xl px-4 lg:left-[84px] lg:px-8 transition-all">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-ink-muted" 
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <form 
            onSubmit={handleSearch}
            className="hidden items-center gap-2 rounded-xl bg-surface-2/30 px-4 py-2 text-xs text-ink-muted lg:flex border border-border-subtle focus-within:bg-surface-2/50 focus-within:border-growth/30 focus-within:ring-4 focus-within:ring-growth/5 transition-all overflow-hidden shadow-inner backdrop-blur-sm"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar rastro financiero..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-44 focus:w-64 transition-all text-ink-primary placeholder:text-ink-faint font-medium"
            />
            <kbd className="hidden md:inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-1/50 px-2 font-display font-medium text-ink-muted text-[10px] h-6 shadow-sm">
              <span className="text-[12px] leading-none">⌘</span>K
            </kbd>
          </form>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <Button variant="ghost" size="icon" className="relative text-ink-muted interactive-hover rounded-2xl">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-expense opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-expense shadow-[0_0_8px_rgba(158,74,74,0.3)]"></span>
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-2xl ring-offset-canvas transition-all hover:ring-2 hover:ring-border-strong focus-visible:outline-none p-0 overflow-hidden shadow-sm">
                <Avatar className="h-10 w-10 rounded-none">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="bg-surface-3 text-ink-secondary text-xs rounded-none font-display">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-surface-1 border-border-strong shadow-lg" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-ink-primary">{user?.name || 'Usuario'}</p>
                  <p className="text-xs leading-none text-ink-muted">{user?.email || 'usuario@ejemplo.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border-subtle" />
              <Link href="/settings">
                <DropdownMenuItem className="focus:bg-surface-2 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="focus:bg-surface-2 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-border-subtle" />
              <DropdownMenuItem 
                className="focus:bg-surface-2 text-expense cursor-pointer"
                onClick={logout}
              >
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
