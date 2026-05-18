import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        white: '#fafafa',
        'off-white': '#f5f3ef',
        'dark-grey': '#111111',
        'mid-grey': '#1a1a1a',
        'light-grey': '#e8e6e1',
        'text-muted': '#888888',
        accent: '#c8b89a',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Space Grotesk', 'Inter', 'Helvetica Now', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'IBM Plex Mono', 'Space Mono', 'Courier New', 'monospace'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(180px, 20vw, 320px)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(100px, 14vw, 220px)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(60px, 8vw, 140px)', { lineHeight: '0.88', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(48px, 6vw, 100px)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'touch-xl': ['clamp(100px, 16vw, 260px)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
        'hero-num': ['clamp(140px, 18vw, 280px)', { lineHeight: '1', letterSpacing: '-0.05em' }],
        'section-title': ['clamp(64px, 9vw, 160px)', { lineHeight: '0.88', letterSpacing: '-0.03em' }],
        'body-sm': ['13px', { lineHeight: '1.6', letterSpacing: '0.08em' }],
        'body-xs': ['11px', { lineHeight: '1.5', letterSpacing: '0.1em' }],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'wide-mono': '0.12em',
      },
      zIndex: {
        'loader': '9999',
        'grid': '9998',
        'nav': '9000',
        'above': '100',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'power2-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '1400': '1400ms',
      },
    },
  },
  plugins: [],
}

export default config
