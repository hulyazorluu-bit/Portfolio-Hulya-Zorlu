/* =========================================================
   HULYA ZORLU — EDITORIAL PORTFOLIO v15
   GSAP 3 + ScrollTrigger + requestAnimationFrame wave
   ========================================================= */

gsap.registerPlugin(ScrollTrigger);

const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];
const isMobile = () => window.innerWidth < 768;

/* ── WAVY TEXT — requestAnimationFrame sine wave ── */
const waveGroups = [];

function setupWave(el) {
  if (!el) return;
  const chars = [...el.textContent];
  el.innerHTML = '';
  el.style.display = 'block';
  const spans = chars.map(char => {
    const s = document.createElement('span');
    s.style.display = 'inline-block';
    s.textContent = char === ' ' ? ' ' : char;
    el.appendChild(s);
    return s;
  });
  waveGroups.push(spans);
}

setupWave(qs('#wave-hulya'));
setupWave(qs('#wave-zorlu'));
setupWave(qs('#wave-trav'));
setupWave(qs('#wave-ens'));

/* Only animate on non-mobile for perf */
if (!isMobile()) {
  (function animateWaves(t) {
    const secs = t / 1000;
    waveGroups.forEach(spans => {
      spans.forEach((span, i) => {
        span.style.transform = `translateY(${Math.sin(secs * 2 + i * 0.4) * 8}px)`;
      });
    });
    requestAnimationFrame(animateWaves);
  })(0);
}

/* ── CLOCK (Paris timezone) ── */
function updateClock() {
  const el = qs('#clock');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
updateClock();
setInterval(updateClock, 1000);

/* ── NAV TYPEWRITER HOVER ── */
function initNavTypewriter() {
  qsa('.nav-link').forEach(link => {
    const original = link.textContent.trim();
    link.style.minWidth = link.offsetWidth + 'px';
    let timer;

    link.addEventListener('mouseenter', function() {
      clearTimeout(timer);
      this.textContent = '';
      let i = 0;
      const type = () => {
        if (i < original.length) {
          this.textContent += original[i++];
          timer = setTimeout(type, 38);
        }
      };
      type();
    });

    link.addEventListener('mouseleave', function() {
      clearTimeout(timer);
      this.textContent = original;
    });
  });
}
initNavTypewriter();

/* ── LOADER ── */
(function initLoader() {
  const loader  = qs('#loader');
  const counter = qs('#loader-counter');
  if (!loader || !counter) return;

  const obj = { val: 0 };
  gsap.to(obj, {
    val: 100,
    duration: 2.5,
    ease: 'power1.inOut',
    onUpdate() {
      counter.textContent = String(Math.floor(obj.val)).padStart(3, '0');
    },
    onComplete() {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.25,
        onComplete() {
          loader.style.display = 'none';
          revealPage();
        }
      });
    }
  });
})();

/* ── TYPEWRITER [SCROLL TO EXPLORE_] ── */
function startTypewriter(delayMs) {
  const el   = qs('#typewriter-out');
  const wrap = qs('#typewriter-wrap');
  if (!el || !wrap) return;

  const text   = 'SCROLL TO EXPLORE';
  const cursor = '<span class="blink-cur"></span>';
  let i = 0;

  setTimeout(() => {
    gsap.to(wrap, { opacity: 1, duration: 0.3 });
    el.innerHTML = '[' + cursor + ']';

    setTimeout(function type() {
      if (i < text.length) {
        el.innerHTML = '[' + text.slice(0, ++i) + cursor + ']';
        setTimeout(type, 60);
      }
    }, 220);
  }, delayMs);
}

/* ── PAGE REVEAL (runs after loader slide-up) ── */
function revealPage() {
  /* Hero name lines slide up */
  gsap.to(qsa('.hero-line-inner'), {
    y: '0%',
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  });

  /* Meta + label fade up */
  gsap.fromTo(['.hero-meta', '.hero-label'],
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out', delay: 0.5 }
  );

  /* Social links */
  gsap.to('.hero-ext-links', {
    opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.8
  });

  startTypewriter(1100);
  initScrollAnimations();
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {

  /* Scrolled state on nav */
  ScrollTrigger.create({
    start: 'top -40',
    onEnter:     () => qs('#nav').classList.add('scrolled'),
    onLeaveBack: () => qs('#nav').classList.remove('scrolled')
  });

  /* Dark nav over black sections */
  ScrollTrigger.create({
    trigger: '.bridge',
    start: 'top 56px',
    end: 'max',
    onEnter:     () => qs('#nav').classList.add('nav-dark'),
    onLeaveBack: () => qs('#nav').classList.remove('nav-dark')
  });

  /* Section labels */
  qsa('.sec-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 10 },
      { opacity: 0.45, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  /* Projects header */
  gsap.fromTo('.proj-header',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.proj-header', start: 'top 85%' } }
  );

  /* Project images — clip-path reveal */
  qsa('.proj-img-wrap').forEach(el => {
    gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.3,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* About headline lines */
  qsa('.about-line').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      delay: i * 0.12,
      scrollTrigger: { trigger: '.about-headline', start: 'top 82%' }
    });
  });

  /* About bio */
  gsap.to('.about-bio', {
    opacity: 1, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-bio', start: 'top 85%' }
  });

  /* Experience rows */
  qsa('.exp-entry').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 87%' }
    });
  });

  /* Skills */
  gsap.to('.skills-text', {
    opacity: 0.75, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.skills-text', start: 'top 85%' }
  });
  gsap.fromTo('.lang-badges',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.lang-badges', start: 'top 88%' } }
  );

  /* Contact links */
  gsap.fromTo('.contact-links',
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-links', start: 'top 85%' } }
  );
}

/* ── MOBILE MENU ── */
const burger   = qs('#burger');
const mobMenu  = qs('#mob-menu');
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

/* ── SMOOTH SCROLL ── */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
