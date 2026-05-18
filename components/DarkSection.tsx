'use client'

import { useEffect } from 'react'
import { animateDarkTextLines, fadeInUp } from '@/lib/animations'

export default function DarkSection() {
  useEffect(() => {
    animateDarkTextLines()
    fadeInUp('.dark-sub', { start: 'top 55%', duration: 0.9 })
  }, [])

  return (
    <section
      className="dark-section section-full bg-cinematic"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(80px, 10vw, 140px) 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Giant white text */}
      <div
        style={{
          overflow: 'hidden',
          marginBottom: 'clamp(48px, 7vw, 96px)',
        }}
      >
        {['Interactive Designer,', 'also Speaker', '& Teacher'].map((line) => (
          <div
            key={line}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="dark-text-line"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(48px, 7vw, 128px)',
                fontWeight: 800,
                color: 'var(--color-white)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                display: 'block',
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Horizontal rule */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: 'rgba(250,250,250,0.2)',
          marginBottom: 'clamp(32px, 4vw, 56px)',
        }}
      />

      {/* Two columns below */}
      <div
        className="dark-sub"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          maxWidth: '900px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: 'rgba(250,250,250,0.6)',
            lineHeight: 1.6,
            letterSpacing: '0.02em',
          }}
        >
          Hülya Zorlu — Interactive Designer based in Istanbul, working globally.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'flex-end',
          }}
        >
          {[
            ['12+', 'Years of experience'],
            ['40+', 'Projects shipped'],
            ['8', 'Awards'],
          ].map(([num, label]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '22px',
                  color: 'var(--color-white)',
                  letterSpacing: '-0.02em',
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(250,250,250,0.4)',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
