import './styles.css'
import React from 'react'
import { LayoutFooter } from '@/components/LayoutComponents/Footer'
import { LayoutHeader } from '@/components/LayoutComponents/Header'
import { AdminBar } from '@/components/Payload/AdminBar'
import { LivePreviewListener } from '@/components/Payload/LivePreviewListener'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>

      <body className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
        <AdminBar />
        <LivePreviewListener />

        <LayoutHeader />
        <main className="flex flex-1 py-16">{children}</main>
        <LayoutFooter />
      </body>
    </html>
  )
}
