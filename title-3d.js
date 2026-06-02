/* ============================================================
   Title 3D — Perspective Tilt (Modèle B)
   Smooth mouse-reactive 3D tilt on the hero title
   ============================================================ */
(function () {
  'use strict';

  var titleEl  = document.querySelector('.cnt_tt');
  if (!titleEl) return;

  var rows = titleEl.querySelectorAll('.Atitle');

  /* Perspective on parent so children preserve 3D */
  titleEl.style.transformStyle  = 'preserve-3d';
  titleEl.style.willChange      = 'transform';

  /* Each row gets a subtle translateZ for depth layering */
  rows.forEach(function (row, i) {
    row.style.display       = 'block';
    row.style.transformStyle = 'preserve-3d';
    row.style.transform     = 'translateZ(' + (i === 0 ? 18 : -8) + 'px)';
    row.style.willChange    = 'transform';
  });

  var curX = 0, curY = 0;
  var tgtX = 0, tgtY = 0;
  var rafId = null;

  var MAX_X = 10;  /* degrees vertical tilt */
  var MAX_Y = 14;  /* degrees horizontal tilt */

  function onMove(e) {
    var rect = titleEl.getBoundingClientRect();
    var cx   = rect.left + rect.width  / 2;
    var cy   = rect.top  + rect.height / 2;

    var nx = (e.clientX - cx) / (window.innerWidth  * 0.5);
    var ny = (e.clientY - cy) / (window.innerHeight * 0.5);

    nx = Math.max(-1, Math.min(1, nx));
    ny = Math.max(-1, Math.min(1, ny));

    tgtX = -ny * MAX_X;
    tgtY =  nx * MAX_Y;

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function onLeave() {
    tgtX = 0;
    tgtY = 0;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    curX += (tgtX - curX) * 0.07;
    curY += (tgtY - curY) * 0.07;

    titleEl.style.transform =
      'perspective(700px) rotateX(' + curX.toFixed(3) + 'deg) rotateY(' + curY.toFixed(3) + 'deg)';

    if (Math.abs(tgtX - curX) > 0.005 || Math.abs(tgtY - curY) > 0.005) {
      rafId = requestAnimationFrame(tick);
    } else {
      curX = tgtX;
      curY = tgtY;
      titleEl.style.transform =
        'perspective(700px) rotateX(' + curX.toFixed(3) + 'deg) rotateY(' + curY.toFixed(3) + 'deg)';
      rafId = null;
    }
  }

  document.addEventListener('mousemove',  onMove,   { passive: true });
  document.addEventListener('mouseleave', onLeave);

})();
