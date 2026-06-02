/**
 * fx-cursor.js
 * Custom editorial cursor with spring-lerp ring.
 * Desktop only. No external dependencies — browser only.
 */
(function () {
  'use strict';

  // Desktop / fine-pointer only
  if (!window.matchMedia('(pointer:fine)').matches) return;

  // Inject cursor:none style
  var styleEl = document.createElement('style');
  styleEl.textContent = '* { cursor: none !important; }';
  document.head.appendChild(styleEl);

  // Create dot
  var dot = document.createElement('div');
  dot.id = 'fx-dot';
  dot.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:9999',
    'border-radius:50%',
    'transform:translate(-50%,-50%)',
    'width:8px',
    'height:8px',
    'background:white',
    'mix-blend-mode:difference',
    'transition:width 0.2s cubic-bezier(.25,.46,.45,.94),height 0.2s cubic-bezier(.25,.46,.45,.94)',
    'opacity:0'
  ].join(';');

  // Create ring
  var ring = document.createElement('div');
  ring.id = 'fx-ring';
  ring.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:9999',
    'border-radius:50%',
    'transform:translate(-50%,-50%)',
    'width:38px',
    'height:38px',
    'background:transparent',
    'border:1.5px solid white',
    'mix-blend-mode:difference',
    'transition:width 0.35s cubic-bezier(.25,.46,.45,.94),height 0.35s cubic-bezier(.25,.46,.45,.94),opacity 0.3s ease',
    'opacity:0'
  ].join(';');

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mouseX = -200, mouseY = -200;
  var ringX  = -200, ringY  = -200;
  var SPRING = 0.10;

  function setPos(el, x, y) {
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }

  function tick() {
    requestAnimationFrame(tick);

    // Dot: instant
    setPos(dot, mouseX, mouseY);

    // Ring: spring lerp
    ringX += (mouseX - ringX) * SPRING;
    ringY += (mouseY - ringY) * SPRING;
    setPos(ring, ringX, ringY);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover targets
  var HOVER_SELECTOR = 'a, button, .work_thumb, .work_item';

  function onHoverEnter() {
    ring.style.width  = '52px';
    ring.style.height = '52px';
    dot.style.width   = '4px';
    dot.style.height  = '4px';
  }

  function onHoverLeave() {
    ring.style.width  = '38px';
    ring.style.height = '38px';
    dot.style.width   = '8px';
    dot.style.height  = '8px';
  }

  // Use event delegation for hover targets
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(HOVER_SELECTOR)) {
      onHoverEnter();
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(HOVER_SELECTOR)) {
      // Only revert if the new target is not also a hover target
      if (!e.relatedTarget || !e.relatedTarget.closest(HOVER_SELECTOR)) {
        onHoverLeave();
      }
    }
  });

  // Document visibility
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Show cursors on first mousemove
  var shown = false;
  document.addEventListener('mousemove', function () {
    if (!shown) {
      shown = true;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    }
  }, { once: false });

  tick();
})();
