/* =============================================================
   HULYA ZORLU — Portfolio v22
   Clock · Title char reveal · Scramble text · Mobile menu
   ============================================================= */

/* ── Clock — Paris time ──────────────────────────────────────── */
(function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;

  function tick() {
    const parts = new Intl.DateTimeFormat('fr', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(new Date());

    const h  = parts.find(p => p.type === 'hour')?.value   || '00';
    const m  = parts.find(p => p.type === 'minute')?.value || '00';
    const dp = parts.find(p => p.type === 'dayPeriod')?.value || '';
    el.textContent = `${h}:${m} ${dp.toUpperCase()}`;
  }

  tick();
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => { tick(); setInterval(tick, 60000); }, msToNextMinute);
})();


/* ── Loader 000 → 100 + typewriter texte ─────────────────────── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const countEl = document.getElementById('loader-count');
  if (!loader || !countEl) { revealPage(); return; }

  /* ── Typewriter sur les 2 lignes du bas ── */
  const line1El = document.getElementById('loader-line1');
  const line2El = document.getElementById('loader-line2');
  const TEXT1   = 'Hulya Zorlu';
  const TEXT2   = 'UI_UX_Designer_Portfolio';

  /* Durée totale : 2200ms → compteur atteint 042 à ~2200ms
     Line1 : 11 chars × 58ms = 638ms (finie à 638ms)
     Gap   : 80ms
     Line2 : 24 chars × 61ms = 1464ms (démarre à 718ms, finie à 2182ms) ✓ */
  function typeWriter(el, text, charDelay, startDelay) {
    if (!el) return;
    let i = 0;
    setTimeout(function type() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, charDelay);
    }, startDelay);
  }

  typeWriter(line1El, TEXT1, 58, 0);
  typeWriter(line2El, TEXT2, 61, 718);

  /* ── Compteur 000 → 042 ── */
  let count = 0;
  const maxCount = 42;
  const duration = 2200;
  const tickMs   = 30;
  const steps    = duration / tickMs;
  const inc      = maxCount / steps;

  const timer = setInterval(() => {
    count = Math.min(count + inc, maxCount);
    countEl.textContent = String(Math.floor(count)).padStart(3, '0');

    if (count >= maxCount) {
      clearInterval(timer);
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          revealPage();
        }, 700);
      }, 200);
    }
  }, tickMs);
})();

/* ── Reveal page après loader ────────────────────────────────── */
function revealPage() {

  /* 1 — Nav : droite → gauche
     On récupère les items de droite (CTA en premier) puis les links en ordre inverse */
  const navRight = document.querySelectorAll('.nav_right .nav_lk, .nav_right .nav_cta');
  const navLeft  = document.querySelector('.nav_left');

  /* Les items de droite apparaissent de droite à gauche (CTA, Skills, Experience, About, Projects) */
  const rightItems = Array.from(navRight).reverse(); /* inverse = du plus à droite au plus à gauche */
  rightItems.forEach((el, i) => {
    setTimeout(() => el.classList.add('nav-in'), i * 80);
  });

  /* Nav gauche apparaît après les liens de droite */
  const navLeftDelay = rightItems.length * 80 + 80;
  setTimeout(() => { if (navLeft) navLeft.classList.add('nav-in'); }, navLeftDelay);

  /* 2 — Titre : commence avec la nav */
  document.querySelectorAll('.ttj').forEach((row, rowIdx) => {
    row.querySelectorAll('.char').forEach((ch, charIdx) => {
      ch.style.transitionDelay = `${rowIdx * 150 + charIdx * 55}ms`;
    });
    setTimeout(() => row.classList.add('act'), 100 + rowIdx * 150);
  });

  /* 3 — PORTFOLIO_26 et scroll : apparaissent après le titre */
  const portEl = document.getElementById('portfolio-txt');
  if (portEl) scramble(portEl, 'PORTFOLIO_26', { delay: 1400, duration: 1800 });

  const scrollEl = document.getElementById('scroll-txt');
  if (scrollEl) scramble(scrollEl, '[scroll to explore]', { delay: 1800, duration: 2400, loop: true });
}


/* ── Scramble text (Eva Sánchez Awrite style) ────────────────── */
const GLYPHS = '&$*@)]}=|%·(){+/9}[·@$)';

function scramble(el, finalText, { delay = 0, duration = 1200, loop = false } = {}) {
  const chars = finalText.split('');
  const totalFrames = Math.ceil(duration / 40);
  let frame = 0;

  function render() {
    const progress = frame / totalFrames;
    el.textContent = chars.map((ch, i) =>
      progress > i / chars.length
        ? ch
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    ).join('');

    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(render);
    } else {
      el.textContent = finalText;
      if (loop) setTimeout(() => { frame = 0; scramble(el, finalText, { delay: 0, duration, loop }); }, 4000);
    }
  }

  setTimeout(() => requestAnimationFrame(render), delay);
}

/* ── Mobile menu ─────────────────────────────────────────────── */
(function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mob-menu');
  const close  = document.getElementById('mob-close');
  if (!burger || !menu) return;

  function openMenu() {
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

  burger.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  menu.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
})();
