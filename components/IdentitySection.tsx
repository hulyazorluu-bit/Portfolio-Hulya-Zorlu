'use client'

import { useEffect } from 'react'
import { animateSplitChars, fadeInUp } from '@/lib/animations'

export default function IdentitySection() {
  useEffect(() => {
    animateSplitChars('.identity-name', { start: 'top 75%' })
    fadeInUp('.identity-grid-item', { stagger: 0.1, start: 'top 70%', duration: 0.8 })
  }, [])

  return (
    <section
      id="about"
      className="identity-section"
      style={{
        background: 'var(--color-off-white)',
        color: 'var(--color-black)',
        padding: 'clamp(80px, 10vw, 140px) 40px clamp(80px, 10vw, 140px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Giant name */}
      <div style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}>
        <h1
          className="identity-name"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(80px, 12vw, 200px)',
            fontWeight: 800,
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            color: 'var(--color-black)',
            textAlign: 'left',
          }}
        >
          Hülya
          <br />
          Zorlu
        </h1>
      </div>

      {/* Thin rule */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: 'rgba(10,10,10,0.15)',
          marginBottom: 'clamp(40px, 5vw, 64px)',
        }}
      />

      {/* 3-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          maxWidth: '900px',
        }}
      >
        {[
          { label: 'Role', value: 'Interactive Designer' },
          { label: 'Based in', value: 'Istanbul, Turkey' },
          { label: 'Since', value: '2015' },
        ].map(({ label, value }) => (
          <div key={label} className="identity-grid-item">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'rgba(10,10,10,0.45)',
                marginBottom: '8px',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.05em',
                color: 'var(--color-black)',
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
