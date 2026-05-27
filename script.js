/* ============================================================
   HULYA ZORLU — PORTFOLIO v2
   Vanilla JS — no libraries, no frameworks
   ============================================================ */

'use strict';

/* ── TEXT SCRAMBLE ───────────────────────────────────────── */
class Scramble {
  constructor(el) {
    this.el    = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.raf   = null;
    this.frame = 0;
    this.queue = [];
  }
  run(target) {
    this.queue = target.split('').map((to, i) => ({
      from:  this.rChar(),
      to,
      start: Math.floor(i * 1.8),
      end:   Math.floor(i * 1.8) + Math.floor(Math.random() * 12 + 6),
    }));
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.tick();
  }
  tick() {
    let out = '', done = 0;
    for (const q of this.queue) {
      if (this.frame >= q.end) {
        out += q.to; done++;
      } else if (this.frame >= q.start) {
        out += `<span style="color:rgba(237,232,224,.2)">${this.rChar()}</span>`;
      } else {
        out += q.to === ' ' ? ' ' : this.rChar();
      }
    }
    this.el.innerHTML = out;
    if (done < this.queue.length) {
      this.raf = requestAnimationFrame(() => { this.frame++; this.tick(); });
    } else {
      this.el.textContent = this.queue.map(q => q.to).join('');
    }
  }
  rChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
}

/* ── LOADER ──────────────────────────────────────────────── */
function initLoader(onDone) {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('ldr-bar');
  const num    = document.getElementById('ldr-num');
  if (!loader) { onDone(); return; }

  document.body.style.overflow = 'hidden';
  let p = 0;

  function step() {
    p += Math.random() * 7 + 2;
    if (p >= 100) p = 100;
    bar.style.width = p + '%';
    num.textContent = Math.round(p);
    if (p < 100) setTimeout(step, 55);
    else {
      setTimeout(() => {
        loader.classList.add('out');
        document.body.style.overflow = '';
        loader.addEventListener('transitionend', () => {
          loader.style.display = 'none';
          onDone();
        }, { once: true });
      }, 200);
    }
  }
  setTimeout(step, 400);
}

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const el = document.getElementById('cursor');
  if (!el) return;

  let cx = -100, cy = -100;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.classList.add('active');
  });
  document.addEventListener('mouseleave', () => el.classList.remove('active'));
  document.addEventListener('mousedown', () => document.body.classList.add('cclick'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cclick'));

  document.querySelectorAll('a, button, .wi, [tabindex], .cl').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('chover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('chover'));
  });
}

/* ── HEADER ──────────────────────────────────────────────── */
function initHeader() {
  const hdr    = document.getElementById('hdr');
  const burger = document.getElementById('burger');
  const mnav   = document.getElementById('mnav');
  if (!hdr) return;

  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mnav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      mnav.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.querySelectorAll('.ml').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mnav.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        mnav.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });
  }

  /* Active section highlight */
  const sections = document.querySelectorAll('section[data-section]');
  const links    = document.querySelectorAll('.hl[data-s]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const s = e.target.dataset.section;
      links.forEach(l => l.classList.toggle('on', l.dataset.s === s));
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ── HERO: scramble + spotlight ─────────────────────────── */
function initHero() {
  /* Text scramble after loader */
  const a = document.getElementById('scramble-a');
  const b = document.getElementById('scramble-b');
  if (a) { const s = new Scramble(a); setTimeout(() => s.run('HULYA'), 100); }
  if (b) { const s = new Scramble(b); setTimeout(() => s.run('ZORLU'), 260); }

  /* Mouse-follow ambient glow */
  const hero   = document.querySelector('.s-hero');
  const heroBg = document.getElementById('hero-bg');
  if (!hero || !heroBg) return;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    heroBg.style.setProperty('--mx', x + '%');
    heroBg.style.setProperty('--my', y + '%');
  });
}

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-scale');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('vis'), delay);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.04 });
  els.forEach(el => io.observe(el));
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
}

/* ── WORK ITEM COLOR SHIFT ───────────────────────────────── */
function initWork() {
  document.querySelectorAll('.wi[data-accent]').forEach(item => {
    const hex = item.dataset.accent;
    const dim = hex + '1a'; /* ~10% opacity in hex */
    item.addEventListener('mouseenter', () => {
      item.style.setProperty('--wi-accent', hex);
      item.style.setProperty('--wi-accent-dim', hex + '33');
      item.style.background = hex + '05';
    });
    item.addEventListener('mouseleave', () => {
      item.style.removeProperty('--wi-accent');
      item.style.removeProperty('--wi-accent-dim');
      item.style.background = '';
    });
  });
}

/* ── NUMBER COUNTERS ─────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.count);
      let n = 0;
      const step = Math.ceil(target / 36);
      const id   = setInterval(() => {
        n = Math.min(n + step, target);
        e.target.textContent = n;
        if (n >= target) clearInterval(id);
      }, 45);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ── CONTACT LETTER HOVER ────────────────────────────────── */
function initLetterHover() {
  const title = document.getElementById('ct-title');
  if (!title) return;
  const raw = title.textContent.trim();
  title.textContent = '';
  raw.split('').forEach(char => {
    const sp = document.createElement('span');
    if (char === ' ') {
      sp.className = 'cl sp';
      sp.innerHTML = '&nbsp;';
    } else {
      sp.className = 'cl';
      sp.textContent = char;
    }
    title.appendChild(sp);
  });

  /* Re-add cursor hover for new spans */
  title.querySelectorAll('.cl').forEach(sp => {
    sp.addEventListener('mouseenter', () => document.body.classList.add('chover'));
    sp.addEventListener('mouseleave', () => document.body.classList.remove('chover'));
  });
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
function initMagnetic() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(0.34,1.56,0.64,1)';
      el.style.transform  = 'translate(0,0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initLoader(() => {
    /* Run scramble + hero effects after loader clears */
    initHero();
  });
  initHeader();
  initReveal();
  initScroll();
  initWork();
  initCounters();
  initLetterHover();
  initMagnetic();
});
