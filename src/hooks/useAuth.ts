import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken)
      toast.success('¡Bienvenido de nuevo!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      'Error al iniciar sesión. Revisa tus credenciales.'
      toast.error(message)
    }
  })
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken)
      toast.success('Cuenta creada exitosamente')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      'Error al crear la cuenta. Inténtalo de nuevo.'
      toast.error(message)
    }
  })
}

export function useGoogleLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken)
      toast.success('Sesión iniciada con Google')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      console.error('Google Auth Backend Error:', error)
      const message = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      'Error al autenticar con Google.'
      toast.error(message)
    }
  })
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout()
      toast.info('Sesión cerrada')
      router.push('/login')
    },
  })
}
