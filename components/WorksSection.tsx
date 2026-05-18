'use client'

import { useEffect } from 'react'
import { animateWorkCards, animateSectionTitle } from '@/lib/animations'

const PROJECTS = [
  {
    num: '01',
    title: 'Fractal Mirror',
    category: 'Interactive Installation',
    year: '2024',
    color: '#e8e4dc',
  },
  {
    num: '02',
    title: 'Liquid Type',
    category: 'Typography Experiment',
    year: '2023',
    color: '#d6d0c8',
  },
  {
    num: '03',
    title: 'Dark Matter',
    category: 'WebGL Experience',
    year: '2023',
    color: '#c8c2b8',
  },
  {
    num: '04',
    title: 'Grid System',
    category: 'Editorial Design',
    year: '2022',
    color: '#bdb7ad',
  },
]

export default function WorksSection() {
  useEffect(() => {
    animateSectionTitle('.works-title')
    animateWorkCards()
  }, [])

  return (
    <section
      id="works"
      className="works-section"
      style={{
        background: 'var(--color-off-white)',
        color: 'var(--color-black)',
        padding: 'clamp(80px, 10vw, 140px) 40px',
        position: 'relative',
      }}
    >
      {/* Section title */}
      <div style={{ marginBottom: 'clamp(48px, 7vw, 96px)', overflow: 'hidden' }}>
        <h2
          className="works-title"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(64px, 9vw, 160px)',
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            color: 'var(--color-black)',
          }}
        >
          Featured
          <br />
          Works
        </h2>
      </div>

      {/* Projects list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {PROJECTS.map((project, i) => (
          <div
            key={project.num}
            className="work-card"
            style={{
              borderTop: '1px solid rgba(10,10,10,0.12)',
              paddingTop: '32px',
              paddingBottom: '32px',
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              alignItems: 'start',
              gap: '24px',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget
              card.style.opacity = '0.75'
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget
              card.style.opacity = '1'
            }}
          >
            {/* Number */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'rgba(10,10,10,0.4)',
                paddingTop: '4px',
              }}
            >
              {project.num}
            </span>

            {/* Title + image */}
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(32px, 4.5vw, 72px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: 'var(--color-black)',
                  marginBottom: '20px',
                }}
              >
                {project.title}
              </h3>

              {/* Image placeholder */}
              <div
                className="project-image-wrap"
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  aspectRatio: '16/9',
                  background: project.color,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="project-image-placeholder"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'rgba(10,10,10,0.3)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')} / {PROJECTS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '6px',
                paddingTop: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(10,10,10,0.5)',
                }}
              >
                {project.category}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: 'rgba(10,10,10,0.35)',
                }}
              >
                {project.year}
              </span>
            </div>
          </div>
        ))}

        {/* Last border */}
        <div style={{ borderTop: '1px solid rgba(10,10,10,0.12)' }} />
      </div>
    </section>
  )
}
