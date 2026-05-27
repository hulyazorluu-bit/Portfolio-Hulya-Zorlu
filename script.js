/* ============================================================
   HULYA ZORLU — PORTFOLIO
   Vanilla JavaScript — No frameworks, no dependencies
   ============================================================ */

'use strict';

/* ── GRAIN / NOISE CANVAS ─────────────────────────────────── */
function initGrain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrain() {
    const { width, height } = canvas;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(drawGrain);
  }

  resize();
  window.addEventListener('resize', resize);
  drawGrain();
}

/* ── CUSTOM CURSOR ────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  }

  function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', onMove);
  requestAnimationFrame(tick);

  const hoverEls = document.querySelectorAll(
    'a, button, .skill-card, .project-media, .nav-burger, [tabindex="0"]'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-active'));
}

/* ── LOADING SCREEN ───────────────────────────────────────── */
function initLoader() {
  const loader  = document.getElementById('loader');
  const letters = document.getElementById('loader-name');
  const role    = document.getElementById('loader-role');
  const bar     = document.getElementById('loader-bar');
  const pct     = document.getElementById('loader-percent');
  if (!loader) return;

  let progress = 0;

  function animateProgress() {
    const target  = 100;
    const step    = () => {
      progress += Math.random() * 6 + 2;
      if (progress >= target) progress = target;
      bar.style.width = progress + '%';
      pct.textContent = Math.round(progress) + '%';
      if (progress < target) {
        setTimeout(step, 55);
      } else {
        finish();
      }
    };
    step();
  }

  function finish() {
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.style.overflow = '';
      setTimeout(() => { loader.style.display = 'none'; }, 1000);
    }, 300);
  }

  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    letters.classList.add('animate');
    letters.querySelectorAll('span').forEach((s, i) => {
      s.style.transitionDelay = (i * 50) + 'ms';
    });
  }, 100);

  setTimeout(() => { role.classList.add('animate'); }, 700);
  setTimeout(() => { animateProgress(); }, 600);
}

/* ── NAVIGATION ───────────────────────────────────────────── */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!nav) return;

  /* Scrolled state */
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu toggle */
  if (burger && mobileNav) {
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');

    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', false);
        mobileNav.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link on scroll */
  const sections  = document.querySelectorAll('section[data-section]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('data-section');
      navLinks.forEach(l => {
        l.classList.toggle('is-active', l.getAttribute('data-section') === id);
      });
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = el.getAttribute('data-delay') || 0;
      setTimeout(() => { el.classList.add('is-visible'); }, parseInt(delay));
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

  revealEls.forEach(el => observer.observe(el));
}

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── PARALLAX HERO ────────────────────────────────────────── */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight * 1.5) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

/* ── NUMBER COUNTER ───────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.hero-stat-n[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.getAttribute('data-count'));
      let current = 0;
      const step  = Math.ceil(end / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = current;
      }, 50);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── MAGNETIC BUTTONS ─────────────────────────────────────── */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    const STRENGTH = 0.35;

    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * STRENGTH;
      const dy     = (e.clientY - cy) * STRENGTH;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = 'translate(0,0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

/* ── KINETIC HERO TEXT (subtle scale on mouse) ────────────── */
function initHeroKinetic() {
  const titleBlock = document.querySelector('.hero-title-block');
  if (!titleBlock) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;
    titleBlock.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    titleBlock.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    titleBlock.style.transform  = 'translate(0,0)';
    setTimeout(() => { titleBlock.style.transition = ''; }, 800);
  });
}

/* ── PROJECT IMAGE TILT ───────────────────────────────────── */
function initProjectTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.project-media').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      el.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.6s ease';
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      setTimeout(() => { el.style.transition = ''; }, 600);
    });
  });
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initGrain();
  initCursor();
  initLoader();
  initNav();
  initReveal();
  initSmoothScroll();
  initParallax();
  initCounters();
  initMagnetic();
  initHeroKinetic();
  initProjectTilt();
});
