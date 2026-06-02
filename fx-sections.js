/**
 * fx-sections.js
 * Canvas 2D particle reveal for section headings on scroll.
 * No external dependencies — browser only.
 */
(function () {
  'use strict';

  var SELECTORS = '.works_title, .about_title, .xp_title';
  var DARK_PARTICLE_COLOR  = '#0a0a0a';
  var LIGHT_PARTICLE_COLOR = '#F8F6F2';
  var SAMPLE_STEP = 3;       // px step when sampling text pixels
  var PARTICLE_RADIUS = 1.5; // px
  var SPRING = 0.08;
  var DAMPING = 0.80;
  var SCATTER_RANGE = 200;   // px

  function isDarkSection(el) {
    // Check parent section for dark indicators
    var section = el.closest('section');
    if (section) {
      var cls = section.className || '';
      var id  = section.id || '';
      if (
        cls.indexOf('section-dark') !== -1 ||
        id === 'skills' || id === 'about' ||
        cls.indexOf('skills') !== -1 ||
        cls.indexOf('about') !== -1
      ) {
        return true;
      }
    }
    // Also check el's own ancestors
    if (el.closest('.section-dark, .about, .skills')) return true;
    return false;
  }

  function sampleTextPixels(el, offCanvas, offCtx) {
    var w = offCanvas.width;
    var h = offCanvas.height;
    var imageData = offCtx.getImageData(0, 0, w, h);
    var data = imageData.data;
    var pixels = [];

    for (var y = 0; y < h; y += SAMPLE_STEP) {
      for (var x = 0; x < w; x += SAMPLE_STEP) {
        var idx = (y * w + x) * 4;
        var a = data[idx + 3];
        if (a > 64) {
          pixels.push({ hx: x, hy: y });
        }
      }
    }
    return pixels;
  }

  function runParticleReveal(el) {
    var rect = el.getBoundingClientRect();
    var w = Math.ceil(rect.width);
    var h = Math.ceil(rect.height);
    if (w <= 0 || h <= 0) return;

    var dark = isDarkSection(el);
    var particleColor = dark ? LIGHT_PARTICLE_COLOR : DARK_PARTICLE_COLOR;

    // --- Offscreen canvas: draw the text ---
    var offCanvas = document.createElement('canvas');
    offCanvas.width  = w;
    offCanvas.height = h;
    var offCtx = offCanvas.getContext('2d');

    var cs = window.getComputedStyle(el);
    var fontSize   = cs.fontSize   || '16px';
    var fontFamily = cs.fontFamily || 'sans-serif';
    var fontWeight = cs.fontWeight || '400';
    var fontStyle  = cs.fontStyle  || 'normal';
    var font = fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily;

    offCtx.font = font;
    offCtx.fillStyle = '#000000';
    offCtx.textBaseline = 'top';

    // Draw text; handle multiline by splitting on newlines
    var text = el.innerText || el.textContent || '';
    var lines = text.split('\n');
    var lineHeightVal = parseFloat(cs.lineHeight);
    if (isNaN(lineHeightVal)) lineHeightVal = parseFloat(fontSize) * 1.2;
    lines.forEach(function (line, i) {
      offCtx.fillText(line.trim(), 0, i * lineHeightVal);
    });

    var pixels = sampleTextPixels(el, offCanvas, offCtx);
    if (pixels.length === 0) return;

    // --- Overlay canvas on top of element ---
    // Parent must be positioned
    var parent = el.parentElement;
    if (!parent) return;
    var parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === 'static') {
      parent.style.position = 'relative';
    }

    var overlayCanvas = document.createElement('canvas');
    overlayCanvas.width  = w;
    overlayCanvas.height = h;

    // Compute position relative to parent
    var parentRect = parent.getBoundingClientRect();
    var elLeft = rect.left - parentRect.left + parent.scrollLeft;
    var elTop  = rect.top  - parentRect.top  + parent.scrollTop;

    overlayCanvas.style.cssText = [
      'position:absolute',
      'left:' + elLeft + 'px',
      'top:'  + elTop  + 'px',
      'width:' + w + 'px',
      'height:' + h + 'px',
      'pointer-events:none',
      'z-index:10',
      'opacity:1',
      'transition:opacity 0.8s ease'
    ].join(';');
    parent.appendChild(overlayCanvas);

    var ctx = overlayCanvas.getContext('2d');

    // Hide the real text while animating
    el.style.opacity = '0';

    // Build particles with random scatter start positions
    var particles = pixels.map(function (px) {
      return {
        hx: px.hx,
        hy: px.hy,
        x: px.hx + (Math.random() * 2 - 1) * SCATTER_RANGE,
        y: px.hy + (Math.random() * 2 - 1) * SCATTER_RANGE,
        vx: 0,
        vy: 0
      };
    });

    var rafId = null;
    var settled = false;

    function animate() {
      rafId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = particleColor;

      var allSettled = true;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Spring toward home
        var fx = (p.hx - p.x) * SPRING;
        var fy = (p.hy - p.y) * SPRING;
        p.vx = (p.vx + fx) * DAMPING;
        p.vy = (p.vy + fy) * DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        if (Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
          allSettled = false;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      if (allSettled && !settled) {
        settled = true;
        cancelAnimationFrame(rafId);
        rafId = null;

        // Restore real text
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '1';

        // Fade out overlay canvas
        overlayCanvas.style.opacity = '0';
        overlayCanvas.addEventListener('transitionend', function () {
          if (overlayCanvas.parentNode) {
            overlayCanvas.parentNode.removeChild(overlayCanvas);
          }
        }, { once: true });
      }
    }

    animate();
  }

  function setupHeading(el) {
    var text = (el.innerText || el.textContent || '').trim();
    if (!text) return;

    var triggered = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.unobserve(el);
          runParticleReveal(el);
        }
      });
    }, { threshold: 0.4 });

    // Start with opacity 0 so real text is hidden until animation
    el.style.opacity = '0';

    observer.observe(el);
  }

  function init() {
    var headings = document.querySelectorAll(SELECTORS);
    headings.forEach(function (el) {
      setupHeading(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
