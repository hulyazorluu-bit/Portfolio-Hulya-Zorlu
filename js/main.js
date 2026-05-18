/* ================================================================
   HULYA ZORLU - DARK MAGAZINE / VOGUE LUXE
   GSAP 3 + ScrollTrigger
   ================================================================ */

gsap.registerPlugin(ScrollTrigger);

const isMobile = () => window.innerWidth < 768;
const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

/* ================================================================
   CURSOR - hollow ring (lerp) + gold dot (exact)
   ================================================================ */
(function initCursor() {
  if (isMobile()) return;

  const ring = qs('#c-ring');
  const dot  = qs('#c-dot');
  const mouse   = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: mouse.x,        y: mouse.y };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    gsap.set(dot, { x: mouse.x, y: mouse.y });
  });

  (function tick() {
    ringPos.x += (mouse.x - ringPos.x) * 0.1;
    ringPos.y += (mouse.y - ringPos.y) * 0.1;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    requestAnimationFrame(tick);
  })();

  /* hover states */
  qsa('a:not(.proj-row), button, .sk, .lpill').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover-link');
      ring.textContent = 'VOIR';
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover-link');
      ring.textContent = '';
    });
  });

  qsa('.proj-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.remove('hover-link');
      ring.classList.add('hover-proj');
      ring.textContent = '';
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover-proj');
    });
  });
})();

/* ================================================================
   LOADER - gold progress bar then fade
   ================================================================ */
window.addEventListener('load', () => {
  const fill   = qs('#loader-fill');
  const loader = qs('#loader');

  gsap.to(fill, {
    width: '100%',
    duration: 1.6,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.55,
        delay: 0.15,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          revealHero();
        }
      });
    }
  });
});

/* ================================================================
   HERO REVEAL - letters fade + gold line + byline
   ================================================================ */
function revealHero() {
  const chars  = qsa('.ht');
  const gLine  = qs('.hero-gold-line');
  const byline = qs('.hero-byline');
  const scroll = qs('.hero-scroll');

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    stagger: 0.055,
    duration: 0.85,
    ease: 'power3.out'
  });

  const afterChars = chars.length * 0.055 + 0.3;

  gsap.to(gLine, {
    width: 240,
    duration: 1,
    delay: afterChars,
    ease: 'power3.inOut'
  });

  gsap.to(byline, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    delay: afterChars + 0.2,
    ease: 'power3.out'
  });

  gsap.to(scroll, {
    opacity: 1,
    duration: 0.6,
    delay: afterChars + 0.6,
    ease: 'power2.out'
  });

  /* reveal sec-tag for all sections after page ready */
  gsap.to('.sec-tag', {
    opacity: 1,
    duration: 0.6,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 90%'
    }
  });
}

/* ================================================================
   PARALLAX HERO - text rises slower than scroll
   ================================================================ */
gsap.to('.hero-inner', {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: '.s-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.4
  }
});

/* ================================================================
   NAV - blur on scroll
   ================================================================ */
ScrollTrigger.create({
  start: 'top -50',
  onEnter:     () => qs('#nav').classList.add('scrolled'),
  onLeaveBack: () => qs('#nav').classList.remove('scrolled')
});

/* ================================================================
   ABOUT - slide in from left + grow gold line
   ================================================================ */
gsap.to('.about-quote', {
  opacity: 1,
  x: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-quote', start: 'top 80%' }
});
gsap.set('.about-quote', { x: -40 });

gsap.to('.about-bio', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-bio', start: 'top 82%' }
});
gsap.set('.about-bio', { y: 20 });

gsap.to('.about-specs', {
  opacity: 1,
  y: 0,
  duration: 0.7,
  delay: 0.1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-specs', start: 'top 82%' }
});
gsap.set('.about-specs', { y: 20 });

gsap.to('.lang-pills', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  delay: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.lang-pills', start: 'top 85%' }
});
gsap.set('.lang-pills', { y: 16 });

gsap.to('.gold-sep', {
  width: '100%',
  duration: 1.1,
  ease: 'power3.inOut',
  scrollTrigger: { trigger: '.gold-sep', start: 'top 88%' }
});

/* ================================================================
   PROJECTS - fade up rows + floating image on cursor
   ================================================================ */
qsa('.proj-row').forEach((row, i) => {
  /* scroll reveal */
  gsap.to(row, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: i * 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: row, start: 'top 82%' }
  });
  gsap.set(row, { y: 28 });

  /* floating image follow cursor */
  const img = row.querySelector('.p-img');
  if (!img) return;

  gsap.set(img, { xPercent: -50, yPercent: -50 });

  row.addEventListener('mouseenter', () => {
    gsap.to(img, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  });
  row.addEventListener('mouseleave', () => {
    gsap.to(img, { opacity: 0, duration: 0.25 });
  });
  row.addEventListener('mousemove', e => {
    gsap.to(img, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  });
});

/* ================================================================
   EXPERIENCE - slide from right + staggered
   ================================================================ */
qsa('.exp-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1,
    x: 0,
    duration: 0.75,
    delay: i * 0.06,
    ease: 'power3.out',
    scrollTrigger: { trigger: item, start: 'top 84%' }
  });
  gsap.set(item, { x: 36 });
});

/* ================================================================
   SKILLS - cascade from bottom
   ================================================================ */
gsap.to('.sk', {
  opacity: 1,
  y: 0,
  stagger: 0.045,
  duration: 0.55,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.skills-wrap', start: 'top 78%' }
});
gsap.set('.sk', { y: 18 });

/* ================================================================
   CONTACT - title lines + gold line
   ================================================================ */
gsap.to('.ct-line', {
  opacity: 1,
  y: 0,
  stagger: 0.14,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-title', start: 'top 78%' }
});
gsap.set('.ct-line', { y: 32 });

gsap.to('.contact-gold-line', {
  width: '100%',
  duration: 1.1,
  ease: 'power3.inOut',
  scrollTrigger: { trigger: '.contact-gold-line', start: 'top 85%' }
});

gsap.from('.c-link, .cta-btn', {
  y: 24,
  opacity: 0,
  stagger: 0.1,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-body', start: 'top 82%' }
});

/* ================================================================
   SEC-TAG reveal per section
   ================================================================ */
qsa('.sec-tag').forEach(tag => {
  gsap.to(tag, {
    opacity: 1,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: { trigger: tag, start: 'top 85%' }
  });
});

/* ================================================================
   ACTIVE NAV LINK
   ================================================================ */
qsa('section[id]').forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 55%',
    end: 'bottom 55%',
    onEnter:     () => setActiveNav(sec.id),
    onEnterBack: () => setActiveNav(sec.id)
  });
});
function setActiveNav(id) {
  qsa('.nav-link').forEach(l => {
    const active = l.getAttribute('href') === `#${id}`;
    l.style.color = active ? 'var(--white)' : '';
  });
}

/* ================================================================
   MOBILE MENU
   ================================================================ */
const burger  = qs('#burger');
const mobMenu = qs('#mob-menu');
const mobClose= qs('#mob-close');

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
qsa('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ================================================================
   SMOOTH SCROLL
   ================================================================ */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ================================================================
   CTA BUTTON - subtle 3D tilt
   ================================================================ */
const ctaBtn = qs('#cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('mousemove', e => {
    const r = ctaBtn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    gsap.to(ctaBtn, {
      rotateY: x * 8, rotateX: -y * 8,
      transformPerspective: 500,
      duration: 0.25, ease: 'power2.out'
    });
  });
  ctaBtn.addEventListener('mouseleave', () => {
    gsap.to(ctaBtn, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
}
