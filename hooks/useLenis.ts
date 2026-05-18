'use client'

import { useEffect, useRef } from 'react'

type LenisInstance = {
  raf: (time: number) => void
  destroy: () => void
  on: (event: string, callback: (e: { progress: number; velocity: number }) => void) => void
  stop: () => void
  start: () => void
}

let lenisInstance: LenisInstance | null = null

export function useLenis() {
  const lenisRef = useRef<LenisInstance | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let Lenis: new (options: {
      duration: number
      easing: (t: number) => number
      smoothWheel: boolean
      wheelMultiplier: number
      touchMultiplier: number
      infinite: boolean
    }) => LenisInstance

    async function initLenis() {
      try {
        const mod = await import('@studio-freight/lenis')
        Lenis = mod.default

        const lenis = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        })

        lenisRef.current = lenis
        lenisInstance = lenis

        // Sync with GSAP ticker if available
        if (typeof window !== 'undefined' && (window as unknown as { gsap?: { ticker?: { add: (fn: (time: number) => void) => void; lagSmoothing: (a: number, b: number) => void } } }).gsap?.ticker) {
          const gsap = (window as unknown as { gsap: { ticker: { add: (fn: (time: number) => void) => void; lagSmoothing: (a: number, b: number) => void } } }).gsap
          gsap.ticker.add((time: number) => {
            lenis.raf(time * 1000)
          })
          gsap.ticker.lagSmoothing(0, 0)
        } else {
          function raf(time: number) {
            lenis.raf(time)
            rafRef.current = requestAnimationFrame(raf)
          }
          rafRef.current = requestAnimationFrame(raf)
        }
      } catch (err) {
        console.warn('Lenis could not be initialised:', err)
      }
    }

    initLenis()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lenisRef.current?.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisRef
}

export function getLenis() {
  return lenisInstance
}
