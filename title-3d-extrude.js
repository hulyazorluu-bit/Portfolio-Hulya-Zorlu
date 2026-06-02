/* ============================================================
   Title 3D — per-letter extruded + liquid blob deformation
   Three.js loaded via <script defer> in <head>.
   ============================================================ */
(function () {
  'use strict';

  var CDN_FONT = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json';

  /* ── Wait for Three.js defer scripts ───────────────────── */
  function waitAndInit() {
    if (!window.THREE || !THREE.FontLoader || !THREE.TextGeometry) {
      setTimeout(waitAndInit, 80); return;
    }
    var titleEl = document.querySelector('.cnt_tt');
    if (!titleEl) return;
    var ran = false;
    function go() { if (ran) return; ran = true; setTimeout(function () { init(titleEl); }, 400); }
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
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:10;opacity:0;transition:opacity 0.6s;';
    canvas.style.left = Math.round(tRect.left - pRect.left) + 'px';
    canvas.style.top  = Math.round(tRect.top  - pRect.top)  + 'px';
    parentEl.appendChild(canvas);

    /* ── Scene / Ortho camera (1 unit = 1 CSS px) ──────────── */
    var scene  = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, -800, 800);
    camera.position.z = 200;

    /* ── Lights ─────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(100, 180, 300); scene.add(key);
    var fill = new THREE.DirectionalLight(0xcccccc, 0.35);
    fill.position.set(-120, -80, 100); scene.add(fill);
    var mouseLight = new THREE.PointLight(0xffffff, 2.0, 600);
    mouseLight.position.set(0, 0, 180); scene.add(mouseLight);

    /* ── Font load → build meshes ───────────────────────────── */
    var loader = new THREE.FontLoader();
    loader.load(CDN_FONT, function (font) {

      var fs     = parseFloat(window.getComputedStyle(titleEl).fontSize);
      var size3d = fs * 0.68;
      var depth  = fs * 0.10;

      var meshItems = [];
      var _cursor   = new THREE.Vector3(); /* reused each frame */

      charEls.forEach(function (charEl, idx) {
        var ch = charEl.textContent.trim();
        if (!ch || ch === ' ') return;

        var geo = new THREE.TextGeometry(ch, {
          font:           font,
          size:           size3d,
          height:         depth,
          curveSegments:  14,   /* more vertices → smoother blob */
          bevelEnabled:   true,
          bevelThickness: depth * 0.20,
          bevelSize:      depth * 0.14,
          bevelSegments:  4
        });
        geo.computeBoundingBox();
        var bb = geo.boundingBox;
        var gW = bb.max.x - bb.min.x;
        var gH = bb.max.y - bb.min.y;

        /* Store original positions for blob deformation */
        var origPos = new Float32Array(geo.attributes.position.array);

        var mat = new THREE.MeshStandardMaterial({
          color:     0x0a0a0a,
          metalness: 0.20,
          roughness: 0.42
        });

        var mesh = new THREE.Mesh(geo, mat);

        var cr    = charEl.getBoundingClientRect();
        var scrCX = cr.left + cr.width  / 2 - tRect.left;
        var scrCY = cr.top  + cr.height / 2 - tRect.top;
        mesh.position.x = scrCX - W / 2 - gW / 2;
        mesh.position.y = H / 2 - scrCY - gH / 2;
        mesh.position.z = 0;

        scene.add(mesh);

        meshItems.push({
          mesh:    mesh,
          geo:     geo,
          origPos: origPos,
          scrCX:   cr.left + cr.width  / 2,
          scrCY:   cr.top  + cr.height / 2,
          phase:   idx * 0.62,
          tRX: 0, tRY: 0, tZ: 0,
          cRX: 0, cRY: 0, cZ: 0
        });

        charEl.style.color = 'transparent';
      });

      requestAnimationFrame(function () { canvas.style.opacity = '1'; });

      /* ── Mouse ────────────────────────────────────────────── */
      var mx = -9999, my = -9999;
      var ROT_RADIUS  = 120;
      var MAX_ROT     = 0.48;
      var MAX_Z_POP   = 26;
      /* Blob params */
      var BLOB_R      = size3d * 0.38;  /* influence radius in local units */
      var BLOB_STR    = depth  * 1.4;   /* max Z displacement */
      var WAVE_SPEED  = 4.5;
      var WAVE_FREQ   = 0.18;

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        mouseLight.position.set(
          mx - tRect.left - W / 2,
          H / 2 - (my - tRect.top),
          180
        );
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        mx = -9999; my = -9999;
        mouseLight.position.set(0, 0, 180);
      });

      /* ── Render loop ─────────────────────────────────────── */
      var clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();

        /* World-space cursor (ortho: 1 unit = 1 px) */
        var worldCX = mx - tRect.left - W / 2;
        var worldCY = H / 2 - (my - tRect.top);

        /* Ensure world matrices are current before worldToLocal */
        scene.updateMatrixWorld();

        meshItems.forEach(function (m) {
          /* ── 3D rotation / pop (existing) ─────────────────── */
          var dx = mx - m.scrCX;
          var dy = my - m.scrCY;
          var d  = Math.sqrt(dx * dx + dy * dy) || 1;
          var g  = Math.exp(-(d * d) / (2 * ROT_RADIUS * ROT_RADIUS));

          m.tRY =  (dx / d) * MAX_ROT * g;
          m.tRX = -(dy / d) * MAX_ROT * g;
          m.tZ  = g * MAX_Z_POP;

          var idle = (1 - g) * 0.055;
          m.tRX += Math.sin(t * 0.85 + m.phase) * idle;
          m.tRY += Math.cos(t * 0.60 + m.phase) * idle;

          m.cRX += (m.tRX - m.cRX) * 0.09;
          m.cRY += (m.tRY - m.cRY) * 0.09;
          m.cZ  += (m.tZ  - m.cZ)  * 0.09;

          m.mesh.rotation.x = m.cRX;
          m.mesh.rotation.y = m.cRY;
          m.mesh.position.z = m.cZ;

          /* ── Liquid blob vertex deformation ──────────────── */
          _cursor.set(worldCX, worldCY, m.mesh.position.z);
          m.mesh.worldToLocal(_cursor); /* cursor in letter's local space */

          var pos  = m.geo.attributes.position;
          var orig = m.origPos;
          var hasBlob = mx > -9000; /* only deform when mouse on screen */

          for (var i = 0; i < pos.count; i++) {
            var ox = orig[i * 3];
            var oy = orig[i * 3 + 1];
            var oz = orig[i * 3 + 2];

            if (hasBlob) {
              var vdx  = ox - _cursor.x;
              var vdy  = oy - _cursor.y;
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
