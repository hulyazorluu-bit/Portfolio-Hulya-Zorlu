/* =========================================================
   HULYA ZORLU — Portfolio JS (Eva Sanchez style)
   GSAP 3 + ScrollTrigger + custom effects
   ========================================================= */

gsap.registerPlugin(ScrollTrigger);

const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

/* ── UTILS ── */
const isMobile = () => window.innerWidth < 768;
const GLYPHS = '$&@*()]=+#|/%.€~!?§¶';

/* ── MOUSE CURSOR ── */
const cursor = qs('#cursor');
let mx = 0, my = 0, cx = 0, cy = 0;

if (!isMobile()) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function cursorLoop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    }
    requestAnimationFrame(cursorLoop);
  })();

  /* Grow on links / buttons */
  qsa('a, button, .cnt_prj').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('grow'));
  });

  /* Dark cursor over dark sections */
  qsa('.home_about, .footer').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter:     () => cursor && cursor.classList.add('dark'),
      onLeave:     () => cursor && cursor.classList.remove('dark'),
      onEnterBack: () => cursor && cursor.classList.add('dark'),
      onLeaveBack: () => cursor && cursor.classList.remove('dark'),
    });
  });
}

/* ── SCRAMBLE TEXT EFFECT ── */
function scramble(el, finalText, duration = 600) {
  const chars = finalText.split('');
  let frame = 0;
  const totalFrames = Math.floor(duration / 30);
  const id = setInterval(() => {
    el.textContent = chars.map((ch, i) => {
      if (ch === ' ') return ' ';
      if (frame / totalFrames > i / chars.length) return ch;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }).join('');
    if (++frame >= totalFrames) {
      el.textContent = finalText;
      clearInterval(id);
    }
  }, 30);
}

function initScrambleLinks() {
  qsa('.Awrite').forEach(link => {
    const textNodes = [...link.childNodes].filter(n => n.nodeType === 3);
    if (!textNodes.length) return;
    const original = textNodes[0].textContent.trim();
    if (!original) return;
    link.dataset.original = original;

    link.addEventListener('mouseenter', function() {
      scramble(textNodes[0], original, 450);
    });
  });
}

/* ── CLOCK (Paris) ── */
function updateClock() {
  const now = new Date();
  const h = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', hour12: false });
  const m = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', minute: '2-digit' });
  const elH = qs('#clock-h');
  const elM = qs('#clock-m');
  if (elH) elH.textContent = h.padStart(2, '0');
  if (elM) elM.textContent = m.padStart(2, '0');
}
updateClock();
setInterval(updateClock, 10000);

/* ── LOADER ── */
(function initLoader() {
  const loader  = qs('#loader');
  const counter = qs('#loader-counter');
  if (!loader || !counter) return;

  const obj = { val: 0 };
  gsap.to(obj, {
    val: 100,
    duration: 2.2,
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

/* ── PAGE REVEAL ── */
function revealPage() {
  /* Hero name slides up */
  gsap.to('#hero-hulya', {
    y: '0%', opacity: 1,
    duration: 1.1, ease: 'power3.out', delay: 0.05
  });
  gsap.to('#hero-zorlu', {
    y: '0%', opacity: 1,
    duration: 1.1, ease: 'power3.out', delay: 0.2
  });

  /* Role + label fade in */
  gsap.to('#hero-role', {
    opacity: 1, y: 0,
    duration: 0.9, ease: 'power3.out', delay: 0.5
  });
  gsap.to('#hero-label', {
    opacity: 0.45, y: 0,
    duration: 0.9, ease: 'power3.out', delay: 0.65
  });

  /* Scroll text */
  gsap.to('#scroll-text', {
    opacity: 0.5, duration: 0.7, delay: 0.9
  });

  /* Social links */
  gsap.to('#hero-links a', {
    opacity: 0.65, y: 0,
    duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.8
  });

  /* Nav */
  gsap.fromTo('.nav_top > *', { opacity: 0, y: -6 }, {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.3
  });

  /* Init scroll-based animations */
  initScrollAnimations();
  initScrambleLinks();
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {

  /* Nav background on scroll */
  ScrollTrigger.create({
    start: 'top -30',
    onEnter:     () => qs('.nav').classList.add('scrolled'),
    onLeaveBack: () => qs('.nav').classList.remove('scrolled')
  });

  /* Featured title */
  gsap.fromTo('#feat-title',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#feat-title', start: 'top 88%' } }
  );

  /* Project image reveals */
  qsa('.cnt_prj_im').forEach(el => {
    gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.3, ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  /* Project text labels */
  qsa('.cnt_prj_t h3').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%' } }
    );
  });

  /* About section headline */
  gsap.to('#about-tp', {
    opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#about-tp', start: 'top 82%' }
  });

  /* About bio text */
  gsap.to('#about-bio', {
    opacity: 0.75, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#about-bio', start: 'top 86%' }
  });

  /* Portrait image clip reveal */
  const img = qs('#about-img');
  if (img) {
    ScrollTrigger.create({
      trigger: img,
      start: 'top 82%',
      onEnter: () => img.classList.add('revealed'),
    });
  }

  /* Footer "Get in touch" slide in */
  gsap.fromTo('.footer_cm a',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer_cm', start: 'top 85%' } }
  );

  /* Footer links */
  gsap.fromTo('.footer .cnt_lk a',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer .cnt_lk', start: 'top 90%' } }
  );
}

/* ── DISTORTION on hero name (desktop only) ── */
if (!isMobile()) {
  const distortEls = qsa('#hero-hulya, #hero-zorlu');
  (function distortLoop() {
    distortEls.forEach(el => {
      if (Math.random() > 0.985) {
        const x    = (Math.random() - 0.5) * 5;
        const skew = (Math.random() - 0.5) * 4;
        el.style.transform = `translate(${x}px,0) skewX(${skew}deg)`;
        setTimeout(() => { el.style.transform = ''; }, 60 + Math.random() * 80);
      }
    });
    requestAnimationFrame(distortLoop);
  })();
}

/* ── MOBILE MENU ── */
const burger  = qs('#burger');
const mobMenu = qs('#mob-menu');
const mobClose= qs('#mob-close');

function openMenu() {
  mobMenu && mobMenu.classList.add('open');
  mobMenu && mobMenu.setAttribute('aria-hidden', 'false');
  burger  && burger.classList.add('open');
  burger  && burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobMenu && mobMenu.classList.remove('open');
  mobMenu && mobMenu.setAttribute('aria-hidden', 'true');
  burger  && burger.classList.remove('open');
  burger  && burger.setAttribute('aria-expanded', 'false');
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

/* ── PROJECT CARD CURSOR TEXT ── */
qsa('.cnt_prj').forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (cursor) {
      cursor.classList.add('grow');
    }
  });
  card.addEventListener('mouseleave', () => {
    if (cursor) cursor.classList.remove('grow');
  });
});
