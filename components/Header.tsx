'use client'

import { useEffect, useRef } from 'react'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    function onScroll() {
      if (window.scrollY > 60) {
        header?.classList.add('nav-scrolled')
      } else {
        header?.classList.remove('nav-scrolled')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      ref={headerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: 'var(--nav-height)',
        background: 'transparent',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--color-white)',
        }}
      >
        HZ
      </div>

      {/* Nav links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {['Works', 'About', 'Contact'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-white)',
              opacity: 0.7,
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '1')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '0.7')}
          >
            {link}
          </a>
        ))}

        {/* CTA button */}
        <a
          href="#contact"
          className="btn-cta"
        >
          Available
        </a>
      </nav>
    </header>
  )
}
