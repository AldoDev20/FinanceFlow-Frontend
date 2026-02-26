'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userStr = searchParams.get('user')

    console.log('Auth Callback Params:', { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken, 
      hasUser: !!userStr 
    })

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        setAuth(user, accessToken)
        toast.success('¡Sesión iniciada con Google!')
        router.push('/dashboard')
      } catch (error) {
        console.error('Error parsing user data:', error)
        toast.error('Error al procesar los datos de usuario')
        router.push('/login')
      }
    } else {
      // Si no hay params, el backend podría estar mostrando JSON directamente
      // o hubo un error en la redirección
      console.error('Missing auth parameters in URL')
      // No redirigimos inmediatamente para que el usuario pueda ver si el backend 
      // escupió un JSON en la pantalla
    }
  }, [searchParams, setAuth, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-growth mx-auto" />
        <p className="text-ink-secondary font-medium">Finalizando autenticación...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-12 w-12 animate-spin text-growth" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
