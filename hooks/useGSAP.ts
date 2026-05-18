'use client'

import { useEffect, useRef } from 'react'

type GSAPInstance = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerPlugin: (...plugins: any[]) => void
  ticker: {
    add: (fn: (time: number) => void) => void
    lagSmoothing: (a: number, b: number) => void
  }
}

let gsapReady = false
let gsapCallbacks: Array<() => void> = []

export function useGSAPInit() {
  useEffect(() => {
    if (gsapReady) return

    async function init() {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        const { TextPlugin } = await import('gsap/TextPlugin')

        gsap.registerPlugin(ScrollTrigger, TextPlugin)

        // Expose gsap on window for Lenis sync
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as unknown as Record<string, any>).gsap = gsap

        // Refresh ScrollTrigger on resize
        let resizeTimer: ReturnType<typeof setTimeout>
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer)
          resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
        })

        gsapReady = true
        gsapCallbacks.forEach((cb) => cb())
        gsapCallbacks = []
      } catch (err) {
        console.warn('GSAP init failed:', err)
      }
    }

    init()
  }, [])
}

export function useGSAP(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (ctx: any, ScrollTrigger: any) => (() => void) | void,
  deps: unknown[] = []
) {
  const cleanupRef = useRef<(() => void) | void>(undefined)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      if (cancelled) return

      const ctx = gsap.context(() => {})
      cleanupRef.current = callback(ctx, ScrollTrigger)
    }

    run()

    return () => {
      cancelled = true
      if (cleanupRef.current && typeof cleanupRef.current === 'function') {
        cleanupRef.current()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
