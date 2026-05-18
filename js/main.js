/* ================================================================
   HULYA ZORLU - DARK MAGAZINE / VOGUE LUXE v6
   GSAP 3 + ScrollTrigger
   ================================================================ */

gsap.registerPlugin(ScrollTrigger);

const isMobile = () => window.innerWidth < 768;
const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

/* CURSOR */
(function initCursor() {
  if (isMobile()) return;
  const ring = qs('#c-ring');
  const dot  = qs('#c-dot');
  const mouse   = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: mouse.x, y: mouse.y };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    gsap.set(dot, { x: mouse.x, y: mouse.y });
  });

  (function tick() {
    ringPos.x += (mouse.x - ringPos.x) * 0.1;
    ringPos.y += (mouse.y - ringPos.y) * 0.1;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    requestAnimationFrame(tick);
  })();

  qsa('a:not(.proj-row), button, .sk, .lpill').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('hover-link'); ring.textContent = 'VOIR'; });
    el.addEventListener('mouseleave', () => { ring.classList.remove('hover-link'); ring.textContent = ''; });
  });
  qsa('.proj-row').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.remove('hover-link'); ring.classList.add('hover-proj'); ring.textContent = ''; });
    el.addEventListener('mouseleave', () => { ring.classList.remove('hover-proj'); });
  });
})();

/* LOADER */
window.addEventListener('load', () => {
  const fill   = qs('#loader-fill');
  const loader = qs('#loader');

  gsap.to(fill, {
    width: '100%',
    duration: 1.6,
    ease: 'power2.inOut',
    onComplete() {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        delay: 0.12,
        ease: 'power2.inOut',
        onComplete() {
          loader.style.display = 'none';
          revealHero();
        }
      });
    }
  });
});

/* HERO REVEAL */
function revealHero() {
  const chars  = qsa('.ht');
  const gLine  = qs('.hero-gold-line');
  const byline = qs('.hero-byline');
  const scroll = qs('.hero-scroll');

  gsap.fromTo(chars,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, stagger: 0.055, duration: 0.85, ease: 'power3.out' }
  );

  const delay = chars.length * 0.055 + 0.3;
  gsap.to(gLine, { width: 240, duration: 1, delay, ease: 'power3.inOut' });
  gsap.fromTo(byline,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.7, delay: delay + 0.2, ease: 'power3.out' }
  );
  gsap.to(scroll, { opacity: 1, duration: 0.6, delay: delay + 0.7 });

  initScrollAnimations();
}

/* SCROLL ANIMATIONS */
function initScrollAnimations() {

  gsap.to('.hero-inner', {
    y: -80, ease: 'none',
    scrollTrigger: { trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: 1.4 }
  });

  ScrollTrigger.create({
    start: 'top -50',
    onEnter:     () => qs('#nav').classList.add('scrolled'),
    onLeaveBack: () => qs('#nav').classList.remove('scrolled')
  });

  qsa('.sec-tag').forEach(tag => {
    gsap.fromTo(tag,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: tag, start: 'top 88%' } }
    );
  });

  gsap.fromTo('.about-quote',
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-quote', start: 'top 80%' } }
  );
  gsap.fromTo('.about-bio',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.about-bio', start: 'top 83%' } }
  );
  gsap.fromTo('.about-specs',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.about-specs', start: 'top 83%' } }
  );
  gsap.fromTo('.lang-pills',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.lang-pills', start: 'top 86%' } }
  );
  gsap.to('.gold-sep', {
    width: '100%', duration: 1.1, ease: 'power3.inOut',
    scrollTrigger: { trigger: '.gold-sep', start: 'top 88%' }
  });

  qsa('.proj-row').forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 83%' } }
    );
    const img = row.querySelector('.p-img');
    if (!img) return;
    gsap.set(img, { xPercent: -50, yPercent: -50, x: -300, y: -300 });
    row.addEventListener('mouseenter', () => gsap.to(img, { opacity: 1, duration: 0.35, ease: 'power2.out' }));
    row.addEventListener('mouseleave', () => gsap.to(img, { opacity: 0, duration: 0.25 }));
    row.addEventListener('mousemove', e => {
      gsap.to(img, { x: e.clientX, y: e.clientY, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
    });
  });

  qsa('.exp-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: 36 },
      { opacity: 1, x: 0, duration: 0.75, delay: i * 0.06, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 84%' } }
    );
  });

  gsap.fromTo('.sk',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, stagger: 0.045, duration: 0.55, ease: 'power3.out', scrollTrigger: { trigger: '.skills-wrap', start: 'top 78%' } }
  );

  gsap.fromTo('.ct-line',
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, stagger: 0.14, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-title', start: 'top 78%' } }
  );
  gsap.to('.contact-gold-line', {
    width: '100%', duration: 1.1, ease: 'power3.inOut',
    scrollTrigger: { trigger: '.contact-gold-line', start: 'top 85%' }
  });
  gsap.fromTo('.c-link',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.contact-links', start: 'top 82%' } }
  );
  gsap.fromTo('.cta-btn',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.cta-btn', start: 'top 85%' } }
  );

  qsa('section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onEnter: () => setNav(sec.id), onEnterBack: () => setNav(sec.id)
    });
  });
}

function setNav(id) {
  qsa('.nav-link').forEach(l => { l.style.color = l.getAttribute('href') === '#' + id ? 'var(--white)' : ''; });
}

/* MOBILE MENU */
const burger   = qs('#burger');
const mobMenu  = qs('#mob-menu');
const mobClose = qs('#mob-close');

function openMenu() {
  mobMenu.classList.add('open'); mobMenu.setAttribute('aria-hidden', 'false');
  burger.classList.add('open');  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobMenu.classList.remove('open'); mobMenu.setAttribute('aria-hidden', 'true');
  burger.classList.remove('open');  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
burguer && burger.addEventListener('click', () => mobMenu.classList.contains('open') ? closeMenu() : openMenu());
mobClose && mobClose.addEventListener('click', closeMenu);
qsa('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* SMOOTH SCROLL */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* CTA TILT */
const ctaBtn = qs('#cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('mousemove', e => {
    const r = ctaBtn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    gsap.to(ctaBtn, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 500, duration: 0.25, ease: 'power2.out' });
  });
  ctaBtn.addEventListener('mouseleave', () => {
    gsap.to(ctaBtn, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
}
