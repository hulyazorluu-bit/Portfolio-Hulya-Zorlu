/* ================================================================
   HULYA ZORLU — PORTFOLIO JS
   Bauhaus Graphique
   ================================================================ */

/* ================================================================
   LOADER — Geometric assembly then reveal
   ================================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Let CSS animations play (approx 1.1s), then fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    // Fire hero reveals right after
    setTimeout(() => {
      document.querySelectorAll('.s-hero .reveal').forEach(el => el.classList.add('visible'));
    }, 80);
  }, 1500);
});

/* ================================================================
   CURSOR — Black square, turns red on hover
   ================================================================ */
const cursor = document.getElementById('cursor');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function trackCursor() {
  // Tight follow — Bauhaus feels precise, not laggy
  cx += (mx - cx) * 0.18;
  cy += (my - cy) * 0.18;
  if (cursor) {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }
  requestAnimationFrame(trackCursor);
})();

const hoverTargets = 'a, button, .proj-card, .sp, .lang-badge, .discip, .t-item, .contact-link';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('on-hover'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('on-hover'));
});

/* ================================================================
   NAV — Solid black border on scroll
   ================================================================ */
const nav = document.getElementById('nav');
const syncNav = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', syncNav, { passive: true });
syncNav();

/* ================================================================
   MOBILE MENU
   ================================================================ */
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
document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ================================================================
   SCROLL REVEAL — Hard snap from left (no soft easing in CSS)
   ================================================================ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll(':not(.s-hero) .reveal').forEach(el => revealObs.observe(el));

/* ================================================================
   SMOOTH SCROLL
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ================================================================
   ACTIVE NAV LINK — highlights current section
   ================================================================ */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--R)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));
