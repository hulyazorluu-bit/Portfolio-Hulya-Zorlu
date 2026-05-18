'use client'

import { useEffect, useRef, useState } from 'react'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const DURATION = 1800

  useEffect(() => {
    startTimeRef.current = performance.now()

    function tick(now: number) {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / DURATION, 1)
      // Ease: power2
      const eased = 1 - Math.pow(1 - progress, 2)
      const val = Math.round(eased * 100)
      setCount(val)
      if (barRef.current) {
        barRef.current.style.width = `${eased * 100}%`
      }
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Fade out
        if (loaderRef.current) {
          loaderRef.current.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          loaderRef.current.style.opacity = '0'
        }
        setTimeout(() => {
          setVisible(false)
          onComplete()
        }, 750)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      ref={loaderRef}
      id="loader"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <span className="loader-counter">
        {String(count).padStart(3, ' ')}
      </span>
      <span className="loader-label">Loading</span>
      <div className="loader-bar-wrap">
        <div ref={barRef} className="loader-bar" />
      </div>
    </div>
  )
}
