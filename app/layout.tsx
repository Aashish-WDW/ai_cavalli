import type { Metadata } from 'next'
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Ai Cavalli Hotel',
  description: 'Experience the Italian countryside.',
}

import { AuthProvider } from '@/lib/auth/context'
import { CartProvider } from '@/lib/context/CartContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          <CartProvider>
            <div className="texture-overlay" />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
