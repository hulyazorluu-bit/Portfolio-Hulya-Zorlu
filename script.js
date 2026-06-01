/* =================================================================
   HULYA ZORLU — PORTFOLIO
   Animations extracted & adapted from Eva Sanchez (evasanchez.info)
   GSAP + ScrollTrigger + Lenis + custom char-split reveal system
================================================================= */
'use strict';

/* ── GSAP + ScrollTrigger ─────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── LENIS SMOOTH SCROLL ──────────────────────────────────────── */
const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
  syncTouch: false,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── UTILS ────────────────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }

/* ── CHAR SPLIT ───────────────────────────────────────────────── */
/* Wraps every character in .char > .n spans for the slide-up anim.
   Only processes elements whose children are text nodes, .iO sentinels,
   <br>s, or class-less inline spans.  Complex structural children
   (scroll_bar, p, ul, etc.) are detected and the element is skipped
   so layout is not broken. */
function charsFromText(text, dest) {
  for (const ch of text) {
    if (ch === '\n') continue;
    const wrap = document.createElement('span');
    wrap.className = 'char';
    const inner = document.createElement('span');
    inner.className = 'n';
    inner.textContent = ch;
    wrap.appendChild(inner);
    dest.appendChild(wrap);
  }
}

function splitChars(el) {
  const kids = Array.from(el.childNodes);

  // Check every child is safe to process
  const isSafe = kids.every(n => {
    if (n.nodeType === Node.TEXT_NODE) return true;
    if (n.nodeType !== Node.ELEMENT_NODE) return true;
    if (n.classList.contains('iO')) return true;
    if (n.tagName === 'BR') return true;
    // allow class-less inline elements
    const tag = n.tagName;
    if ((tag === 'SPAN' || tag === 'EM' || tag === 'STRONG') && !n.className) return true;
    return false;
  });
  if (!isSafe) return;  // skip complex elements

  // Re-build element with char wrappers
  while (el.lastChild) el.removeChild(el.lastChild);

  kids.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('iO')) {
      el.appendChild(node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      el.appendChild(node.cloneNode());
    } else if (node.nodeType === Node.TEXT_NODE) {
      charsFromText(node.textContent, el);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // class-less inline element — split its text
      charsFromText(node.textContent, el);
    }
  });
}

function initSplit() {
  document.querySelectorAll('.Awrite, .Atext').forEach(el => splitChars(el));
}

/* ── REVEAL — char slide-up ───────────────────────────────────── */
/* Each .Awrite/.Atext element starts with an .iO sentinel child.
   The sentinel sits at top:150% (outside the overflow:hidden parent),
   so IntersectionObserver fires just before the element is visible. */
function initReveal() {
  const STAGGER  = 0.045;
  const DURATION = 0.7;
  const EASE_V   = 'power2.out';

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);

      const parent = e.target.closest('.Awrite, .Atext');
      if (!parent) return;

      const chars = parent.querySelectorAll('.char .n');
      if (chars.length) {
        gsap.to(chars, {
          y: '0%',
          duration: DURATION,
          ease: EASE_V,
          stagger: parent.dataset.w ? STAGGER : STAGGER * 0.7,
          clearProps: 'transform',
        });
      } else {
        // Fallback: element wasn't char-split (complex children) — do block reveal
        gsap.to(parent, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_V,
          clearProps: 'transform,opacity',
        });
      }
    });
  }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });

  // Also handle .Atext elements that couldn't be split — hide them first
  document.querySelectorAll('.Atext').forEach(el => {
    if (!el.querySelector('.char')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    }
  });

  document.querySelectorAll('.iO').forEach(s => io.observe(s));
}

/* ── REVEAL — title slide-up (.Atitle) ───────────────────────── */
function initTitleReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);

      gsap.to(e.target.querySelectorAll('.tt1'), {
        y: '0%',
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'transform',
      });
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });

  document.querySelectorAll('.Atitle').forEach(el => io.observe(el));
}

/* ── LOADER ───────────────────────────────────────────────────── */
function initLoader(onDone) {
  const loader = document.getElementById('loader');
  const tp     = document.getElementById('loader_tp');
  if (!loader) { onDone(); return; }

  document.body.style.overflow = 'hidden';

  // Name reveal via CSS class
  setTimeout(() => loader.classList.add('animating'), 100);

  // Counter 0 → 100
  const obj = { val: 0 };
  const tl = gsap.timeline({
    onComplete() {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
        delay: 0.2,
        onComplete() {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          onDone();
        },
      });
    },
  });

  tl.to(obj, {
    val: 100,
    duration: 2.0,
    ease: 'power1.inOut',
    onUpdate() {
      if (tp) tp.textContent = Math.round(obj.val);
    },
  }, 0);
}

/* ── CURSOR (mouse follower) ──────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const mouse = document.getElementById('mouse');
  if (!mouse) return;

  const ring = mouse.querySelector('.mouse_ring');
  const dot  = mouse.querySelector('.mouse_el');

  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let rx = tx, ry = ty;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    mouse.classList.add('show');
    // dot follows instantly
    if (dot) dot.style.transform = `translate(calc(${tx}px - 50%), calc(${ty}px - 50%))`;
  });
  document.addEventListener('mouseleave', () => mouse.classList.remove('show'));
  document.addEventListener('mousedown',  () => mouse.classList.add('click'));
  document.addEventListener('mouseup',    () => mouse.classList.remove('click'));

  // "View" state on work items
  document.querySelectorAll('.work_item, .work_lnk').forEach(el => {
    el.addEventListener('mouseenter', () => mouse.classList.add('view'));
    el.addEventListener('mouseleave', () => mouse.classList.remove('view'));
  });

  // Hover state on all links + buttons
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => mouse.classList.add('hover'));
    el.addEventListener('mouseleave', () => mouse.classList.remove('hover'));
  });

  // Ring follows with lerp
  (function loop() {
    rx = lerp(rx, tx, 0.12);
    ry = lerp(ry, ty, 0.12);
    if (ring) ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(loop);
  })();
}

/* ── LIVE CLOCK (Paris) ───────────────────────────────────────── */
function initClock() {
  const hEl = document.getElementById('clock_h');
  const mEl = document.getElementById('clock_m');
  const aEl = document.getElementById('clock_a');
  if (!hEl) return;

  function tick() {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' })
    );
    let h = now.getHours();
    const m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    if (aEl) aEl.textContent = ampm;
  }

  tick();
  setInterval(tick, 60_000);
}

/* ── NAV SCROLL + BURGER ──────────────────────────────────────── */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mmenu  = document.getElementById('mob_menu');
  if (!nav) return;

  // Blur on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Burger toggle
  if (burger && mmenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mmenu.classList.toggle('open', open);
      mmenu.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mmenu.querySelectorAll('.mob_lnk').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mmenu.classList.remove('open');
        mmenu.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const sections = document.querySelectorAll('section[data-section], footer[data-section]');
  const links    = document.querySelectorAll('.nav_lnk[data-s]');
  if (sections.length && links.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.toggle('on', l.dataset.s === e.target.dataset.section));
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach(s => sio.observe(s));
  }
}

/* ── NAV COLOR INVERSION (dark section) ──────────────────────── */
function initColorInversion() {
  const nav   = document.getElementById('nav');
  const sDark = document.querySelector('.s-dark');
  if (!nav || !sDark) return;

  ScrollTrigger.create({
    trigger: sDark,
    start: 'top 80px',
    end: 'bottom 80px',
    onEnter:     () => nav.classList.add('inv'),
    onLeave:     () => nav.classList.remove('inv'),
    onEnterBack: () => nav.classList.add('inv'),
    onLeaveBack: () => nav.classList.remove('inv'),
  });
}

/* ── WORK HOVER PREVIEW ───────────────────────────────────────── */
function initWorkHover() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const wp     = document.getElementById('work_preview');
  const items  = document.querySelectorAll('.work_item[data-pi]');
  const frames = document.querySelectorAll('.wp_frame');
  if (!wp || !items.length) return;

  let mx = 0, my = 0, px = 0, py = 0, raf = null;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function loop() {
    px = lerp(px, mx, 0.09);
    py = lerp(py, my, 0.09);
    wp.style.transform = `translate(${px + 24}px, ${py - wp.offsetHeight * 0.5}px)`;
    raf = requestAnimationFrame(loop);
  }

  items.forEach(item => {
    const pi = item.dataset.pi;
    item.addEventListener('mouseenter', () => {
      wp.classList.add('show');
      frames.forEach(f => f.classList.toggle('on', f.classList.contains('wp_frame--' + pi)));
      if (!raf) loop();
    });
    item.addEventListener('mouseleave', () => {
      wp.classList.remove('show');
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    });
  });
}

/* ── NUMBER COUNTERS ──────────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = parseInt(e.target.dataset.count, 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate() { e.target.textContent = Math.round(obj.val); },
        onComplete() { e.target.textContent = target; },
      });
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
}

/* ── SMOOTH SCROLL (anchor links) ────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    });
  });
}

/* ── MARQUEE — pause on hover ─────────────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.mq_track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ── SCROLL PROGRESS (fill bar in hero) ──────────────────────── */
function initScrollFill() {
  const fill = document.querySelector('.scroll_fill');
  if (!fill) return;
  // Let the CSS keyframe handle it; no JS override needed
}

/* ── HERO PARALLAX (subtle y shift) ──────────────────────────── */
function initHeroParallax() {
  const intro = document.querySelector('.s-intro_inner');
  if (!intro) return;

  gsap.to(intro, {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: document.querySelector('.s-intro'),
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ── FOOTER TITLE ─────────────────────────────────────────────── */
function initFooterReveal() {
  const ft = document.querySelector('.footer_cm .tt1');
  if (!ft) return;

  gsap.from(ft, {
    y: '105%',
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: ft,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── INIT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Char-split first — must happen before any reveal observers
  initSplit();

  // Immediate setup
  initCursor();
  initNav();
  initClock();
  initSmoothScroll();
  initMarquee();
  initScrollFill();

  // Loader then reveal everything after
  initLoader(() => {
    // Reveal nav elements (logo, clock, links)
    document.getElementById('nav')?.classList.add('ready');

    ScrollTrigger.refresh();

    initReveal();
    initTitleReveal();
    initColorInversion();
    initWorkHover();
    initCounters();
    initHeroParallax();
    initFooterReveal();
  });
});
