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
    const parts = new Intl.DateTimeFormat('fr', {
      timeZone: 'Europe/Paris',
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
    twEl.textContent = timeStr;
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

  const START    = Date.now();
  const MIN_MS   = 1400; /* affichage minimum même si tout est déjà en cache */
  let displayed  = 0;
  let pageLoaded = false;
  let closed     = false;

  function setDisplay(n) {
    n = Math.min(Math.floor(n), 100);
    if (n > displayed) {
      displayed = n;
      countEl.textContent = String(displayed).padStart(3, '0');
    }
  }

  /* Progression basée sur les ressources réellement chargées */
  function resourceProgress() {
    const entries = performance.getEntriesByType('resource');
    if (!entries.length) return 0;
    const done = entries.filter(e => e.responseEnd > 0).length;
    return (done / entries.length) * 88; /* jusqu'à 88 % via ressources */
  }

  /* Observer les nouvelles ressources en temps réel */
  if (window.PerformanceObserver) {
    try {
      new PerformanceObserver(() => setDisplay(resourceProgress()))
        .observe({ entryTypes: ['resource'] });
    } catch (_) {}
  }

  /* Tick léger pour maintenir le progrès à jour */
  const pulse = setInterval(() => {
    setDisplay(resourceProgress());
    if (pageLoaded && Date.now() - START >= MIN_MS) {
      clearInterval(pulse);
      finalize();
    }
  }, 80);

  /* Quand tout est chargé : sauter jusqu'à 100 puis fermer */
  function finalize() {
    if (closed) return;
    const jump = setInterval(() => {
      /* sauts irréguliers : connexion rapide → gros sauts */
      setDisplay(displayed + Math.ceil(Math.random() * 9 + 2));
      if (displayed >= 100) {
        clearInterval(jump);
        closed = true;
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; revealPage(); }, 700);
        }, 150);
      }
    }, 35);
  }

  window.addEventListener('load', () => {
    pageLoaded = true;
    setDisplay(resourceProgress());
    if (Date.now() - START >= MIN_MS) { clearInterval(pulse); finalize(); }
  });

  /* Fallback si load ne se déclenche pas dans les 8s */
  setTimeout(() => { if (!closed) { pageLoaded = true; clearInterval(pulse); finalize(); } }, 8000);
})();


/* ── CSS Typewriter trigger ───────────────────────────────────── */
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


/* ── CSS Typewriter loop (type → pause → reset → repeat) ────────── */
function loopTypewriter(twEl, charsPerSec) {
  const container = twEl.closest('.typewriter-container');
  if (container) container.style.opacity = '1';

  function cycle() {
    const charCount = twEl.textContent.length;
    const typeDuration = charCount / charsPerSec; /* ~0.85s for 19 chars */

    /* show cursor while typing */
    if (container) container.classList.remove('done');

    twEl.style.animation = 'none';
    twEl.style.width = '0';

    /* force reflow so CSS picks up the reset */
    void twEl.offsetWidth;

    twEl.style.animation = `typing ${typeDuration}s steps(${charCount}, end) forwards`;

    /* after fully typed: pause 2.5s, then wipe and loop */
    setTimeout(() => {
      if (container) container.classList.add('done'); /* hide cursor during pause */
      setTimeout(() => {
        twEl.style.animation = 'none';
        twEl.style.width = '0';
        void twEl.offsetWidth;
        cycle();
      }, 2500);
    }, typeDuration * 1000 + 60);
  }

  cycle();
}

/* ── Scramble text ────────────────────────────────────────────── */
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
    brandTw.style.width = '100%';
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

  /* 6 — PORTFOLIO_26 + scroll: delay built into scramble call (v26 style) */
  const portTw = document.querySelector('#portfolio-txt .typewriter');
  if (portTw) setTimeout(() => triggerTypewriter(portTw, SPEED, null), 1400);

  const scrollEl = document.getElementById('scroll-txt');
  if (scrollEl) scramble(scrollEl, '[scroll to explore]', { delay: 1800, duration: 2400, loop: true });
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
