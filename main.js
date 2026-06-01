/* =============================================================
   HULYA ZORLU — Portfolio v36
   Clock · Char reveal (nav/socials) · Smooth title · Scramble scroll
   Mobile menu
   ============================================================= */

/* ── Language ────────────────────────────────────────────────── */
(function initLang() {
  const lang = localStorage.getItem('lang') || 'en';
  document.documentElement.className = 'lang-' + lang;

  function applyLang(l) {
    localStorage.setItem('lang', l);
    document.documentElement.className = 'lang-' + l;
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === l);
    });
    /* CTA — reset text & re-split chars instantly */
    const ctaEl = document.getElementById('cta-text');
    if (ctaEl) {
      ctaEl.textContent = l === 'fr' ? 'PARLONS' : 'LETS TALK';
      const cws = splitChars(ctaEl);
      cws.forEach(cw => cw.classList.add('done'));
    }
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn) applyLang(btn.dataset.lang);
  });

  /* Mark active button once DOM ready */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  });
})();

/* ── Char animation constants ─────────────────────────────────── */
const FAKE_CHARS = '##·$%&/=€|()@+09*+]}{[';
function rndFake() {
  return FAKE_CHARS[Math.floor(Math.random() * FAKE_CHARS.length)];
}


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


/* ── CSS Typewriter — clock + PORTFOLIO_26 ────────────────────── */
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


/* ── Scramble — initial scroll reveal ────────────────────────── */
const GLYPHS = '&$*@)]}=|%·(){+/9}[·@$)';

function scramble(el, finalText, { delay = 0, duration = 1200 } = {}) {
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
    if (frame <= totalFrames) requestAnimationFrame(render);
    else el.textContent = finalText;
  }

  setTimeout(() => requestAnimationFrame(render), delay);
}

/* ── Scroll ticker — 1 special char at a time, loops ─────────── */
function scrollTicker(el, text, { charDelay = 45, pause = 2000 } = {}) {
  const chars = text.split('');
  const start = 1;                  /* skip '[' */
  const end   = chars.length - 2;  /* skip ']' */
  let pos = start;

  function next() {
    if (pos <= end) {
      el.textContent = chars.map((ch, i) =>
        i === pos ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : ch
      ).join('');
      pos++;
      setTimeout(next, charDelay);
    } else {
      el.textContent = text;
      pos = start;
      setTimeout(next, pause);
    }
  }

  setTimeout(next, 1000);
}


/* ── Char animation (.cn / .cf) — nav + socials ───────────────── */

function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  const charEls = [];
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
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

function revealChars(charEls, { stagger = 30, onDone } = {}) {
  charEls.forEach((cw, i) => {
    setTimeout(() => cw.classList.add('done'), i * stagger);
  });
  if (onDone && charEls.length > 0) {
    setTimeout(onDone, (charEls.length - 1) * stagger + 300);
  } else if (onDone) {
    onDone();
  }
}

function charReveal(twEl, { stagger = 30, onDone } = {}) {
  const container = twEl.closest('.typewriter-container');
  if (container) {
    container.style.opacity = '1';
    container.classList.add('done');
  }
  const charEls = splitChars(twEl);
  revealChars(charEls, { stagger, onDone });
}


/* ── Reveal page after loader ─────────────────────────────────── */
function revealPage() {
  const STAGGER = 28;

  /* 1 — Nav right: char reveal simultaneously */
  document.querySelectorAll('.nav_lk .typewriter').forEach(twEl => {
    charReveal(twEl, { stagger: STAGGER });
  });

  /* LETS TALK: fade in + char reveal */
  const cta = document.querySelector('.nav_cta');
  const ctaText = document.getElementById('cta-text');
  if (cta && ctaText) {
    const _lang = localStorage.getItem('lang') || 'en';
    ctaText.textContent = _lang === 'fr' ? 'PARLONS' : 'LETS TALK';
    cta.style.opacity = '1';
    const charEls = splitChars(ctaText);
    revealChars(charEls, { stagger: STAGGER });
  }

  /* 2 — Nav left: brand char reveal + clock typewriter simultaneously */
  const navLeft = document.querySelector('.nav_left');
  if (navLeft) navLeft.style.opacity = '1';

  const brandTw = document.getElementById('brand-tw');
  if (brandTw) charReveal(brandTw, { stagger: 28 });

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

  /* 4 — Title: smooth opacity stagger, no fake chars */
  document.querySelectorAll('.ttj').forEach((row, rowIdx) => {
    row.querySelectorAll('.char').forEach((ch, charIdx) => {
      setTimeout(() => ch.classList.add('act'), rowIdx * 160 + charIdx * 60);
    });
  });

  /* 5 — Subtitle: dissolve */
  const tt3 = document.querySelector('.tt3');
  if (tt3) setTimeout(() => tt3.classList.add('visible'), 350);

  /* 6 — PORTFOLIO_26 + scroll after 1400ms */
  const portTw = document.querySelector('#portfolio-txt .typewriter');
  const scrollEl = document.getElementById('scroll-txt');

  setTimeout(() => {
    if (portTw) triggerTypewriter(portTw, 22, null);

    if (scrollEl) {
      const SCROLL_TEXT = '[scroll to explore]';
      const INIT_DUR = 2600;
      scrollEl.style.opacity = '1';
      scramble(scrollEl, SCROLL_TEXT, { duration: INIT_DUR });
      setTimeout(() => scrollTicker(scrollEl, SCROLL_TEXT), INIT_DUR + 60);
    }
  }, 900);
}


/* ── Experience item description reveal on hover ─────────────── */
(function initXpReveal() {
  document.querySelectorAll('.xp_item').forEach(item => {
    const revealEl = item.querySelector('.xp_reveal');
    if (!revealEl) return;
    const desc = item.dataset.desc || '';
    revealEl.textContent = desc;
  });
})();


/* ── Work labels char reveal on scroll ───────────────────────── */
(function initWorkLabels() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const meta = entry.target.querySelector('.work_meta');
      if (!meta) return;
      meta.style.opacity = '1';

      ['.work_num', '.work_name'].forEach((sel, i) => {
        const el = meta.querySelector(sel);
        if (!el) return;
        setTimeout(() => {
          const chars = splitChars(el);
          revealChars(chars, { stagger: 28 });
        }, i * 90);
      });
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.work_item').forEach(item => observer.observe(item));
})();




/* ── SEE MORE cursor ─────────────────────────────────────────── */
(function initSeeCursor() {
  const cursor = document.getElementById('see-cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('.work_thumb').forEach(thumb => {
    thumb.addEventListener('mouseenter', () => cursor.classList.add('visible'));
    thumb.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  });
})();


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


/* ── Title lens refraction ───────────────────────────────────────── */
(function initTitleRefraction() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const chars = [...document.querySelectorAll('.ttj .char')];
  if (!chars.length) return;

  const RADIUS    = 150;  /* px — zone d'influence */
  const INTENSITY = 18;   /* px — déplacement max  */
  const LERP      = 0.15; /* fluidité du retour    */

  const state = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
  let centers = [];
  let raf     = null;
  let active  = false;

  function cachePositions() {
    centers = chars.map(ch => {
      const r = ch.getBoundingClientRect();
      return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
    });
  }

  function tick() {
    let anyMoving = false;
    chars.forEach((ch, i) => {
      const s = state[i];
      s.x += (s.tx - s.x) * LERP;
      s.y += (s.ty - s.y) * LERP;
      const ax = Math.abs(s.x), ay = Math.abs(s.y);
      if (ax > 0.04 || ay > 0.04) {
        ch.style.transform = `translate(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px)`;
        anyMoving = true;
      } else {
        s.x = 0; s.y = 0;
        ch.style.transform = '';
      }
    });
    if (active || anyMoving) raf = requestAnimationFrame(tick);
    else raf = null;
  }

  function onMove(e) {
    if (!active) {
      active = true;
      cachePositions();
      chars.forEach(ch => (ch.style.willChange = 'transform'));
      if (!raf) raf = requestAnimationFrame(tick);
    }
    const mx = e.clientX, my = e.clientY;
    chars.forEach((_, i) => {
      const dx  = centers[i].x - mx;
      const dy  = centers[i].y - my;
      const d2  = dx * dx + dy * dy;
      const g   = Math.exp(-d2 / (2 * RADIUS * RADIUS));
      const len = Math.sqrt(d2) || 1;
      state[i].tx = (dx / len) * INTENSITY * g;
      state[i].ty = (dy / len) * INTENSITY * g;
    });
  }

  function onLeave() {
    active = false;
    state.forEach(s => { s.tx = 0; s.ty = 0; });
    chars.forEach(ch => (ch.style.willChange = ''));
    if (!raf) raf = requestAnimationFrame(tick);
  }

  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', onMove, { passive: true });
  hero.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', () => { if (active) cachePositions(); }, { passive: true });
})();
