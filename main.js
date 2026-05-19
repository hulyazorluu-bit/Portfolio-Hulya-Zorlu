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


/* ── Loader 000 → 042 + typewriter text ──────────────────────── */
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


/* ── CSS Typewriter trigger ───────────────────────────────────── */
/* charsPerSec ≈ 13 = comfortable reading speed */
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
    if (frame <= totalFrames) {
      requestAnimationFrame(render);
    } else {
      el.textContent = finalText;
    }
  }

  setTimeout(() => requestAnimationFrame(render), delay);
}


/* ── Reveal page after loader ─────────────────────────────────── */
function revealPage() {

  /* 1 — Nav right: typewriter sequentially left → right */
  const navTwEls = [...document.querySelectorAll('.nav_right .typewriter')];
  let navIdx = 0;

  function typeNextNav() {
    if (navIdx >= navTwEls.length) {
      /* all nav-right done → reveal nav-left */
      setTimeout(revealNavLeft, 120);
      return;
    }
    const twEl = navTwEls[navIdx++];
    const container = twEl.closest('.typewriter-container');
    if (container) container.style.opacity = '1';
    triggerTypewriter(twEl, 13, typeNextNav);
  }
  typeNextNav();

  /* 2 — Nav left: brand scramble + clock typewriter simultaneously */
  function revealNavLeft() {
    const navLeft = document.querySelector('.nav_left');
    if (navLeft) navLeft.style.opacity = '1';

    /* brand: scramble random chars → HULYAZORLU_PAR */
    const brandTw = document.getElementById('brand-tw');
    if (brandTw) {
      const container = brandTw.closest('.typewriter-container');
      /* show full width immediately — scramble handles character display */
      brandTw.style.width = '100%';
      if (container) { container.style.opacity = '1'; container.classList.add('done'); }
      scramble(brandTw, 'HULYAZORLU_PAR', { delay: 0, duration: 900 });
    }

    /* clock: typewriter */
    if (window.triggerClockTypewriter) {
      const clockContainer = document.getElementById('clock-tw-container');
      if (clockContainer) clockContainer.style.opacity = '1';
      window.triggerClockTypewriter();
    }
  }

  /* 3 — Title chars reveal */
  document.querySelectorAll('.ttj').forEach((row, rowIdx) => {
    row.querySelectorAll('.char').forEach((ch, charIdx) => {
      ch.style.transitionDelay = `${rowIdx * 150 + charIdx * 55}ms`;
    });
    setTimeout(() => row.classList.add('act'), 100 + rowIdx * 150);
  });

  /* 4 — PORTFOLIO_26, scroll, socials — appear together ~1.8s after start */
  setTimeout(() => {
    /* portfolio */
    const portTw = document.querySelector('#portfolio-txt .typewriter');
    if (portTw) {
      const c = portTw.closest('.typewriter-container');
      if (c) c.style.opacity = '1';
      triggerTypewriter(portTw, 13, null);
    }

    /* scroll */
    const scrollTw = document.querySelector('#scroll-txt .typewriter');
    if (scrollTw) {
      const c = scrollTw.closest('.typewriter-container');
      if (c) c.style.opacity = '1';
      triggerTypewriter(scrollTw, 13, null);
    }

    /* socials: typewriter sequentially */
    const socialTwEls = [...document.querySelectorAll('.hero_socials .typewriter')];
    let socIdx = 0;
    function typeNextSocial() {
      if (socIdx >= socialTwEls.length) return;
      const twEl = socialTwEls[socIdx++];
      const socialLink = twEl.closest('.social_lk');
      if (socialLink) socialLink.style.opacity = '1';
      const c = twEl.closest('.typewriter-container');
      if (c) c.style.opacity = '1';
      triggerTypewriter(twEl, 13, typeNextSocial);
    }
    typeNextSocial();
  }, 1800);
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
