/* ============================================================
   Title 3D Extruded — per-letter CSS 3D transforms
   No external deps. Each char rotates independently on hover.
   ============================================================ */
(function () {
  'use strict';

  var titleEl = document.querySelector('.cnt_tt');
  if (!titleEl) return;

  /* ── Wait for chars to be visible ─────────────────────── */
  function run() {
    var charEls = Array.from(titleEl.querySelectorAll('.ttj .char'));
    if (!charEls.length) return;

    /* 3D preserve on container */
    titleEl.style.transformStyle = 'preserve-3d';

    var items = charEls.map(function (el) {
      el.style.display        = 'inline-block';
      el.style.transformStyle = 'preserve-3d';
      el.style.willChange     = 'transform, text-shadow';
      /* Layered shadow = extrusion depth illusion */
      el.style.textShadow =
        '1px 1px 0 #888,2px 2px 0 #777,3px 3px 0 #666,4px 4px 0 #555,5px 5px 0 #444';
      return { el: el, tRX: 0, tRY: 0, tZ: 0, cRX: 0, cRY: 0, cZ: 0 };
    });

    var mx = -9999, my = -9999;
    var RADIUS  = 105;   /* px — influence radius per letter */
    var MAX_ROT = 22;    /* deg */
    var MAX_Z   = 20;    /* px pop-out */
    var LERP    = 0.09;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      mx = -9999; my = -9999;
    });

    function tick() {
      requestAnimationFrame(tick);

      items.forEach(function (m) {
        var r  = m.el.getBoundingClientRect();
        var cx = r.left + r.width  / 2;
        var cy = r.top  + r.height / 2;
        var dx = mx - cx;
        var dy = my - cy;
        var d  = Math.sqrt(dx * dx + dy * dy) || 1;
        var g  = Math.exp(-(d * d) / (2 * RADIUS * RADIUS));

        m.tRY =  (dx / d) * MAX_ROT * g;
        m.tRX = -(dy / d) * MAX_ROT * g;
        m.tZ  = g * MAX_Z;

        m.cRX += (m.tRX - m.cRX) * LERP;
        m.cRY += (m.tRY - m.cRY) * LERP;
        m.cZ  += (m.tZ  - m.cZ)  * LERP;

        m.el.style.transform =
          'perspective(350px)' +
          ' rotateX(' + m.cRX.toFixed(2) + 'deg)' +
          ' rotateY(' + m.cRY.toFixed(2) + 'deg)' +
          ' translateZ(' + m.cZ.toFixed(2) + 'px)';

        /* Shadow shifts to reinforce 3D depth */
        var sx = (-m.cRY / MAX_ROT * 4).toFixed(1);
        var sy = ( m.cRX / MAX_ROT * 4).toFixed(1);
        m.el.style.textShadow =
          sx + 'px ' + sy + 'px 0 #888,' +
          (2*+sx).toFixed(1) + 'px ' + (2*+sy).toFixed(1) + 'px 0 #777,' +
          (3*+sx).toFixed(1) + 'px ' + (3*+sy).toFixed(1) + 'px 0 #666,' +
          (4*+sx).toFixed(1) + 'px ' + (4*+sy).toFixed(1) + 'px 0 #555,' +
          (5*+sx).toFixed(1) + 'px ' + (5*+sy).toFixed(1) + 'px 0 #444';
      });
    }

    tick();
  }

  document.addEventListener('titleReady', run, { once: true });
  setTimeout(run, 4000);

})();
