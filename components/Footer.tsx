export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-black)',
        color: 'var(--color-white)',
        padding: '48px 40px',
        borderTop: '1px solid rgba(250,250,250,0.08)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Col 1 */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(250,250,250,0.5)',
            }}
          >
            Hülya Zorlu © 2024
          </p>
        </div>

        {/* Col 2 — social links */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {[
            { label: 'Awwwards', href: '#' },
            { label: 'Behance', href: '#' },
            { label: 'LinkedIn', href: '#' },
            { label: 'Instagram', href: '#' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(250,250,250,0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                width: 'fit-content',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-white)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(250,250,250,0.45)')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Col 3 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(250,250,250,0.5)',
            }}
          >
            Istanbul, Turkey
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(250,250,250,0.3)',
            }}
          >
            Available for projects
          </p>
        </div>
      </div>
    </footer>
  )
}
