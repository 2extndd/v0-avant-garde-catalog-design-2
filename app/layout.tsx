import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import localFont from 'next/font/local'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Local Copperplate font family (OTF) mapped to CSS variable --font-copperplate
const copperplate = localFont({
  src: [
    { path: '../public/fonts/copperplate_light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/copperplate.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/copperplate_bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-copperplate',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Каталог',
  description: 'Онлайн каталог товаров',
  generator: 'extnddOS v.3',
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
    // Default to dark to match existing design; pages can switch to light by removing this class.
    <html lang="ru" className="dark">
      <body className={`font-sans antialiased ${copperplate.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
