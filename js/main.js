/* ================================================================
   HULYA ZORLU — GRAPHISTE MODERNE TYPOGRAPHIQUE
   ================================================================ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero letter reveal after loader fades
    setTimeout(() => {
      document.querySelectorAll('.hc').forEach(el => el.classList.add('visible'));
      // Trigger hero clip-wraps (role/city labels)
      document.querySelectorAll('.hero .clip-wrap').forEach(el => el.classList.add('visible'));
    }, 80);
  }, 1600);
});

/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function trackCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  if (cursor) {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }
  requestAnimationFrame(trackCursor);
})();

const hoverTargets = 'a, button, .sk, .lp, .exp-tag, .btn';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('on-hover'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('on-hover'));
});

/* ── CURSOR HIDES ON MOBILE ── */
if ('ontouchstart' in window) {
  if (cursor) cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
const syncNav = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', syncNav, { passive: true });
syncNav();

/* ── MOBILE MENU ── */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
const mobClose = document.getElementById('mobClose');

function openMenu() {
  mobMenu.classList.add('open');
  mobMenu.setAttribute('aria-hidden', 'false');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobMenu.classList.remove('open');
  mobMenu.setAttribute('aria-hidden', 'true');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () =>
  mobMenu.classList.contains('open') ? closeMenu() : openMenu()
);
mobClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── PROJECT IMAGE FOLLOWS CURSOR ── */
document.querySelectorAll('.proj-row').forEach(row => {
  const img = row.querySelector('.proj-hover-img');
  if (!img) return;

  row.addEventListener('mouseenter', () => row.classList.add('img-active'));
  row.addEventListener('mouseleave', () => row.classList.remove('img-active'));

  row.addEventListener('mousemove', e => {
    img.style.left = e.clientX + 'px';
    img.style.top  = e.clientY + 'px';
  });
});

/* ── CLIP-WRAP REVEAL ── */
const clipObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      clipObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll(':not(.hero) .clip-wrap').forEach(el => clipObs.observe(el));

/* ── SCROLL REVEAL (.reveal) ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));
