/* =============================================================
   HULYA ZORLU — Portfolio v20
   GSAP 3 · ScrollTrigger · Native scroll
   ============================================================= */

gsap.registerPlugin(ScrollTrigger);

/* ── Clock ─────────────────────────────────────────────────── */
(function initClock() {
  function tick() {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('fr', {
      timeZone: 'Europe/Paris',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = fmt.formatToParts(now);
    const h = parts.find(p => p.type === 'hour');
    const m = parts.find(p => p.type === 'minute');
    const hEl = document.getElementById('clock-h');
    const mEl = document.getElementById('clock-m');
    if (hEl && h) hEl.textContent = h.value;
    if (mEl && m) mEl.textContent = m.value;
  }
  tick();
  setInterval(tick, 30000);
})();

/* ── Loader ─────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const countEl = document.getElementById('loader-count');
  if (!loader || !countEl) return;

  let count = 0;
  const duration = 1800;
  const interval = 30;
  const steps = duration / interval;
  const inc = 100 / steps;

  const timer = setInterval(() => {
    count = Math.min(count + inc, 100);
    countEl.textContent = String(Math.floor(count)).padStart(3, '0');
    if (count >= 100) {
      clearInterval(timer);
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
        delay: 0.15,
        onComplete: () => {
          loader.style.display = 'none';
          revealAfterLoader();
        },
      });
    }
  }, interval);
})();

/* ── Post-loader reveals ─────────────────────────────────────── */
function revealAfterLoader() {
  /* Nav */
  gsap.to('.nav', { opacity: 1, duration: 0.6, ease: 'power2.out' });

  /* Hero title */
  gsap.to('.hero_tt', {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1,
    clearProps: 'opacity,transform',
  });

  /* Hero scroll hint + social links */
  gsap.to(['#hero-sc', '#hero-lk'], {
    opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4, stagger: 0.1,
  });

  /* Start clip-path reveals for projects */
  initProjectReveals();

  /* Generic fade-up reveals */
  initScrollReveals();
}

/* ── Project image clip-path reveal ─────────────────────────── */
function initProjectReveals() {
  document.querySelectorAll('.prj_img_clip').forEach(clip => {
    ScrollTrigger.create({
      trigger: clip,
      start: 'top 88%',
      once: true,
      onEnter: () => clip.classList.add('revealed'),
    });
  });
}

/* ── Generic scroll fade-up ──────────────────────────────────── */
function initScrollReveals() {
  const targets = [
    '.prjs_title',
    '.about_tp',
    '.about_bp',
    '.exp_row',
    '.about_skills',
    '.footer_cm',
    '.footer_lk',
    '.footer_cr',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-fade', '');
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        },
      });
    });
  });
}

/* ── Mobile menu ─────────────────────────────────────────────── */
(function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mob-menu');
  const close  = document.getElementById('mob-close');

  function open() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', open);
  if (close)  close.addEventListener('click', closeMenu);

  menu && menu.querySelectorAll('.mob-link').forEach(l =>
    l.addEventListener('click', closeMenu)
  );
})();
