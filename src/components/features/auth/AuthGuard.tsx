'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // With Middleware handling redirects, this is a secondary safety net
    // and handles the case where the user logs out on another tab.
    if (!isAuthenticated) {
      const hasToken = typeof document !== 'undefined' && document.cookie.includes('auth-token')
      if (!hasToken) {
        setIsChecking(false) // Middleware will handle the actual redirect
        router.push('/login')
      }
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, router])

  if (isChecking && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-growth" />
      </div>
    )
  }

  return <>{children}</>
}
