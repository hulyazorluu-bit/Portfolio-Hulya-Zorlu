/* =========================================================
   HULYA ZORLU - EDITORIAL PORTFOLIO v10
   GSAP 3 + ScrollTrigger
   ========================================================= */

gsap.registerPlugin(ScrollTrigger);

const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];
const isMobile = () => window.innerWidth < 768;

/* ── WAVY TEXT ── */
function applyWave(el) {
  if (!el) return;
  const raw = el.textContent;
  el.innerHTML = '';
  [...raw].forEach((char, i) => {
    const span = document.createElement('span');
    span.classList.add('wave-char');
    span.textContent = char === ' ' ? ' ' : char;
    span.style.animationDelay = (i * 0.07).toFixed(2) + 's';
    el.appendChild(span);
  });
}

/* Apply wavy text to hero name + contact title */
applyWave(qs('#wave-hulya'));
applyWave(qs('#wave-zorlu'));
applyWave(qs('#wave-trav'));
applyWave(qs('#wave-ens'));

/* ── CLOCK (Paris time) ── */
function updateClock() {
  const now = new Date();
  const parisStr = now.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false });
  const clockEl = qs('#clock');
  if (clockEl) clockEl.textContent = parisStr;
}
updateClock();
setInterval(updateClock, 1000);

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
        duration: 0.9,
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

/* ── TYPEWRITER [SCROLL TO EXPLORE_] ── */
function startTypewriter(delayMs) {
  const el = qs('#typewriter-out');
  const wrap = qs('#typewriter-wrap');
  if (!el || !wrap) return;

  const text = 'SCROLL TO EXPLORE';
  let i = 0;

  // Fade in the wrapper first
  setTimeout(() => {
    gsap.to(wrap, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    el.innerHTML = '[<span class="blink-cur">_</span>]';

    setTimeout(function type() {
      if (i < text.length) {
        el.innerHTML = '[' + text.slice(0, i + 1) + '<span class="blink-cur">_</span>]';
        i++;
        setTimeout(type, 58);
      }
    }, 180);
  }, delayMs);
}

/* ── PAGE REVEAL (after loader) ── */
function revealPage() {
  // Hero lines slide up
  gsap.to(qsa('.hero-line-inner'), {
    y: '0%',
    duration: 1.1,
    stagger: 0.18,
    ease: 'power4.out'
  });

  // Hero meta + label fade up
  gsap.fromTo(['.hero-meta', '.hero-label'],
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out', delay: 0.55 }
  );

  // Social links fade in
  gsap.to('.hero-ext-links', {
    opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.9
  });

  // Typewriter starts after hero is visible
  startTypewriter(1200);

  initScrollAnimations();
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {

  /* Nav scroll state */
  ScrollTrigger.create({
    start: 'top -40',
    onEnter:     () => qs('#nav').classList.add('scrolled'),
    onLeaveBack: () => qs('#nav').classList.remove('scrolled')
  });

  /* Nav dark mode on black sections */
  ScrollTrigger.create({
    trigger: '.bridge',
    start: 'top 56px',
    end: 'max',
    onEnter:     () => qs('#nav').classList.add('nav-dark'),
    onLeaveBack: () => qs('#nav').classList.remove('nav-dark')
  });

  /* Active nav link */
  const sections = [
    { id: 'hero',        link: '#hero' },
    { id: 'projects',    link: '#projects' },
    { id: 'about',       link: '#about' },
    { id: 'experience',  link: '#experience' },
    { id: 'competences', link: '#competences' },
    { id: 'contact',     link: '#contact' }
  ];
  sections.forEach(({ id, link }) => {
    const sec = qs('#' + id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 60%', end: 'bottom 60%',
      onEnter:     () => setActiveNav(link),
      onEnterBack: () => setActiveNav(link)
    });
  });

  function setActiveNav(href) {
    qsa('.nav-link').forEach(l => {
      const match = l.getAttribute('href') === href;
      l.classList.toggle('active', match);
    });
  }

  /* Sec labels */
  qsa('.sec-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 12 },
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

  /* Project images clip-path reveal */
  qsa('.proj-img-wrap').forEach((el, i) => {
    gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.3,
      ease: 'power3.inOut',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* About lines */
  qsa('.about-line').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: i * 0.12,
        scrollTrigger: { trigger: el, start: 'top 85%' } }
    );
  });

  /* About right */
  qsa('.about-bio, .about-specs').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%' } }
    );
  });

  /* Experience entries - slide from right */
  qsa('.exp-entry').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', delay: i * 0.07,
        scrollTrigger: { trigger: el, start: 'top 87%' } }
    );
  });

  /* Skills */
  gsap.fromTo('.skills-text',
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-text', start: 'top 82%' } }
  );
  gsap.fromTo('.lang-badges',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.lang-badges', start: 'top 85%' } }
  );

  /* Contact lines */
  qsa('.contact-line').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: i === 0 ? 1 : 0.65, y: 0, duration: 1.1, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: { trigger: '.contact-title', start: 'top 80%' } }
    );
  });
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
burger   && burger.addEventListener('click',   () => mobMenu.classList.contains('open') ? closeMenu() : openMenu());
mobClose && mobClose.addEventListener('click', closeMenu);
qsa('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── SMOOTH SCROLL ── */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});
