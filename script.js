/* ============================================================
   HULYA ZORLU — PORTFOLIO
   Vanilla JS — no libraries, no frameworks
   ============================================================ */

'use strict';

/* ── LOADER ──────────────────────────────────────────────── */
function initLoader(onDone) {
  const ldr  = document.getElementById('ldr');
  const fill = document.getElementById('ldr-fill');
  if (!ldr) { onDone(); return; }

  document.body.style.overflow = 'hidden';
  let p = 0;

  function step() {
    p += Math.random() * 9 + 3;
    if (p > 100) p = 100;
    if (fill) fill.style.width = p + '%';
    if (p < 100) {
      setTimeout(step, 50);
    } else {
      setTimeout(() => {
        ldr.classList.add('out');
        document.body.style.overflow = '';
        ldr.addEventListener('transitionend', () => {
          ldr.style.display = 'none';
          onDone();
        }, { once: true });
      }, 280);
    }
  }
  setTimeout(step, 350);
}

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const el = document.getElementById('cur');
  if (!el) return;

  document.addEventListener('mousemove', e => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
    el.classList.add('active');
  });
  document.addEventListener('mouseleave', () => el.classList.remove('active'));
  document.addEventListener('mousedown', () => document.body.classList.add('cclick'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cclick'));

  document.querySelectorAll('a, button, .cl').forEach(node => {
    node.addEventListener('mouseenter', () => document.body.classList.add('chover'));
    node.addEventListener('mouseleave', () => document.body.classList.remove('chover'));
  });
}

/* ── HEADER ──────────────────────────────────────────────── */
function initHeader() {
  const hdr  = document.getElementById('hdr');
  const burg = document.getElementById('burg');
  const mob  = document.getElementById('mob');
  if (!hdr) return;

  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (burg && mob) {
    burg.addEventListener('click', () => {
      const open = burg.classList.toggle('open');
      mob.classList.toggle('open', open);
      burg.setAttribute('aria-expanded', String(open));
      mob.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mob.querySelectorAll('.moblink').forEach(a => {
      a.addEventListener('click', () => {
        burg.classList.remove('open');
        mob.classList.remove('open');
        burg.setAttribute('aria-expanded', 'false');
        mob.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link highlight */
  const sections = document.querySelectorAll('section[data-section]');
  const navLinks = document.querySelectorAll('.nl[data-s]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const s = e.target.dataset.section;
      navLinks.forEach(l => l.classList.toggle('on', l.dataset.s === s));
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.fade-up');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.d || '0', 10);
      setTimeout(() => e.target.classList.add('vis'), delay);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id     = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('hdr')?.offsetHeight || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth',
      });
    });
  });
}

/* ── NUMBER COUNTERS ─────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const io  = new IntersectionObserver(entries => {
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
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ── CONTACT TITLE LETTER HOVER ──────────────────────────── */
function initLetterHover() {
  const title = document.querySelector('.contact-title');
  if (!title) return;

  const nodes = Array.from(title.childNodes);
  title.innerHTML = '';

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split('').forEach(char => {
        if (char === '\n') return;
        const sp = document.createElement('span');
        sp.className = char === ' ' ? 'cl sp' : 'cl';
        sp.textContent = char === ' ' ? ' ' : char;
        title.appendChild(sp);
      });
    } else if (node.nodeName === 'BR') {
      title.appendChild(document.createElement('br'));
    } else if (node.nodeName === 'EM') {
      node.textContent.split('').forEach(char => {
        if (char === '\n') return;
        const sp = document.createElement('span');
        sp.className = char === ' ' ? 'cl sp' : 'cl';
        sp.style.fontStyle = 'italic';
        sp.style.color = 'var(--accent)';
        sp.textContent = char === ' ' ? ' ' : char;
        title.appendChild(sp);
      });
    }
  });

  title.querySelectorAll('.cl').forEach(sp => {
    sp.addEventListener('mouseenter', () => document.body.classList.add('chover'));
    sp.addEventListener('mouseleave', () => document.body.classList.remove('chover'));
  });
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
function initMagnetic() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform  = 'translate(0,0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initLoader(() => {});
  initHeader();
  initReveal();
  initScroll();
  initCounters();
  initLetterHover();
  initMagnetic();
});
