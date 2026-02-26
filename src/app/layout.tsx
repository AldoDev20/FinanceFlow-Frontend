import type { Metadata, Viewport } from 'next'
import { Quantico, Bellefair, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'

const quantico = Quantico({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const bellefair = Bellefair({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'FinanceFlow',
  description: 'Tu rastro financiero, simplificado.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FinanceFlow',
  },
}

export const viewport: Viewport = {
  themeColor: '#FCFCFA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quantico.variable} ${bellefair.variable} ${ibmPlexMono.variable} font-body antialiased selection:bg-growth/20`}
      >
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay noise-bg" aria-hidden="true" />
        <GoogleOAuthProvider clientId={googleClientId}>
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-right" richColors closeButton />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
