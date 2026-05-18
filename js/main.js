/* ================================================================
   HULYA ZORLU — PORTFOLIO JS
   ================================================================ */

/* === LOADER === */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal after loader fades
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
    }, 100);
  }, 1800);
});

/* === CUSTOM CURSOR === */
const cursor = document.getElementById('cursor');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function trackCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  if (cursor) {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }
  requestAnimationFrame(trackCursor);
})();

document.querySelectorAll('a, button, .proj-card__visual, .specialty, .pill, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
});

/* === NAV SCROLL === */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* === MOBILE MENU === */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
menuClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));

// Close on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll(':not(.hero) .reveal').forEach(el => revealObserver.observe(el));

/* === SMOOTH SCROLL === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* === PARALLAX ON HERO NAME (subtle) === */
const heroName = document.querySelector('.hero__name');
if (heroName && window.matchMedia('(min-width: 1025px)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroName.style.transform = `translateY(${y * 0.12}px)`;
  }, { passive: true });
}

/* === RESPECT REDUCED MOTION === */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  if (heroName) heroName.style.transform = '';
}
