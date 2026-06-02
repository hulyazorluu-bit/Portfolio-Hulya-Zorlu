/* ============================================================
   Title 3D Extruded — Modèle C (lettres 3D extrudées)
   Three.js per-letter meshes, each reacts independently
   ============================================================ */
(function () {
  'use strict';

  var titleEl = document.querySelector('.cnt_tt');
  if (!titleEl) return;

  /* ── Load Three.js + addons, then init ─────────────────── */
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src; s.onload = cb; document.head.appendChild(s);
  }

  var CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0';

  loadScript(CDN + '/build/three.min.js', function () {
    loadScript(CDN + '/examples/js/loaders/FontLoader.js', function () {
      loadScript(CDN + '/examples/js/geometries/TextGeometry.js', function () {
        waitForTitle();
      });
    });
  });

  /* ── Wait for title reveal ─────────────────────────────── */
  function waitForTitle() {
    var ran = false;
    function go() { if (ran) return; ran = true; setTimeout(init, 300); }
    document.addEventListener('titleReady', go, { once: true });
    setTimeout(go, 4000);
  }

  /* ── Main init ─────────────────────────────────────────── */
  function init() {
    var charEls = Array.from(titleEl.querySelectorAll('.ttj .char'));
    if (!charEls.length) return;

    var parentEl = titleEl.parentElement;
    var pRect    = parentEl.getBoundingClientRect();
    var tRect    = titleEl.getBoundingClientRect();

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W   = Math.round(tRect.width);
    var H   = Math.round(tRect.height);
    if (!W || !H) return;

    /* ── Renderer ─────────────────────────────────────────── */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    var canvas = renderer.domElement;
    canvas.id  = 'title-3d-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:absolute;pointer-events:none;z-index:10;opacity:0;transition:opacity 0.5s;';
    canvas.style.left = Math.round(tRect.left - pRect.left) + 'px';
    canvas.style.top  = Math.round(tRect.top  - pRect.top)  + 'px';
    parentEl.appendChild(canvas);

    /* ── Scene + Camera (ortho: 1 unit = 1 css px) ─────────── */
    var scene  = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, -600, 600);
    camera.position.z = 200;

    /* ── Lights ────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(80, 120, 300);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-80, -60, 100);
    scene.add(fill);

    /* ── Font + meshes ─────────────────────────────────────── */
    var loader = new THREE.FontLoader();
    var FONT_URL = CDN + '/examples/fonts/helvetiker_regular.typeface.json';

    loader.load(FONT_URL, function (font) {
      var fs = parseFloat(window.getComputedStyle(titleEl).fontSize);
      /* helvetiker scale: size param ≈ cap-height. Empirically ~0.72 of CSS px */
      var size3d  = fs * 0.72;
      var depth3d = fs * 0.09;  /* extrusion thickness */

      var meshes = [];

      charEls.forEach(function (charEl) {
        var ch = charEl.textContent.trim();
        if (!ch || ch === ' ') return;

        /* Measure char position relative to canvas */
        var cr  = charEl.getBoundingClientRect();
        var geo = new THREE.TextGeometry(ch, {
          font:           font,
          size:           size3d,
          height:         depth3d,
          curveSegments:  8,
          bevelEnabled:   true,
          bevelThickness: depth3d * 0.15,
          bevelSize:      depth3d * 0.10,
          bevelSegments:  4
        });

        geo.computeBoundingBox();
        var bb  = geo.boundingBox;
        var gW  = bb.max.x - bb.min.x;
        var gH  = bb.max.y - bb.min.y;

        var mat = new THREE.MeshPhongMaterial({
          color:     0x0a0a0a,
          specular:  0x555555,
          shininess: 60,
          flatShading: false
        });

        var mesh = new THREE.Mesh(geo, mat);

        /* Convert screen → ortho coords (Y flipped) */
        var scrCX = cr.left + cr.width  / 2 - tRect.left;
        var scrCY = cr.top  + cr.height / 2 - tRect.top;
        mesh.position.x = scrCX - W / 2 - gW / 2;
        mesh.position.y = H / 2 - scrCY - gH / 2;
        mesh.position.z = 0;

        scene.add(mesh);

        meshes.push({
          mesh:  mesh,
          scrCX: cr.left + cr.width  / 2,
          scrCY: cr.top  + cr.height / 2,
          tRX: 0, tRY: 0, tZ: 0,
          cRX: 0, cRY: 0, cZ: 0
        });

        /* Hide HTML text */
        charEl.style.color = 'transparent';
      });

      /* Fade in canvas once meshes ready */
      requestAnimationFrame(function () {
        canvas.style.opacity = '1';
      });

      /* ── Mouse ───────────────────────────────────────────── */
      var mx = -9999, my = -9999;
      var RADIUS  = 110;  /* px influence radius per letter */
      var MAX_ROT = 0.42; /* radians */
      var MAX_Z   = 22;   /* px pop-out */

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        mx = -9999; my = -9999;
      });

      /* ── Render loop ─────────────────────────────────────── */
      function animate() {
        requestAnimationFrame(animate);

        meshes.forEach(function (m) {
          var dx = mx - m.scrCX;
          var dy = my - m.scrCY;
          var d  = Math.sqrt(dx * dx + dy * dy) || 1;
          var g  = Math.exp(-(d * d) / (2 * RADIUS * RADIUS));

          m.tRY =  (dx / d) * MAX_ROT * g;
          m.tRX = -(dy / d) * MAX_ROT * g;
          m.tZ  = g * MAX_Z;

          m.cRX += (m.tRX - m.cRX) * 0.09;
          m.cRY += (m.tRY - m.cRY) * 0.09;
          m.cZ  += (m.tZ  - m.cZ)  * 0.09;

          m.mesh.rotation.x = m.cRX;
          m.mesh.rotation.y = m.cRY;
          m.mesh.position.z = m.cZ;
        });

        renderer.render(scene, camera);
      }

      animate();
    });

    /* ── Resize ────────────────────────────────────────────── */
    window.addEventListener('resize', function () {
      var tR = titleEl.getBoundingClientRect();
      var pR = parentEl.getBoundingClientRect();
      var nW = Math.round(tR.width);
      var nH = Math.round(tR.height);
      renderer.setSize(nW, nH);
      camera.left   = -nW / 2; camera.right  = nW / 2;
      camera.top    =  nH / 2; camera.bottom = -nH / 2;
      camera.updateProjectionMatrix();
      canvas.style.left = Math.round(tR.left - pR.left) + 'px';
      canvas.style.top  = Math.round(tR.top  - pR.top)  + 'px';
    }, { passive: true });
  }

})();
