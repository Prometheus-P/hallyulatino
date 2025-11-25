import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/layout/Providers'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'HallyuLatino',
    template: '%s | HallyuLatino',
  },
  description: '라틴 아메리카를 위한 AI 기반 한류 콘텐츠 플랫폼',
  keywords: ['K-Drama', 'K-Pop', 'K-Beauty', '한류', 'Latino', 'streaming'],
  authors: [{ name: 'HallyuLatino Team' }],
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://hallyulatino.com',
    siteName: 'HallyuLatino',
    title: 'HallyuLatino',
    description: '라틴 아메리카를 위한 AI 기반 한류 콘텐츠 플랫폼',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
