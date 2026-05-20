/* =============================================================
   HULYA ZORLU — Portfolio v35
   Clock · Char reveal (.cn/.cf) · CSS Typewriter (clock+portfolio)
   Mobile menu
   ============================================================= */

/* ── Char animation constants ─────────────────────────────────── */
const FAKE_CHARS = '##·$%&/=€|()@+09*+]}{[';
function rndFake() {
  return FAKE_CHARS[Math.floor(Math.random() * FAKE_CHARS.length)];
}

/* ── Init title chars early — prevent text flash during loader ── */
(function initTitleChars() {
  document.querySelectorAll('.ttj .char').forEach(charEl => {
    const letter = charEl.textContent;
    if (!letter.trim()) return;
    charEl.innerHTML = '';
    const cn = document.createElement('span'); cn.className = 'cn'; cn.textContent = letter;
    const cf = document.createElement('span'); cf.className = 'cf';
    cf.setAttribute('aria-hidden', 'true'); cf.textContent = rndFake();
    charEl.appendChild(cn); charEl.appendChild(cf);
  });
})();


/* ── Clock — visitor's local time ────────────────────────────── */
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

  window.triggerClockTypewriter = function() {
    if (triggered) return;
    triggered = true;
    const timeStr = getTimeString();
    twEl.textContent = timeStr;
    twEl.style.clipPath = 'inset(0 100% 0 0)';
    void twEl.offsetWidth;
    triggerTypewriter(twEl, 13, null);
  };

  function tick() {
    if (triggered) twEl.textContent = getTimeString();
  }
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => { tick(); setInterval(tick, 60000); }, msToNextMinute);
})();


/* ── Loader ───────────────────────────────────────────────────── */
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

  const connType = navigator.connection?.effectiveType || '4g';
  const pctPerSec = connType === '4g' ? 38 : connType === '3g' ? 22 : 14;

  const baseline = setInterval(() => {
    const elapsed = (Date.now() - START) / 1000;
    const jitter = (Math.random() - 0.5) * 4;
    setDisplay(Math.min(elapsed * pctPerSec + jitter, 72));
  }, 60);

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

  setTimeout(() => { if (!closed) finalize(); }, 8000);
})();


/* ── CSS Typewriter — for clock + PORTFOLIO_26 only ──────────── */
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


/* ── Char animation (.cn / .cf) ───────────────────────────────── */

/* Split element text into .cw > (.cn + .cf) spans, return array of .cw */
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  const charEls = [];
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
    } else {
      const cw = document.createElement('span');
      cw.className = 'cw';
      const cn = document.createElement('span');
      cn.className = 'cn';
      cn.textContent = ch;
      const cf = document.createElement('span');
      cf.className = 'cf';
      cf.setAttribute('aria-hidden', 'true');
      cf.textContent = rndFake();
      cw.appendChild(cn);
      cw.appendChild(cf);
      el.appendChild(cw);
      charEls.push(cw);
    }
  }
  return charEls;
}

/* Stagger .done on an array of .cw/.char elements */
function revealChars(charEls, { stagger = 50, onDone } = {}) {
  charEls.forEach((cw, i) => {
    setTimeout(() => cw.classList.add('done'), i * stagger);
  });
  if (onDone && charEls.length > 0) {
    setTimeout(onDone, (charEls.length - 1) * stagger + 400);
  } else if (onDone) {
    onDone();
  }
}

/* Split and reveal a .typewriter span via char animation */
function charReveal(twEl, { stagger = 50, onDone } = {}) {
  const container = twEl.closest('.typewriter-container');
  if (container) {
    container.style.opacity = '1';
    container.classList.add('done'); /* suppress blinking cursor */
  }
  const charEls = splitChars(twEl);
  revealChars(charEls, { stagger, onDone });
}

/* One-shot char reveal for scroll to explore — cursor stays blinking after */
function scrollReveal(el, text, { stagger = 50 } = {}) {
  el.textContent = text;
  const charEls = splitChars(el);
  revealChars(charEls, {
    stagger,
    onDone: () => {
      const cursor = document.createElement('span');
      cursor.className = 'tw-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.textContent = '|';
      el.appendChild(cursor);
    },
  });
}


/* ── Reveal page after loader ─────────────────────────────────── */
function revealPage() {
  const STAGGER = 50;

  /* 1 — Nav right: char reveal simultaneously */
  document.querySelectorAll('.nav_lk .typewriter').forEach(twEl => {
    charReveal(twEl, { stagger: STAGGER });
  });

  /* LETS TALK: fade in + char reveal */
  const cta = document.querySelector('.nav_cta');
  const ctaText = document.getElementById('cta-text');
  if (cta && ctaText) {
    cta.style.opacity = '1';
    const charEls = splitChars(ctaText);
    revealChars(charEls, { stagger: STAGGER });
  }

  /* 2 — Nav left: brand char reveal + clock typewriter simultaneously */
  const navLeft = document.querySelector('.nav_left');
  if (navLeft) navLeft.style.opacity = '1';

  const brandTw = document.getElementById('brand-tw');
  if (brandTw) charReveal(brandTw, { stagger: 40 });

  if (window.triggerClockTypewriter) {
    const clockContainer = document.getElementById('clock-tw-container');
    if (clockContainer) clockContainer.style.opacity = '1';
    window.triggerClockTypewriter();
  }

  /* 3 — Socials: char reveal simultaneously */
  document.querySelectorAll('.hero_socials .social_lk').forEach(link => {
    link.style.opacity = '1';
  });
  document.querySelectorAll('.hero_socials .typewriter').forEach(twEl => {
    charReveal(twEl, { stagger: STAGGER });
  });

  /* 4 — Title chars: stagger .done row by row */
  document.querySelectorAll('.ttj').forEach((row, rowIdx) => {
    row.querySelectorAll('.char').forEach((ch, charIdx) => {
      setTimeout(() => ch.classList.add('done'), rowIdx * 150 + charIdx * 55);
    });
  });

  /* 5 — Subtitle: dissolve */
  const tt3 = document.querySelector('.tt3');
  if (tt3) setTimeout(() => tt3.classList.add('visible'), 300);

  /* 6 — PORTFOLIO_26 + scroll after 1400ms */
  const portTw = document.querySelector('#portfolio-txt .typewriter');
  const scrollEl = document.getElementById('scroll-txt');

  setTimeout(() => {
    if (portTw) triggerTypewriter(portTw, 22, null);

    if (scrollEl) {
      scrollEl.style.opacity = '1';
      scrollReveal(scrollEl, '[scroll to explore]', { stagger: 45 });
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
