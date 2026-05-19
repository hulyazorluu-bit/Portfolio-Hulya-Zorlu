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

/* ── Typewriter : élément texte simple ───────────────────────── */
function typewriterEl(el, text, charDelay, onDone) {
  el.textContent = '';
  el.style.opacity = '1';
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  cursor.textContent = '|';
  el.appendChild(cursor);
  let i = 0;
  (function type() {
    el.insertBefore(document.createTextNode(text[i]), cursor);
    i++;
    if (i < text.length) setTimeout(type, charDelay);
    else { cursor.remove(); if (onDone) onDone(); }
  })();
}

/* ── Typewriter : lien social avec SVG ───────────────────────── */
function typewriterSocial(el, charDelay, onDone) {
  const svg = el.querySelector('svg');
  let text = '';
  el.childNodes.forEach(n => { if (n.nodeType === Node.TEXT_NODE) text += n.textContent; });
  text = text.trim();
  while (el.firstChild) el.removeChild(el.firstChild);
  el.style.opacity = '1';
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  cursor.textContent = '|';
  el.appendChild(cursor);
  let i = 0;
  (function type() {
    el.insertBefore(document.createTextNode(text[i]), cursor);
    i++;
    if (i < text.length) {
      setTimeout(type, charDelay);
    } else {
      cursor.remove();
      el.appendChild(document.createTextNode(' '));
      if (svg) el.appendChild(svg);
      if (onDone) onDone();
    }
  })();
}

/* ── Reveal page après loader ────────────────────────────────── */
function revealPage() {

  /* 1 — Nav droite : typewriter gauche → droite (Projects en premier) */
  const navItems = [...document.querySelectorAll('.nav_right .nav_lk, .nav_right .nav_cta')];
  const navTexts = navItems.map(el => el.textContent.trim());
  navItems.forEach(el => { el.textContent = ''; });

  let navIdx = 0;
  function typeNextNav() {
    if (navIdx >= navItems.length) { setTimeout(revealNavLeft, 80); return; }
    const el = navItems[navIdx];
    const text = navTexts[navIdx++];
    typewriterEl(el, text, 55, typeNextNav);
  }
  typeNextNav();

  /* 2 — Nav gauche : scramble "HULYAZORLU_PAR" + clock apparaît */
  function revealNavLeft() {
    const navLeft = document.querySelector('.nav_left');
    if (navLeft) navLeft.style.opacity = '1';
    const brand = document.querySelector('.nav_brand');
    if (brand) scramble(brand, 'HULYAZORLU_PAR', { delay: 0, duration: 900 });
    const clock = document.querySelector('.nav_clock');
    if (clock) clock.style.opacity = '1';
  }

  /* 3 — Titre chars */
  document.querySelectorAll('.ttj').forEach((row, rowIdx) => {
    row.querySelectorAll('.char').forEach((ch, charIdx) => {
      ch.style.transitionDelay = `${rowIdx * 150 + charIdx * 55}ms`;
    });
    setTimeout(() => row.classList.add('act'), 100 + rowIdx * 150);
  });

  /* 4 — PORTFOLIO_26 + scroll */
  const portEl = document.getElementById('portfolio-txt');
  if (portEl) scramble(portEl, 'PORTFOLIO_26', { delay: 1400, duration: 1800 });
  const scrollEl = document.getElementById('scroll-txt');
  if (scrollEl) scramble(scrollEl, '[scroll to explore]', { delay: 1800, duration: 2400, loop: true });

  /* 5 — Socials : typewriter séquentiel après 500ms */
  const socials = [...document.querySelectorAll('.social_lk')];
  let socIdx = 0;
  function typeNextSocial() {
    if (socIdx >= socials.length) return;
    typewriterSocial(socials[socIdx++], 60, typeNextSocial);
  }
  setTimeout(typeNextSocial, 500);
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
