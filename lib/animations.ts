/**
 * Centralised GSAP animation helpers.
 * All functions are async — they dynamically import GSAP so they work
 * safely in SSR/Next.js environments (never executed on the server).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type ScrollTriggerVars = {
  trigger?: Element | string
  start?: string
  end?: string
  scrub?: boolean | number
  toggleActions?: string
  markers?: boolean
}

// ─── Hero entrance ────────────────────────────────────────────────────────────

export async function animateHeroEntrance(delay = 0.2) {
  const { gsap } = await import('gsap')

  const tl = gsap.timeline({ delay })

  const heroNumber = document.querySelector('.hero-number')
  const heroLabels = document.querySelectorAll('.hero-label')
  const heroScroll = document.querySelector('.hero-scroll')

  if (heroNumber) {
    tl.from(heroNumber, {
      opacity: 0,
      y: 60,
      duration: 1.4,
      ease: 'power2.out',
    })
  }

  if (heroLabels.length) {
    tl.from(
      heroLabels,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      },
      '-=0.8'
    )
  }

  if (heroScroll) {
    tl.from(
      heroScroll,
      { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
  }

  return tl
}

// ─── SplitType char / word reveal ────────────────────────────────────────────

export async function animateSplitChars(
  selector: string,
  stConfig: ScrollTriggerVars = {}
) {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const SplitType = (await import('split-type')).default

  const elements = document.querySelectorAll<HTMLElement>(selector)
  if (!elements.length) return

  elements.forEach((el) => {
    const split = new SplitType(el, { types: 'chars,words' })

    if (!split.chars) return

    gsap.set(split.chars, { overflow: 'hidden' })

    gsap.from(split.chars, {
      y: '110%',
      opacity: 0,
      duration: 0.9,
      stagger: 0.022,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: stConfig.start || 'top 78%',
        toggleActions: stConfig.toggleActions || 'play none none none',
        ...stConfig,
      },
    })
  })
}

// ─── SplitType word (lines) reveal ────────────────────────────────────────────

export async function animateSplitWords(
  selector: string,
  stConfig: ScrollTriggerVars = {}
) {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const SplitType = (await import('split-type')).default

  const elements = document.querySelectorAll<HTMLElement>(selector)
  if (!elements.length) return

  elements.forEach((el) => {
    const split = new SplitType(el, { types: 'lines,words' })

    if (!split.words) return

    gsap.from(split.words, {
      y: '100%',
      opacity: 0,
      duration: 1.1,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: stConfig.start || 'top 72%',
        toggleActions: stConfig.toggleActions || 'play none none none',
        ...stConfig,
      },
    })
  })
}

// ─── Works cards stagger fadeInUp ────────────────────────────────────────────

export async function animateWorkCards() {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const cards = document.querySelectorAll('.work-card')
  if (!cards.length) return

  gsap.from(cards, {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.works-section',
      start: 'top 65%',
      toggleActions: 'play none none none',
    },
  })
}

// ─── Dark section text lines reveal ─────────────────────────────────────────

export async function animateDarkTextLines() {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const lines = document.querySelectorAll('.dark-text-line')
  if (!lines.length) return

  gsap.from(lines, {
    y: '100%',
    opacity: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.dark-section',
      start: 'top 65%',
      toggleActions: 'play none none none',
    },
  })
}

// ─── Contact / CTA mask reveal ───────────────────────────────────────────────

export async function animateContactReveal() {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const lines = document.querySelectorAll('.contact-title-line')
  if (!lines.length) return

  gsap.from(lines, {
    x: '-8%',
    opacity: 0,
    duration: 1.2,
    stagger: 0.14,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })

  const contactSub = document.querySelector('.contact-sub')
  if (contactSub) {
    gsap.from(contactSub, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 58%',
        toggleActions: 'play none none none',
      },
    })
  }
}

// ─── Fade in up generic ───────────────────────────────────────────────────────

export async function fadeInUp(
  selector: string,
  options: { delay?: number; duration?: number; stagger?: number; start?: string } = {}
) {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const els = document.querySelectorAll(selector)
  if (!els.length) return

  gsap.from(els, {
    y: 50,
    opacity: 0,
    duration: options.duration ?? 0.9,
    delay: options.delay ?? 0,
    stagger: options.stagger ?? 0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: els[0],
      start: options.start || 'top 78%',
      toggleActions: 'play none none none',
    },
  })
}

// ─── Section title reveal ─────────────────────────────────────────────────────

export async function animateSectionTitle(selector: string) {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const SplitType = (await import('split-type')).default

  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return

  const split = new SplitType(el, { types: 'lines' })

  if (!split.lines) return

  split.lines.forEach((line) => {
    const wrap = document.createElement('div')
    wrap.style.overflow = 'hidden'
    wrap.style.display = 'block'
    line.parentNode?.insertBefore(wrap, line)
    wrap.appendChild(line)
  })

  gsap.from(split.lines, {
    y: '102%',
    duration: 1,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 72%',
      toggleActions: 'play none none none',
    },
  })
}
