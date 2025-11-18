import './styles.css'
import React from 'react'
import { AdminBar } from '@/components/Payload/AdminBar'
import { LivePreviewListener } from '@/components/Payload/LivePreviewListener'
import { Unna } from 'next/font/google'
import { LayoutFooter } from './_components/Footer'
import { LayoutHeader } from './_components/Header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

const _UnnaFont = Unna({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-unna',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>

      <body className={`min-h-screen bg-savoy-bg text-savoy-text flex flex-col font-main`}>
        <AdminBar />
        <LivePreviewListener />

        <div className="container mx-auto">
          <LayoutHeader />
          <main className="flex flex-1 py-8">{children}</main>
          <LayoutFooter />
        </div>
      </body>
    </html>
  )
}
