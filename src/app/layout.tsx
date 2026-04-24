import React from 'react'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IndiGram API | India\'s Complete Geographical Data SaaS',
  description: 'The most comprehensive REST API for India\'s states, districts, sub-districts, and villages. Designed for B2B excellence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
