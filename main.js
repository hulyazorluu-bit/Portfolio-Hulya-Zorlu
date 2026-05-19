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


/* ── Title char reveal ───────────────────────────────────────── */
(function initTitleReveal() {
  const rows = document.querySelectorAll('.ttj');
  rows.forEach((row, rowIdx) => {
    const chars = row.querySelectorAll('.char');
    chars.forEach((ch, charIdx) => {
      /* stagger: each row starts 150ms after previous, each char 55ms apart */
      ch.style.transitionDelay = `${rowIdx * 150 + charIdx * 55}ms`;
    });
    /* trigger slightly after delay so transition fires */
    setTimeout(() => row.classList.add('act'), 80 + rowIdx * 150);
  });
})();


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

(function initScramble() {
  const portEl = document.getElementById('portfolio-txt');
  if (portEl) scramble(portEl, 'PORTFOLIO_26', { delay: 800, duration: 1800 });

  const scrollEl = document.getElementById('scroll-txt');
  if (scrollEl) scramble(scrollEl, '[scroll to explore]', { delay: 1200, duration: 2400, loop: true });
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
