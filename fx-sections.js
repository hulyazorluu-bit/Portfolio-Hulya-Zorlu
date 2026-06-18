/* ============================================================
   Section headings — 3D letter reveal on scroll
   Each letter flips in from rotateX(-72deg) with stagger.
   Respects active language (EN/FR) — never concatenates both.
   Re-animates on language switch.
   ============================================================ */
(function () {
  'use strict';

  /* ── Inject styles ──────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.sec-reveal-wrap{display:inline-block;vertical-align:bottom;perspective:600px;}',
    '.sec-reveal-char{display:inline-block;opacity:0;',
    '  transform:rotateX(-72deg) translateY(18px);transform-origin:50% 100%;',
    '  transition:opacity 0.55s cubic-bezier(.22,1,.36,1),transform 0.55s cubic-bezier(.22,1,.36,1);}',
    '.sec-reveal-char.in{opacity:1;transform:rotateX(0deg) translateY(0px);}',
    '.sec-reveal-space{display:inline-block;width:0.28em;}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── Get active-language text (ALL matching spans) ───────── */
  function getActiveText(el, lang) {
    var spans = el.querySelectorAll('.t-' + lang);
    if (spans.length > 0) {
      return Array.prototype.map.call(spans, function (s) {
        return s.textContent.trim();
      }).join(' ');
    }
    var enSpans = el.querySelectorAll('.t-en');
    if (enSpans.length > 0) {
      return Array.prototype.map.call(enSpans, function (s) {
        return s.textContent.trim();
      }).join(' ');
    }
    return el.textContent.trim();
  }

  /* ── Split text into animated char spans ─────────────── */
  function splitEl(el, lang) {
    var text = getActiveText(el, lang);
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

  /* ── Determine dark section ──────────────────────────── */
  function isDarkEl(el) {
    var sec = el.closest('section');
    return sec && (
      sec.classList.contains('section-dark') ||
      sec.id === 'skills' || sec.id === 'about'
    );
  }

  /* ── Setup ───────────────────────────────────────────── */
  var SELECTORS = ['.works_title', '.about_title', '.xp_title'];
  var targets = [];

  function getLang() {
    return /lang-fr/.test(document.documentElement.className) ? 'fr' : 'en';
  }

  function setup() {
    targets = [];
    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el._originalHTML = el.innerHTML;
        targets.push(el);
      });
    });
    if (!targets.length) return;

    var lang = getLang();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target._revealed = true;
        var chars = entry.target._rc;
        if (chars) reveal(chars);
      });
    }, { threshold: 0.3 });

    targets.forEach(function (el) {
      var dark  = isDarkEl(el);
      var chars = splitEl(el, lang);
      if (dark) chars.forEach(function (c) { c.style.color = '#F8F6F2'; });
      el._rc = chars;
      observer.observe(el);
    });
  }

  /* ── Re-run when language switches ──────────────────── */
  document.addEventListener('langchange', function (e) {
    var lang = e.detail && e.detail.lang ? e.detail.lang : getLang();
    targets.forEach(function (el) {
      if (!el._originalHTML) return;
      el.innerHTML = el._originalHTML;
      var dark  = isDarkEl(el);
      var chars = splitEl(el, lang);
      if (dark) chars.forEach(function (c) { c.style.color = '#F8F6F2'; });
      el._rc = chars;
      if (el._revealed) reveal(chars);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

})();
