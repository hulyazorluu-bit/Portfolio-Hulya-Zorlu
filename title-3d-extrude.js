/* ============================================================
   Title 3D — per-letter extruded + entrance + liquid blob
   Three.js loaded via <script defer> in <head>.
   ============================================================ */
(function () {
  'use strict';

  var CDN_FONT = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json';

  function waitAndInit() {
    if (!window.THREE || !THREE.FontLoader || !THREE.TextGeometry) {
      setTimeout(waitAndInit, 80); return;
    }
    var titleEl = document.querySelector('.cnt_tt');
    if (!titleEl) return;
    var ran = false;
    function go() { if (ran) return; ran = true; setTimeout(function () { init(titleEl); }, 350); }
    document.addEventListener('titleReady', go, { once: true });
    setTimeout(go, 4500);
  }
  document.addEventListener('DOMContentLoaded', waitAndInit);

  /* ── Init ───────────────────────────────────────────────── */
  function init(titleEl) {
    var charEls = Array.from(titleEl.querySelectorAll('.ttj .char'));
    if (!charEls.length) return;

    var parentEl = titleEl.parentElement;
    parentEl.style.position = 'relative';
    var pRect = parentEl.getBoundingClientRect();
    var tRect = titleEl.getBoundingClientRect();
    var W = Math.round(tRect.width);
    var H = Math.round(tRect.height);
    if (!W || !H) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ── Renderer ─────────────────────────────────────────── */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    var canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:10;';
    canvas.style.left = Math.round(tRect.left - pRect.left) + 'px';
    canvas.style.top  = Math.round(tRect.top  - pRect.top)  + 'px';
    parentEl.appendChild(canvas);

    /* ── Scene / Ortho camera (1 unit = 1 CSS px) ──────────── */
    var scene  = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, -800, 800);
    camera.position.z = 200;

    /* ── Lights ─────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    var key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(100, 180, 300); scene.add(key);
    var fill = new THREE.DirectionalLight(0xcccccc, 0.30);
    fill.position.set(-120, -80, 100); scene.add(fill);
    var mouseLight = new THREE.PointLight(0xffffff, 1.4, 550);
    mouseLight.position.set(0, 0, 180); scene.add(mouseLight);

    /* ── Font → meshes ──────────────────────────────────────── */
    var loader = new THREE.FontLoader();
    loader.load(CDN_FONT, function (font) {

      var fs     = parseFloat(window.getComputedStyle(titleEl).fontSize);
      var size3d = fs * 0.68;
      var depth  = fs * 0.09;

      var meshItems = [];
      var _cur = new THREE.Vector3();

      charEls.forEach(function (charEl, idx) {
        var ch = charEl.textContent.trim();
        if (!ch || ch === ' ') return;

        var geo = new THREE.TextGeometry(ch, {
          font:           font,
          size:           size3d,
          height:         depth,
          curveSegments:  14,
          bevelEnabled:   true,
          bevelThickness: depth * 0.20,
          bevelSize:      depth * 0.13,
          bevelSegments:  4
        });
        geo.computeBoundingBox();
        var bb = geo.boundingBox;
        var gW = bb.max.x - bb.min.x;
        var gH = bb.max.y - bb.min.y;

        var origPos = new Float32Array(geo.attributes.position.array);

        var mat = new THREE.MeshStandardMaterial({
          color:       0x0a0a0a,
          metalness:   0.18,
          roughness:   0.45,
          transparent: true,
          opacity:     0
        });

        var mesh = new THREE.Mesh(geo, mat);

        var cr    = charEl.getBoundingClientRect();
        var finalX = (cr.left + cr.width/2 - tRect.left) - W/2 - gW/2;
        var finalY = H/2 - (cr.top + cr.height/2 - tRect.top) - gH/2;

        mesh.position.x = finalX;
        mesh.position.y = finalY;
        mesh.position.z = 0;

        scene.add(mesh);

        /* ── Entrance state (slide from right + Z scatter) ── */
        var slideX  = finalX + W * 0.22 + idx * 18;  /* right offset */
        var scatterZ = (Math.random() - 0.4) * depth * 5;
        var scatterRY = (Math.random() - 0.5) * 0.55;

        mesh.position.x = slideX;
        mesh.position.z = scatterZ;
        mesh.rotation.y = scatterRY;

        meshItems.push({
          mesh:    mesh,
          geo:     geo,
          origPos: origPos,
          finalX:  finalX,
          /* entrance */
          slideX:    slideX,
          scatterZ:  scatterZ,
          scatterRY: scatterRY,
          enterDelay: idx * 0.055,  /* 55ms stagger per letter */
          entering:   true,
          /* idle */
          phase:   idx * 0.62,
          /* interaction */
          scrCX:   cr.left + cr.width  / 2,
          scrCY:   cr.top  + cr.height / 2,
          tRX: 0, tRY: 0, tZ: 0,
          cRX: 0, cRY: 0, cZ: 0
        });

        charEl.style.color = 'transparent';
      });

      /* ── Mouse ────────────────────────────────────────────── */
      var mx = -9999, my = -9999;
      var ROT_RADIUS = 110;
      var MAX_ROT    = 0.30;  /* soft — was 0.48 */
      var MAX_Z_POP  = 16;    /* soft — was 26 */
      var BLOB_R     = size3d * 0.35;
      var BLOB_STR   = depth  * 0.9;  /* soft blob */
      var WAVE_SPEED = 3.5;
      var WAVE_FREQ  = 0.16;

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        mouseLight.position.set(
          mx - tRect.left - W / 2,
          H / 2 - (my - tRect.top), 180
        );
      }, { passive: true });
      document.addEventListener('mouseleave', function () {
        mx = -9999; my = -9999;
        mouseLight.position.set(0, 0, 180);
      });

      /* ── Render loop ─────────────────────────────────────── */
      var clock = new THREE.Clock();
      var enterStart = null;

      function animate() {
        requestAnimationFrame(animate);
        var t     = clock.getElapsedTime();
        var delta = clock.getDelta ? 0.016 : 0.016; /* fallback */

        if (enterStart === null) enterStart = t;
        var elapsed = t - enterStart;

        var worldCX = mx - tRect.left - W / 2;
        var worldCY = H / 2 - (my - tRect.top);

        scene.updateMatrixWorld();

        meshItems.forEach(function (m) {

          /* ── Entrance animation ─────────────────────────── */
          if (m.entering) {
            var p = Math.max(0, (elapsed - m.enterDelay) / 0.75);
            if (p >= 1) { p = 1; m.entering = false; }
            /* Ease out quart */
            var ease = 1 - Math.pow(1 - p, 4);

            m.mesh.position.x = m.slideX  + (m.finalX    - m.slideX)  * ease;
            m.mesh.position.z = m.scatterZ * (1 - ease);
            m.mesh.rotation.y = m.scatterRY * (1 - ease);
            m.mesh.material.opacity = ease;
            return; /* skip interaction during entrance */
          }

          m.mesh.material.opacity = 1;

          /* ── 3D rotation + pop ──────────────────────────── */
          var dx = mx - m.scrCX;
          var dy = my - m.scrCY;
          var d  = Math.sqrt(dx * dx + dy * dy) || 1;
          var g  = Math.exp(-(d * d) / (2 * ROT_RADIUS * ROT_RADIUS));

          m.tRY =  (dx / d) * MAX_ROT * g;
          m.tRX = -(dy / d) * MAX_ROT * g;
          m.tZ  = g * MAX_Z_POP;

          var idle = (1 - g) * 0.045;
          m.tRX += Math.sin(t * 0.8 + m.phase) * idle;
          m.tRY += Math.cos(t * 0.6 + m.phase) * idle;

          m.cRX += (m.tRX - m.cRX) * 0.08;
          m.cRY += (m.tRY - m.cRY) * 0.08;
          m.cZ  += (m.tZ  - m.cZ)  * 0.08;

          m.mesh.rotation.x = m.cRX;
          m.mesh.rotation.y = m.cRY;
          m.mesh.position.z = m.cZ;
          m.mesh.position.x = m.finalX;

          /* ── Liquid blob deformation ────────────────────── */
          _cur.set(worldCX, worldCY, m.mesh.position.z);
          m.mesh.worldToLocal(_cur);

          var pos  = m.geo.attributes.position;
          var orig = m.origPos;
          var onScreen = mx > -9000;

          for (var i = 0; i < pos.count; i++) {
            var ox = orig[i * 3];
            var oy = orig[i * 3 + 1];
            var oz = orig[i * 3 + 2];
            if (onScreen) {
              var vdx  = ox - _cur.x;
              var vdy  = oy - _cur.y;
              var vd   = Math.sqrt(vdx * vdx + vdy * vdy) || 0.001;
              var vg   = Math.exp(-(vd * vd) / (2 * BLOB_R * BLOB_R));
              var wave = Math.sin(vd * WAVE_FREQ - t * WAVE_SPEED) * vg;
              pos.setXYZ(i, ox, oy, oz + wave * BLOB_STR);
            } else {
              pos.setXYZ(i, ox, oy, oz);
            }
          }
          pos.needsUpdate = true;
        });

        renderer.render(scene, camera);
      }

      animate();

    }, undefined, function (err) {
      console.warn('Font load error:', err);
    });

    /* ── Resize ─────────────────────────────────────────────── */
    window.addEventListener('resize', function () {
      tRect = titleEl.getBoundingClientRect();
      var pR = parentEl.getBoundingClientRect();
      var nW = Math.round(tRect.width);
      var nH = Math.round(tRect.height);
      renderer.setSize(nW, nH);
      camera.left = -nW/2; camera.right  =  nW/2;
      camera.top  =  nH/2; camera.bottom = -nH/2;
      camera.updateProjectionMatrix();
      canvas.style.left = Math.round(tRect.left - pR.left) + 'px';
      canvas.style.top  = Math.round(tRect.top  - pR.top)  + 'px';
    }, { passive: true });
  }

})();
