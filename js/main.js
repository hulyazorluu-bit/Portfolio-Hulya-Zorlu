/* ============================================================
   Hulya Zorlu Portfolio — main.js  2026
   ============================================================ */

(function () {
  'use strict';

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initReveal();
    }, 2200);
  });

  /* ── Custom Cursor + Trail ── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  const TRAIL_COUNT = 7;
  const trail = Array.from({ length: TRAIL_COUNT }, (_, i) => {
    const d = document.createElement('div');
    d.className = 'cursor-trail';
    const size = Math.max(2, 9 - i);
    d.style.width   = size + 'px';
    d.style.height  = size + 'px';
    d.style.opacity = String(Math.max(0.03, 0.5 - i * 0.07));
    document.body.appendChild(d);
    return { el: d, x: 0, y: 0 };
  });

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    }
  });

  (function tick() {
    cx += (mx - cx) * 0.11;
    cy += (my - cy) * 0.11;
    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    }
    trail[0].x += (mx - trail[0].x) * 0.28;
    trail[0].y += (my - trail[0].y) * 0.28;
    for (let i = 1; i < TRAIL_COUNT; i++) {
      trail[i].x += (trail[i - 1].x - trail[i].x) * 0.28;
      trail[i].y += (trail[i - 1].y - trail[i].y) * 0.28;
    }
    trail.forEach(t => {
      t.el.style.left = t.x + 'px';
      t.el.style.top  = t.y + 'px';
    });
    requestAnimationFrame(tick);
  }());

  document.querySelectorAll('a, button, .proj-card, .specialty-card, .tag, .clink').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
  });

  /* ── Sticky Nav ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Mobile Menu ── */
  const burger      = document.getElementById('burger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let menuOpen = false;

  function toggleMenu(force) {
    menuOpen = force !== undefined ? force : !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const [s0, s1] = burger.querySelectorAll('span');
    s0.style.transform = menuOpen ? 'translateY(3.5px) rotate(45deg)'   : '';
    s1.style.transform = menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : '';
  }

  burger.addEventListener('click', () => toggleMenu());
  mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

  /* ── Scroll Reveal ── */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });

    document.querySelectorAll('.pop-in').forEach(el => io.observe(el));
    document.querySelectorAll('.hero .pop-in').forEach(el => el.classList.add('visible'));
  }

  /* ── Active Nav Link ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)
        );
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sIO.observe(s));

}());
