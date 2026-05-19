/* =============================================================
   HULYA ZORLU — Portfolio v34
   Clock · Title char reveal · CSS Typewriter · Mobile menu
   ============================================================= */

/* ── Clock — Paris time ──────────────────────────────────────── */
(function initClock() {
  const twEl = document.getElementById('clock-tw');
  if (!twEl) return;

  let triggered = false;

  function getTimeString() {
    const parts = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(new Date());

    const h  = parts.find(p => p.type === 'hour')?.value   || '00';
    const m  = parts.find(p => p.type === 'minute')?.value || '00';
    const dp = parts.find(p => p.type === 'dayPeriod')?.value || '';
    return `${h}:${m} ${dp.toUpperCase()}`;
  }

  /* Called by revealPage once nav-left becomes visible */
  window.triggerClockTypewriter = function() {
    if (triggered) return;
    triggered = true;
    const timeStr = getTimeString();
    twEl.textContent = timeStr; /* same length as placeholder — no layout shift */
    twEl.style.clipPath = 'inset(0 100% 0 0)'; /* reset clip before animation */
    void twEl.offsetWidth;
    triggerTypewriter(twEl, 13, null);
  };

  /* Keep clock live after initial reveal */
  function tick() {
    if (triggered) twEl.textContent = getTimeString();
  }
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => { tick(); setInterval(tick, 60000); }, msToNextMinute);
})();


/* ── Loader — progress réel selon navigateur / connexion ─────── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const countEl = document.getElementById('loader-count');
  if (!loader || !countEl) { revealPage(); return; }

  const line1El = document.getElementById('loader-line1');
  const line2El = document.getElementById('loader-line2');
  const TEXT1   = 'Hulya Zorlu';
  const TEXT2   = 'UI_UX_Designer_Portfolio';

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

  const START   = Date.now();
  const MIN_MS  = 1400;
  let displayed = 0;
  let closed    = false;

  function setDisplay(n) {
    n = Math.min(Math.floor(n), 100);
    if (n > displayed) {
      displayed = n;
      countEl.textContent = String(displayed).padStart(3, '0');
    }
  }

  /* Vitesse de base selon la connexion détectée */
  const connType = navigator.connection?.effectiveType || '4g';
  const pctPerSec = connType === '4g' ? 38 : connType === '3g' ? 22 : 14;

  /* Compteur progressif depuis 000 — toujours */
  const baseline = setInterval(() => {
    const elapsed = (Date.now() - START) / 1000;
    /* progression naturelle avec petite irrégularité */
    const jitter = (Math.random() - 0.5) * 4;
    setDisplay(Math.min(elapsed * pctPerSec + jitter, 72)); /* plafond 72 avant load */
  }, 60);

  /* Quand tout est chargé : sauts irréguliers vers 100 */
  function finalize() {
    if (closed) return;
    clearInterval(baseline);
    const jump = setInterval(() => {
      setDisplay(displayed + Math.ceil(Math.random() * 10 + 2));
      if (displayed >= 100) {
        clearInterval(jump);
        closed = true;
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; revealPage(); }, 700);
        }, 150);
      }
    }, 38);
  }

  window.addEventListener('load', () => {
    if (Date.now() - START >= MIN_MS) { finalize(); }
    else { setTimeout(finalize, MIN_MS - (Date.now() - START)); }
  });

  /* Fallback 8s */
  setTimeout(() => { if (!closed) finalize(); }, 8000);
})();


/* ── CSS Typewriter trigger ───────────────────────────────────── */
/* Uses clip-path animation — element keeps natural width (no layout shift) */
function triggerTypewriter(twEl, charsPerSec, onDone) {
  const charCount = twEl.textContent.length;
  if (charCount === 0) { if (onDone) onDone(); return; }
  const duration = charCount / charsPerSec;
  twEl.style.animation = `typing ${duration}s steps(${charCount}, end) forwards`;

  const container = twEl.closest('.typewriter-container');
  if (container) container.style.opacity = '1';

  setTimeout(() => {
    if (container) container.classList.add('done');
    if (onDone) onDone();
  }, duration * 1000 + 60);
}

/* ── Scramble text ────────────────────────────────────────────── */
const GLYPHS = '&$*@)]}=|%·(){+/9}[·@$)';

function scramble(el, finalText, { delay = 0, duration = 1200, loop = false, loopPause = 4000 } = {}) {
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
      if (loop) setTimeout(() => { frame = 0; scramble(el, finalText, { delay: 0, duration, loop, loopPause }); }, loopPause);
    }
  }

  setTimeout(() => requestAnimationFrame(render), delay);
}


/* ── Reveal page after loader ─────────────────────────────────── */
function revealPage() {
  const SPEED = 22; /* chars/sec — snappy but readable */

  /* 1 — Nav right: typewriter links simultaneously */
  document.querySelectorAll('.nav_lk .typewriter').forEach(twEl => {
    triggerTypewriter(twEl, SPEED, null);
  });

  /* LETS TALK: fade in + sand scramble simultaneously */
  const cta = document.querySelector('.nav_cta');
  const ctaText = document.getElementById('cta-text');
  if (cta && ctaText) {
    cta.style.opacity = '1';
    scramble(ctaText, 'LETS TALK', { delay: 0, duration: 700 });
  }

  /* 2 — Nav left: brand scramble + clock simultaneously with nav right */
  const navLeft = document.querySelector('.nav_left');
  if (navLeft) navLeft.style.opacity = '1';

  const brandTw = document.getElementById('brand-tw');
  if (brandTw) {
    const container = brandTw.closest('.typewriter-container');
    brandTw.style.clipPath = 'inset(0 0% 0 0)'; /* full visible for scramble */
    if (container) { container.style.opacity = '1'; container.classList.add('done'); }
    scramble(brandTw, 'HULYAZORLU_PAR', { delay: 0, duration: 650 });
  }

  if (window.triggerClockTypewriter) {
    const clockContainer = document.getElementById('clock-tw-container');
    if (clockContainer) clockContainer.style.opacity = '1';
    window.triggerClockTypewriter();
  }

  /* 3 — Socials: all simultaneously with nav */
  document.querySelectorAll('.hero_socials .social_lk').forEach(link => {
    link.style.opacity = '1';
  });
  document.querySelectorAll('.hero_socials .typewriter').forEach(twEl => {
    triggerTypewriter(twEl, SPEED, null);
  });

  /* 4 — Title chars (unchanged) */
  document.querySelectorAll('.ttj').forEach((row, rowIdx) => {
    row.querySelectorAll('.char').forEach((ch, charIdx) => {
      ch.style.transitionDelay = `${rowIdx * 150 + charIdx * 55}ms`;
    });
    setTimeout(() => row.classList.add('act'), 100 + rowIdx * 150);
  });

  /* 5 — Subtitle "UI/UX Designer / Based in Paris": dissolve */
  const tt3 = document.querySelector('.tt3');
  if (tt3) setTimeout(() => tt3.classList.add('visible'), 300);

  /* 6 — PORTFOLIO_26 + scroll: même timing */
  const portTw = document.querySelector('#portfolio-txt .typewriter');
  const scrollEl = document.getElementById('scroll-txt');

  setTimeout(() => {
    if (portTw) triggerTypewriter(portTw, SPEED, null);

    if (scrollEl) {
      scrollEl.style.opacity = '1';
      scramble(scrollEl, '[scroll to explore]', { duration: 2600, loop: true, loopPause: 1800 });
    }
  }, 1400);
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
