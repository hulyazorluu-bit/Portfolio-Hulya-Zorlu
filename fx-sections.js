/* ============================================================
   Section headings — 3D letter reveal on scroll
   Each letter flips in from rotateX(-70deg) with stagger.
   Pure CSS 3D + IntersectionObserver, no particles.
   ============================================================ */
(function () {
  'use strict';

  /* ── Inject styles ──────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.sec-reveal-wrap {',
    '  display:inline-block;',
    '  overflow:hidden;',
    '  vertical-align:bottom;',
    '  perspective:600px;',
    '}',
    '.sec-reveal-char {',
    '  display:inline-block;',
    '  opacity:0;',
    '  transform:rotateX(-72deg) translateY(18px);',
    '  transform-origin:50% 100%;',
    '  transition:',
    '    opacity 0.55s cubic-bezier(.22,1,.36,1),',
    '    transform 0.55s cubic-bezier(.22,1,.36,1);',
    '}',
    '.sec-reveal-char.in {',
    '  opacity:1;',
    '  transform:rotateX(0deg) translateY(0px);',
    '}',
    '.sec-reveal-space { display:inline-block; width:0.28em; }'
  ].join('\n');
  document.head.appendChild(style);

  /* ── Selectors to animate ─────────────────────────────── */
  var SELECTORS = ['.works_title', '.about_title', '.xp_title'];

  /* ── Split text into animated char spans ─────────────── */
  function splitEl(el) {
    var text = el.textContent.trim();
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
        var wrap = document.createElement('span');
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
