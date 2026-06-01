/* =================================================================
   HULYA ZORLU — PORTFOLIO
   Dark · Editorial · Minimal
================================================================= */
'use strict';

/* ── LOADER ──────────────────────────────────────────────── */
function initLoader(onDone) {
  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loader-bar');
  const pct     = document.getElementById('loader-pct');
  const nameTxt = document.getElementById('loader-name');
  if (!loader) { onDone(); return; }

  document.body.style.overflow = 'hidden';

  // Reveal name
  setTimeout(() => loader.classList.add('animating'), 80);

  let p = 0;
  function step() {
    p += Math.random() * 9 + 3;
    if (p > 100) p = 100;
    if (bar) bar.style.width  = p + '%';
    if (pct) pct.textContent  = Math.round(p) + '%';
    if (p < 100) {
      setTimeout(step, 50);
    } else {
      setTimeout(() => {
        loader.classList.add('out');
        document.body.style.overflow = '';
        loader.addEventListener('transitionend', () => {
          loader.style.display = 'none';
          onDone();
        }, { once: true });
      }, 380);
    }
  }
  setTimeout(step, 500);
}

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const el = document.getElementById('cursor');
  if (!el) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    el.classList.add('show');
  });
  document.addEventListener('mouseleave', () => el.classList.remove('show'));
  document.addEventListener('mousedown',  () => el.classList.add('click'));
  document.addEventListener('mouseup',    () => el.classList.remove('click'));

  document.querySelectorAll('a, button').forEach(node => {
    node.addEventListener('mouseenter', () => el.classList.add('hover'));
    node.addEventListener('mouseleave', () => el.classList.remove('hover'));
  });

  (function loop() {
    cx += (tx - cx) * 0.13;
    cy += (ty - cy) * 0.13;
    el.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
    requestAnimationFrame(loop);
  })();
}

/* ── NAV ─────────────────────────────────────────────────── */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mmenu  = document.getElementById('mmenu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (burger && mmenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mmenu.classList.toggle('open', open);
      mmenu.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mmenu.querySelectorAll('.mmenu-lnk').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mmenu.classList.remove('open');
        mmenu.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const sections = document.querySelectorAll('section[data-section]');
  const links    = document.querySelectorAll('.nav-lnk[data-s]');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('on', l.dataset.s === e.target.dataset.section));
    });
  }, { rootMargin: '-40% 0px -40% 0px' }).observe
    ? (() => {
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            links.forEach(l => l.classList.toggle('on', l.dataset.s === e.target.dataset.section));
          });
        }, { rootMargin: '-40% 0px -40% 0px' });
        sections.forEach(s => io.observe(s));
      })()
    : null;
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id     = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth',
      });
    });
  });
}

/* ── REVEAL ──────────────────────────────────────────────── */
function initReveal() {
  // Hero title — immediate on load
  document.querySelectorAll('.ht-word').forEach(el => {
    const d = parseInt(el.dataset.d || '0', 10);
    setTimeout(() => el.classList.add('vis'), d + 200);
  });

  // Scroll-triggered
  const els = document.querySelectorAll('.ru');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.d || '0', 10);
      setTimeout(() => e.target.classList.add('vis'), d);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
}

/* ── WORK HOVER PREVIEW ──────────────────────────────────── */
function initWorkHover() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const wp     = document.getElementById('wp');
  const items  = document.querySelectorAll('.wi');
  const frames = document.querySelectorAll('.wp-frame');
  if (!wp || !items.length) return;

  let mx = 0, my = 0, cx = 0, cy = 0, raf = null;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    cx = lerp(cx, mx, 0.09);
    cy = lerp(cy, my, 0.09);
    const ox = 24;
    const oy = -(wp.offsetHeight * .5);
    wp.style.transform = `translate(${cx + ox}px, ${cy + oy}px)`;
    raf = requestAnimationFrame(loop);
  }

  items.forEach(item => {
    const pi = item.dataset.pi;
    item.addEventListener('mouseenter', () => {
      wp.classList.add('show');
      frames.forEach(f => f.classList.toggle('on', f.classList.contains('wp-frame--' + pi)));
      if (!raf) loop();
    });
    item.addEventListener('mouseleave', () => {
      wp.classList.remove('show');
    });
  });
}

/* ── NUMBER COUNTERS ─────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.count, 10);
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const id = setInterval(() => {
        n = Math.min(n + step, target);
        e.target.textContent = n;
        if (n >= target) clearInterval(id);
      }, 40);
      // stop observing
    });
  }, { threshold: .5 }).observe
    ? (() => {
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            const target = parseInt(e.target.dataset.count, 10);
            let n = 0;
            const step = Math.max(1, Math.ceil(target / 40));
            const id = setInterval(() => {
              n = Math.min(n + step, target);
              e.target.textContent = n;
              if (n >= target) clearInterval(id);
            }, 40);
            io.unobserve(e.target);
          });
        }, { threshold: .5 });
        els.forEach(el => io.observe(el));
      })()
    : null;
}

/* ── CONTACT LETTER HOVER ────────────────────────────────── */
function initLetterHover() {
  const title = document.querySelector('.ct-title');
  if (!title) return;

  const nodes = Array.from(title.childNodes);
  title.innerHTML = '';

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      [...node.textContent].forEach(ch => {
        if (ch === '\n') return;
        const sp = document.createElement('span');
        sp.className = 'ltr';
        sp.textContent = ch === ' ' ? ' ' : ch;
        title.appendChild(sp);
      });
    } else if (node.nodeName === 'BR') {
      title.appendChild(document.createElement('br'));
    } else if (node.nodeName === 'EM') {
      [...node.textContent].forEach(ch => {
        if (ch === '\n') return;
        const sp = document.createElement('span');
        sp.className = 'ltr';
        sp.style.fontFamily = 'var(--ff-serif)';
        sp.style.fontStyle  = 'italic';
        sp.textContent = ch === ' ' ? ' ' : ch;
        title.appendChild(sp);
      });
    }
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initScroll();
  initCounters();
  initLetterHover();

  initLoader(() => {
    initReveal();
    initWorkHover();
  });
});
