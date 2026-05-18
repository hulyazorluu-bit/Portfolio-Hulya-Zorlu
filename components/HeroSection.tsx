'use client'

import { useEffect } from 'react'
import { animateHeroEntrance } from '@/lib/animations'

interface HeroSectionProps {
  ready: boolean
}

export default function HeroSection({ ready }: HeroSectionProps) {
  useEffect(() => {
    if (!ready) return
    animateHeroEntrance(0.2)
  }, [ready])

  return (
    <section
      className="section-full bg-cinematic"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* SVG grain filter for hero */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <filter id="hero-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Grain overlay specific to hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Central large number */}
      <div
        className="hero-number"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(140px, 18vw, 280px)',
          fontWeight: 900,
          color: 'var(--color-white)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          userSelect: 'none',
        }}
      >
        2024
      </div>

      {/* Bottom left label */}
      <div
        className="hero-label"
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'rgba(250,250,250,0.55)',
        }}
      >
        Interactive Designer — Istanbul
      </div>

      {/* Bottom right scroll indicator */}
      <div
        className="hero-label hero-scroll"
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'rgba(250,250,250,0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '24px',
            height: '1px',
            background: 'rgba(250,250,250,0.4)',
          }}
        />
        Scroll
      </div>
    </section>
  )
}
