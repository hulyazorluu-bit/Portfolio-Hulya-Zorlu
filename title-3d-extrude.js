/* ============================================================
   Title 3D Extruded — Three.js per-letter (Modèle C)
   Real extruded geometry, independent rotation per letter,
   mouse-following point light, idle float animation.
   Three.js loaded via <script defer> in <head>.
   ============================================================ */
(function () {
  'use strict';

  var CDN_FONT = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json';

  function waitAndInit() {
    if (!window.THREE || !THREE.FontLoader || !THREE.TextGeometry) {
      setTimeout(waitAndInit, 80);
      return;
    }
    var titleEl = document.querySelector('.cnt_tt');
    if (!titleEl) return;

    var ran = false;
    function go() {
      if (ran) return; ran = true;
      setTimeout(function () { init(titleEl); }, 400);
    }
    document.addEventListener('titleReady', go, { once: true });
    setTimeout(go, 4500);
  }

  document.addEventListener('DOMContentLoaded', waitAndInit);

  /* ── Main ───────────────────────────────────────────────── */
  function init(titleEl) {
    var charEls = Array.from(titleEl.querySelectorAll('.ttj .char'));
    if (!charEls.length) return;

    var parentEl = titleEl.parentElement;
    var pRect    = parentEl.getBoundingClientRect();
    var tRect    = titleEl.getBoundingClientRect();
    var W = Math.round(tRect.width);
    var H = Math.round(tRect.height);
    if (!W || !H) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ── Renderer ─────────────────────────────────────────── */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;

    var canvas = renderer.domElement;
    canvas.id  = 'title-3d-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:10;opacity:0;transition:opacity 0.6s;';
    canvas.style.left = Math.round(tRect.left - pRect.left) + 'px';
    canvas.style.top  = Math.round(tRect.top  - pRect.top)  + 'px';
    parentEl.style.position = 'relative';
    parentEl.appendChild(canvas);

    /* ── Scene / Camera ───────────────────────────────────── */
    var scene  = new THREE.Scene();
    /* Orthographic: 1 THREE unit = 1 CSS pixel */
    var camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, -800, 800);
    camera.position.z = 200;

    /* ── Lights ────────────────────────────────────────────── */
    var ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    var keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(120, 200, 300);
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(0xdddddd, 0.4);
    fillLight.position.set(-150, -80, 100);
    scene.add(fillLight);

    /* Point light that follows mouse — creates dramatic per-letter highlights */
    var mouseLight = new THREE.PointLight(0xffffff, 1.8, 500);
    mouseLight.position.set(0, 0, 180);
    scene.add(mouseLight);

    /* ── Load font → build meshes ─────────────────────────── */
    var loader = new THREE.FontLoader();
    loader.load(CDN_FONT, function (font) {

      var fs     = parseFloat(window.getComputedStyle(titleEl).fontSize);
      var size3d = fs * 0.68;   /* helvetiker_bold cap-height scale */
      var depth  = fs * 0.12;   /* extrusion thickness */

      var meshItems = [];

      charEls.forEach(function (charEl, idx) {
        var ch = charEl.textContent.trim();
        if (!ch || ch === ' ') return;

        var geo = new THREE.TextGeometry(ch, {
          font:           font,
          size:           size3d,
          height:         depth,
          curveSegments:  10,
          bevelEnabled:   true,
          bevelThickness: depth * 0.25,
          bevelSize:      depth * 0.18,
          bevelSegments:  5
        });

        geo.computeBoundingBox();
        var bb = geo.boundingBox;
        var gW = bb.max.x - bb.min.x;
        var gH = bb.max.y - bb.min.y;

        var mat = new THREE.MeshStandardMaterial({
          color:     0x0a0a0a,
          metalness: 0.25,
          roughness: 0.38
        });

        var mesh = new THREE.Mesh(geo, mat);

        /* Position: screen coords → ortho coords */
        var cr  = charEl.getBoundingClientRect();
        var scrCX = cr.left + cr.width  / 2 - tRect.left;
        var scrCY = cr.top  + cr.height / 2 - tRect.top;

        mesh.position.x = scrCX - W / 2 - gW / 2;
        mesh.position.y = H / 2 - scrCY - gH / 2;
        mesh.position.z = 0;

        scene.add(mesh);

        /* Per-letter state */
        meshItems.push({
          mesh:   mesh,
          scrCX:  cr.left + cr.width  / 2,
          scrCY:  cr.top  + cr.height / 2,
          phase:  idx * 0.62,   /* idle animation phase offset */
          tRX: 0, tRY: 0, tZ: 0,
          cRX: 0, cRY: 0, cZ: 0
        });

        charEl.style.color = 'transparent';
      });

      /* Fade in once all meshes built */
      requestAnimationFrame(function () { canvas.style.opacity = '1'; });

      /* ── Mouse state ──────────────────────────────────────── */
      var mx = -9999, my = -9999;
      var RADIUS  = 120;  /* px per-letter influence */
      var MAX_ROT = 0.52; /* rad ≈ 30° */
      var MAX_Z   = 28;   /* px pop-out */

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        /* Move point light into 3D space */
        var lx = (e.clientX - tRect.left - W / 2);
        var ly = -(e.clientY - tRect.top  - H / 2);
        mouseLight.position.set(lx, ly, 180);
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        mx = -9999; my = -9999;
        mouseLight.position.set(0, 0, 180);
      });

      /* ── Render loop ──────────────────────────────────────── */
      var clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();

        meshItems.forEach(function (m) {
          var dx = mx - m.scrCX;
          var dy = my - m.scrCY;
          var d  = Math.sqrt(dx * dx + dy * dy) || 1;
          var g  = Math.exp(-(d * d) / (2 * RADIUS * RADIUS));

          /* Mouse-driven rotation */
          m.tRY =  (dx / d) * MAX_ROT * g;
          m.tRX = -(dy / d) * MAX_ROT * g;
          m.tZ  = g * MAX_Z;

          /* Idle: subtle per-letter float when mouse is away */
          var idle = (1 - g) * 0.06;
          m.tRX += Math.sin(t * 0.9  + m.phase) * idle;
          m.tRY += Math.cos(t * 0.65 + m.phase) * idle;

          /* Spring lerp */
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

    }, undefined, function (err) {
      console.warn('Three.js font failed to load:', err);
    });

    /* ── Resize ─────────────────────────────────────────────── */
    window.addEventListener('resize', function () {
      var tR = titleEl.getBoundingClientRect();
      var pR = parentEl.getBoundingClientRect();
      var nW = Math.round(tR.width);
      var nH = Math.round(tR.height);
      renderer.setSize(nW, nH);
      camera.left = -nW/2; camera.right  =  nW/2;
      camera.top  =  nH/2; camera.bottom = -nH/2;
      camera.updateProjectionMatrix();
      canvas.style.left = Math.round(tR.left - pR.left) + 'px';
      canvas.style.top  = Math.round(tR.top  - pR.top)  + 'px';
      tRect = tR;
    }, { passive: true });
  }

})();
