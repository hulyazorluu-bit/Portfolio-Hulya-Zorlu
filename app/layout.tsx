import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hülya Zorlu — Interactive Designer',
  description: 'Interactive Designer & Creative Developer based in Istanbul. Portfolio of experimental web design, interactive installations, and editorial work.',
  keywords: ['interactive designer', 'creative developer', 'portfolio', 'web design', 'Istanbul'],
  authors: [{ name: 'Hülya Zorlu' }],
  openGraph: {
    title: 'Hülya Zorlu — Interactive Designer',
    description: 'Interactive Designer & Creative Developer based in Istanbul.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hülya Zorlu — Interactive Designer',
    description: 'Interactive Designer & Creative Developer based in Istanbul.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
