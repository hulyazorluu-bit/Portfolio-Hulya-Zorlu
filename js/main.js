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
      startReveal();
    }, 1800);
  });

  /* ── Custom Cursor ── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }());

  document.querySelectorAll('a, button, .tag, .project-card__media').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  /* ── Sticky Nav ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Mobile Menu ── */
  const menuToggle  = document.getElementById('menuToggle');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let menuOpen = false;

  function toggleMenu(force) {
    menuOpen = force !== undefined ? force : !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const [s0, s1] = menuToggle.querySelectorAll('span');
    s0.style.transform = menuOpen ? 'translateY(3.75px) rotate(45deg)'  : '';
    s1.style.transform = menuOpen ? 'translateY(-3.75px) rotate(-45deg)' : '';
  }

  menuToggle.addEventListener('click', () => toggleMenu());
  mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

  /* ── Typed Text ── */
  const typedEl    = document.getElementById('typed');
  const words      = ['UI/UX Designer', 'Product Owner', 'Creative'];
  let wordIdx      = 0;
  let charIdx      = 0;
  let isDeleting   = false;

  function typeLoop() {
    const word      = words[wordIdx];
    typedEl.textContent = word.slice(0, charIdx);

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIdx === word.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx    = (wordIdx + 1) % words.length;
      delay      = 380;
    }

    charIdx += isDeleting ? -1 : 1;
    setTimeout(typeLoop, delay);
  }

  /* ── Scroll Reveal ── */
  function startReveal() {
    const els = document.querySelectorAll('.reveal');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.035) + 's';
      io.observe(el);
    });

    typeLoop();
  }

  /* ── Parallax Hero ── */
  const heroBg     = document.querySelector('.hero__bg-text');
  const heroAccent = document.querySelector('.hero__accent');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      heroBg.style.transform    = `translateX(-50%) translateY(${sy * 0.25}px)`;
      if (heroAccent) heroAccent.style.transform = `translateY(${sy * 0.15}px)`;
    }, { passive: true });
  }

  /* ── Active Nav on Scroll ── */
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
  }, { threshold: 0.35 });

  sections.forEach(s => sectionIO.observe(s));

}());
