/* ============================================================
   Section headings — 3D letter reveal on scroll
   Each letter flips in from rotateX(-72deg) with stagger.
   Respects active language (EN/FR) — never concatenates both.
   ============================================================ */
(function () {
  'use strict';

  /* ── Inject styles ──────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.sec-reveal-wrap{display:inline-block;overflow:hidden;vertical-align:bottom;perspective:600px;}',
    '.sec-reveal-char{display:inline-block;opacity:0;',
    '  transform:rotateX(-72deg) translateY(18px);transform-origin:50% 100%;',
    '  transition:opacity 0.55s cubic-bezier(.22,1,.36,1),transform 0.55s cubic-bezier(.22,1,.36,1);}',
    '.sec-reveal-char.in{opacity:1;transform:rotateX(0deg) translateY(0px);}',
    '.sec-reveal-space{display:inline-block;width:0.28em;}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── Get active-language text only ───────────────────────── */
  function getActiveText(el) {
    var lang = /lang-fr/.test(document.documentElement.className) ? 'fr' : 'en';
    /* Try the active language span first */
    var span = el.querySelector('.t-' + lang);
    if (span) return span.textContent.trim();
    /* Fallback: EN span */
    var enSpan = el.querySelector('.t-en');
    if (enSpan) return enSpan.textContent.trim();
    /* Plain text element (no lang spans) */
    return el.childNodes[0] && el.childNodes[0].nodeType === 3
      ? el.childNodes[0].textContent.trim()
      : el.textContent.trim();
  }

  /* ── Split text into animated char spans ─────────────── */
  function splitEl(el) {
    var text = getActiveText(el);
    if (!text) return [];
    el.innerHTML = '';
    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ') {
        var sp = document.createElement('span');
        sp.className = 'sec-reveal-space';
        sp.setAttribute('aria-hidden', 'true');
        el.appendChild(sp);
      } else {
        var wrap  = document.createElement('span');
        wrap.className = 'sec-reveal-wrap';
        var inner = document.createElement('span');
        inner.className = 'sec-reveal-char';
        inner.textContent = ch;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        chars.push(inner);
      }
    }
    return chars;
  }

  /* ── Trigger reveal with stagger ────────────────────── */
  function reveal(chars) {
    chars.forEach(function (ch, i) {
      setTimeout(function () { ch.classList.add('in'); }, i * 50);
    });
  }

  /* ── Setup ───────────────────────────────────────────── */
  var SELECTORS = ['.works_title', '.about_title', '.xp_title'];

  function setup() {
    var targets = [];
    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        targets.push(el);
      });
    });
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var chars = entry.target._rc;
        if (chars) reveal(chars);
      });
    }, { threshold: 0.3 });

    targets.forEach(function (el) {
      var sec    = el.closest('section');
      var isDark = sec && (
        sec.classList.contains('section-dark') ||
        sec.id === 'skills' || sec.id === 'about'
      );
      var chars = splitEl(el);
      if (isDark) {
        chars.forEach(function (c) { c.style.color = '#F8F6F2'; });
      }
      el._rc = chars;
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

})();
