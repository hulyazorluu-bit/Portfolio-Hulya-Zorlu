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
    }, 1800);
  });

  /* ── Custom Cursor ── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    }
  });

  (function animateCursor() {
    cx += (mx - cx) * 0.13;
    cy += (my - cy) * 0.13;
    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    }
    requestAnimationFrame(animateCursor);
  }());

  document.querySelectorAll('a, button, .project-card, .exp-card, .fact-card, .sk').forEach(el => {
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
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = menuOpen ? 'translateY(4px) rotate(45deg)'  : '';
    spans[1].style.transform = menuOpen ? 'translateY(-4px) rotate(-45deg)' : '';
  }

  burger.addEventListener('click', () => toggleMenu());
  mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

  /* ── Scroll Reveal (pop-in elements) ── */
  function initReveal() {
    const popEls = document.querySelectorAll('.pop-in');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    popEls.forEach(el => io.observe(el));

    /* Hero elements are already in view — trigger immediately */
    document.querySelectorAll('.hero .pop-in').forEach(el => el.classList.add('visible'));
  }

  /* ── Active Nav Link on Scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionIO.observe(s));

}());
