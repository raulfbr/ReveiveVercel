import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Revive',
  description: 'MVP de teste para gestao de voluntarios com Vercel e Supabase.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

