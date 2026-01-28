import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const copperplate = localFont({
  src: [
    {
      path: '../public/fonts/copperplate.woff2',
      weight: '400',
    }
  ],
  variable: '--font-copperplate',
  fallback: ['serif'],
});

export const metadata: Metadata = {
  title: 'extndd++shelter — Редкий Авангард',
  description: 'Эксклюзивный японский и европейский авангард. save my life, extndd#',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`font-sans antialiased ${copperplate.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
