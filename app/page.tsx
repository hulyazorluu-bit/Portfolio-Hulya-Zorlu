'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

import GridOverlay from '@/components/GridOverlay'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import IdentitySection from '@/components/IdentitySection'
import WorksSection from '@/components/WorksSection'
import DarkSection from '@/components/DarkSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

// Dynamically import Loader to avoid SSR issues with requestAnimationFrame
const Loader = dynamic(() => import('@/components/Loader'), { ssr: false })

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true)
    // Initialise Lenis + GSAP after loader
    import('@/hooks/useLenis').then(() => {})
  }, [])

  return (
    <>
      {/* Fixed overlays */}
      <GridOverlay />

      {/* Loader — always rendered first */}
      {mounted && !loaderDone && (
        <Loader onComplete={handleLoaderComplete} />
      )}

      {/* Main content — hidden until loader done */}
      <main
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: loaderDone ? 'auto' : 'none',
        }}
      >
        <Header />
        <HeroSection ready={loaderDone} />
        <IdentitySection />
        <WorksSection />
        <DarkSection />
        <ContactSection />
        <Footer />
      </main>

      {/* Lenis + GSAP bootstrap — only when content is visible */}
      {loaderDone && <GSAPLenisInit />}
    </>
  )
}

// Isolated component that boots Lenis + GSAP on mount
function GSAPLenisInit() {
  useEffect(() => {
    async function boot() {
      // Init GSAP + ScrollTrigger
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      ;(window as unknown as Record<string, unknown>).gsap = gsap

      // Init Lenis
      const LenisMod = await import('@studio-freight/lenis')
      const Lenis = LenisMod.default

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      } as ConstructorParameters<typeof Lenis>[0])

      // Sync Lenis with GSAP ticker
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0, 0)

      // Update ScrollTrigger on scroll
      lenis.on('scroll', ScrollTrigger.update)

      // Refresh on resize
      let resizeTimer: ReturnType<typeof setTimeout>
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
      })
    }

    boot()
  }, [])

  return null
}
