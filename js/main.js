/* =============================================================
   HULYA ZORLU — Portfolio v19
   GSAP 3 · ScrollTrigger · NO Lenis (scroll natif)
   ============================================================= */

gsap.registerPlugin(ScrollTrigger);

const qs  = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];

/* =============================================================
   CLOCK — heure Paris
   ============================================================= */
function updateClock() {
  const el = qs('#clock');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false
  });
}
updateClock();
setInterval(updateClock, 1000);

/* =============================================================
   DARK SECTION — toggle class + grid color
   ============================================================= */
ScrollTrigger.create({
  trigger: '.home-about',
  start: 'top 60%',
  end: 'max',
  onEnter:     () => document.body.classList.add('is-dark'),
  onLeaveBack: () => document.body.classList.remove('is-dark')
});

/* =============================================================
   LOADER
   ============================================================= */
(function initLoader() {
  const loader  = qs('#loader');
  const counter = qs('#loader-counter');
  if (!loader || !counter) return;

  const obj = { val: 0 };
  gsap.to(obj, {
    val: 100, duration: 2.2, ease: 'power1.inOut',
    onUpdate() {
      counter.textContent = String(Math.floor(obj.val)).padStart(3, '0');
    },
    onComplete() {
      gsap.to(loader, {
        yPercent: -100, duration: 0.75, ease: 'power3.inOut', delay: 0.2,
        onComplete() { loader.style.display = 'none'; revealPage(); }
      });
    }
  });
})();

/* =============================================================
   TYPEWRITER — looping
   ============================================================= */
function startTypewriter(delay) {
  const el = qs('#typewriter-out');
  if (!el) return;
  const full = '[SCROLL TO EXPLORE';
  let shown = '', cursor = true, phase = 'typing';

  setTimeout(() => {
    const blink = setInterval(() => {
      cursor = !cursor;
      el.textContent = shown + (cursor ? '|' : ' ');
    }, 500);

    function render() { el.textContent = shown + (cursor ? '|' : ' '); }
    function loop() {
      if (phase === 'typing') {
        if (shown.length < full.length) {
          shown = full.slice(0, shown.length + 1); render();
          setTimeout(loop, 75);
        } else { phase = 'waiting'; setTimeout(() => { phase = 'erasing'; loop(); }, 2800); }
      } else {
        if (shown.length > 0) {
          shown = shown.slice(0, -1); render(); setTimeout(loop, 35);
        } else { phase = 'typing'; setTimeout(loop, 400); }
      }
    }
    loop();
  }, delay);
}

/* =============================================================
   PAGE REVEAL — runs after loader
   ============================================================= */
function revealPage() {

  /* Nav elements */
  gsap.to(['.nav-logo', '.nav-link', '.nav-cta', '#burger'], {
    opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power2.out', delay: 0.1
  });

  /* Hero name lines */
  gsap.to(qsa('.hero-title-line span'), {
    y: '0%', duration: 1.0, stagger: 0.14, ease: 'power3.out'
  });

  /* Hero sub + port label */
  gsap.to('#hero-sub', {
    opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.out', delay: 0.55
  });

  /* Links & scroll hint */
  gsap.to(['#hero-lk', '#hero-sc'], {
    opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.85
  });

  /* Start typewriter */
  startTypewriter(1100);

  /* Init scroll-based animations */
  initScrollAnimations();
}

/* =============================================================
   SCROLL ANIMATIONS
   ============================================================= */
function initScrollAnimations() {

  /* ── Projects title ── */
  gsap.to('.prjs-tt', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.prjs-tt', start: 'top 85%' }
  });
  gsap.to('.prjs-count', {
    opacity: 1, duration: 0.5, ease: 'power2.out',
    scrollTrigger: { trigger: '.prjs-tt', start: 'top 85%' }
  });

  /* ── Project images — clip-path reveal + fade in ── */
  qsa('.prj-img').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%',
      once: true,
      onEnter() {
        el.classList.add('revealed');
        gsap.to(el, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2, ease: 'power3.inOut'
        });
      }
    });
  });

  /* ── About headline ── */
  qsa('.about-line').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: '.about-tt', start: 'top 82%' }
    });
  });

  /* ── About bio + exp ── */
  gsap.to('#about-bio', {
    opacity: 1, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#about-bio', start: 'top 85%' }
  });
  gsap.to('#about-exp', {
    opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.15,
    scrollTrigger: { trigger: '#about-exp', start: 'top 85%' }
  });

  /* ── Skills ── */
  gsap.to('#about-skills', {
    opacity: 1, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#about-skills', start: 'top 88%' }
  });

  /* ── Footer title ── */
  gsap.to('#footer-title', {
    opacity: 1, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '#footer-title', start: 'top 80%' }
  });

  /* ── Footer links ── */
  gsap.to('#footer-lk', {
    opacity: 1, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#footer-lk', start: 'top 85%' }
  });
  gsap.to('#footer-cr', {
    opacity: 1, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '#footer-cr', start: 'top 90%' }
  });
}

/* =============================================================
   MOBILE MENU
   ============================================================= */
const burger  = qs('#burger');
const mobMenu = qs('#mob-menu');
const mobClose = qs('#mob-close');

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

burger   && burger.addEventListener('click', () =>
  mobMenu.classList.contains('open') ? closeMenu() : openMenu()
);
mobClose && mobClose.addEventListener('click', closeMenu);
qsa('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* =============================================================
   SMOOTH SCROLL pour anchor links
   ============================================================= */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = qs(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
