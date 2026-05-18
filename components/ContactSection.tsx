'use client'

import { useEffect } from 'react'
import { animateContactReveal } from '@/lib/animations'

export default function ContactSection() {
  useEffect(() => {
    animateContactReveal()
  }, [])

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        background: 'var(--color-off-white)',
        color: 'var(--color-black)',
        padding: 'clamp(80px, 10vw, 140px) 40px clamp(60px, 8vw, 100px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Overflowing giant title */}
      <div
        style={{
          overflow: 'hidden',
          marginBottom: 'clamp(32px, 5vw, 56px)',
        }}
      >
        {['Get in', 'touch'].map((line) => (
          <div
            key={line}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="contact-title-line"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(80px, 14vw, 240px)',
                fontWeight: 800,
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                color: 'var(--color-black)',
                whiteSpace: 'nowrap',
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Email */}
      <div className="contact-sub">
        <a
          href="mailto:hulya@hulyazorlu.com"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(13px, 1.4vw, 18px)',
            letterSpacing: '0.06em',
            color: 'rgba(10,10,10,0.65)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(10,10,10,0.25)',
            paddingBottom: '2px',
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.target as HTMLElement
            el.style.color = 'var(--color-black)'
            el.style.borderColor = 'var(--color-black)'
          }}
          onMouseLeave={(e) => {
            const el = e.target as HTMLElement
            el.style.color = 'rgba(10,10,10,0.65)'
            el.style.borderColor = 'rgba(10,10,10,0.25)'
          }}
        >
          hulya@hulyazorlu.com
        </a>
      </div>
    </section>
  )
}
