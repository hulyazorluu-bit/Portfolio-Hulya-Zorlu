/* =============================================================
   HULYA ZORLU — PORTFOLIO v18
   GSAP 3 · ScrollTrigger · Lenis smooth scroll
   ============================================================= */

gsap.registerPlugin(ScrollTrigger);

const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];
const isMobile = () => window.innerWidth < 768;

/* =============================================================
   LENIS SMOOTH SCROLL
   ============================================================= */
let lenis;
if (!isMobile() && window.Lenis) {
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* =============================================================
   CUSTOM CURSOR
   ============================================================= */
(function initCursor() {
  if (isMobile()) return;
  const dot  = qs('#cursor-dot');
  const ring = qs('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function ringLoop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(ringLoop);
  })();

  /* Hover state on interactive elements */
  qsa('a, button, .work-item, .lang-pill').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* Dark sections toggle */
  ScrollTrigger.create({
    trigger: '.bridge',
    start: 'top 70%',
    end: 'max',
    onEnter:     () => document.body.classList.add('cursor-dark'),
    onLeaveBack: () => document.body.classList.remove('cursor-dark')
  });
})();

/* =============================================================
   TEXT DISTORTION GLITCH
   ============================================================= */
const waveGroups = [];

function setupWave(el) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = '';
  el.style.display = 'block';
  const spans = [...text].map(char => {
    const s = document.createElement('span');
    s.style.display = 'inline-block';
    s.textContent   = char === ' ' ? ' ' : char;
    el.appendChild(s);
    return s;
  });
  waveGroups.push(spans);
}

setupWave(qs('#wave-hulya'));
setupWave(qs('#wave-zorlu'));
setupWave(qs('#wave-trav'));
setupWave(qs('#wave-ens'));

if (!isMobile()) {
  (function distortLoop() {
    waveGroups.forEach(spans => {
      spans.forEach(span => {
        if (Math.random() > 0.97) {
          const x    = (Math.random() - 0.5) * 6;
          const y    = (Math.random() - 0.5) * 4;
          const skew = (Math.random() - 0.5) * 8;
          const op   = 0.65 + Math.random() * 0.35;
          span.style.transform = `translate(${x}px,${y}px) skewX(${skew}deg)`;
          span.style.opacity   = op;
          setTimeout(() => {
            span.style.transform = '';
            span.style.opacity   = '';
          }, 40 + Math.random() * 70);
        }
      });
    });
    requestAnimationFrame(distortLoop);
  })();
}

/* =============================================================
   NAV LINK SCRAMBLE ON HOVER
   ============================================================= */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

function scrambleText(el, finalText) {
  let frame = 0;
  const maxFrames = finalText.length * 2.5;
  const interval = setInterval(() => {
    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (frame / maxFrames > i / finalText.length) return char;
        return char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    frame++;
    if (frame > maxFrames) {
      el.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
  return interval;
}

qsa('.nav-link').forEach(link => {
  const original = link.dataset.text || link.textContent.trim();
  link.style.minWidth = link.offsetWidth + 'px';
  let timer;
  link.addEventListener('mouseenter', function() {
    clearInterval(timer);
    timer = scrambleText(this, original);
  });
  link.addEventListener('mouseleave', function() {
    clearInterval(timer);
    this.textContent = original;
  });
});

/* =============================================================
   CLOCK — Paris time
   ============================================================= */
function updateClock() {
  const el = qs('#clock');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}
updateClock();
setInterval(updateClock, 1000);

/* =============================================================
   LOADER
   ============================================================= */
(function initLoader() {
  const loader  = qs('#loader');
  const counter = qs('#loader-counter');
  const bar     = qs('#loader-bar');
  if (!loader || !counter) return;

  const obj = { val: 0 };
  gsap.to(obj, {
    val: 100,
    duration: 2.2,
    ease: 'power1.inOut',
    onUpdate() {
      const v = Math.floor(obj.val);
      counter.textContent = String(v).padStart(3, '0');
      if (bar) bar.style.width = v + '%';
    },
    onComplete() {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power3.inOut',
        delay: 0.2,
        onComplete() {
          loader.style.display = 'none';
          revealPage();
        }
      });
    }
  });
})();

/* =============================================================
   TYPEWRITER — looping
   ============================================================= */
function startTypewriter(delayMs) {
  const el   = qs('#typewriter-out');
  const wrap = qs('#typewriter-wrap');
  if (!el || !wrap) return;

  const full = '[SCROLL TO EXPLORE';
  let   shown  = '';
  let   cursor = true;
  let   phase  = 'typing';

  setTimeout(() => {
    gsap.to(wrap, { opacity: 1, duration: 0.4 });

    setInterval(() => {
      cursor = !cursor;
      el.textContent = shown + (cursor ? '|' : ' ');
    }, 500);

    function render() { el.textContent = shown + (cursor ? '|' : ' '); }

    function loop() {
      if (phase === 'typing') {
        if (shown.length < full.length) {
          shown = full.slice(0, shown.length + 1);
          render();
          setTimeout(loop, 75);
        } else {
          phase = 'waiting';
          setTimeout(() => { phase = 'erasing'; loop(); }, 2800);
        }
      } else if (phase === 'erasing') {
        if (shown.length > 0) {
          shown = shown.slice(0, -1);
          render();
          setTimeout(loop, 35);
        } else {
          phase = 'typing';
          setTimeout(loop, 400);
        }
      }
    }
    loop();
  }, delayMs);
}

/* =============================================================
   PAGE REVEAL
   ============================================================= */
function revealPage() {
  /* Hero eyebrow */
  gsap.to('.hero-eyebrow', { opacity: 0.5, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });

  /* Hero name lines */
  gsap.to(qsa('.hero-line-inner'), {
    y: '0%', duration: 1.1,
    stagger: 0.14, ease: 'power3.out'
  });

  /* Hero label */
  gsap.to('.hero-label', {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.55
  });

  /* Bottom links */
  gsap.to('.hero-ext-links', { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.85 });

  startTypewriter(1000);
  initScrollAnimations();
}

/* =============================================================
   SCROLL ANIMATIONS
   ============================================================= */
function initScrollAnimations() {

  /* Nav scroll state */
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
      { opacity: 0, y: 8 },
      { opacity: 0.4, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  /* Works header */
  gsap.fromTo('.works-header',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.works-header', start: 'top 85%' } }
  );

  /* Work items */
  qsa('.work-item').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* About photo */
  gsap.to('.about-photo', {
    opacity: 1, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-photo', start: 'top 85%' }
  });
  gsap.to('.about-photo-meta', {
    opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.3,
    scrollTrigger: { trigger: '.about-photo', start: 'top 85%' }
  });

  /* About headline */
  qsa('.about-line').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: '.about-headline', start: 'top 82%' }
    });
  });

  /* About bio & cta */
  qsa('.about-bio, .about-cta').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, duration: 0.8, ease: 'power2.out',
      delay: 0.2 + i * 0.15,
      scrollTrigger: { trigger: '.about-text-col', start: 'top 82%' }
    });
  });

  /* Experience rows */
  qsa('.exp-entry').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Skills grid */
  gsap.to('.skills-grid', {
    opacity: 1, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.skills-grid', start: 'top 85%' }
  });
  gsap.fromTo('.lang-row',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: '.lang-row', start: 'top 88%' } }
  );

  /* Contact grid */
  gsap.fromTo('.contact-grid',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' } }
  );

  /* Contact title lines */
  qsa('.contact-line').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: '.contact-title', start: 'top 82%' } }
    );
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
   SMOOTH SCROLL (anchor links — fallback if no Lenis)
   ============================================================= */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -56, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
