/* ============================================================
   Title Particles 3D — Modèle D
   Samples montrealbook text from Canvas 2D → particle cloud.
   Mouse repulsion + Z scatter + entrance convergence.
   Three.js core loaded via <script defer> in <head>.
   ============================================================ */
(function () {
  'use strict';

  var titleEl = null;

  function start() {
    titleEl = document.querySelector('.cnt_tt');
    if (!titleEl) return;
    if (!window.THREE) { setTimeout(start, 80); return; }

    var ran = false;
    function go() { if (ran) return; ran = true; setTimeout(init, 350); }
    document.addEventListener('titleReady', go, { once: true });
    setTimeout(go, 4500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* ── Circular point texture ─────────────────────────────── */
  function makePointTex() {
    var c = document.createElement('canvas');
    c.width = c.height = 32;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(16, 16, 0, 16, 16, 14);
    g.addColorStop(0,    'rgba(10,10,10,1)');
    g.addColorStop(0.55, 'rgba(10,10,10,0.85)');
    g.addColorStop(1,    'rgba(10,10,10,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }

  /* ── Sample montrealbook pixels → particle positions ─────── */
  function sampleText(W, H) {
    var fs  = parseFloat(window.getComputedStyle(titleEl).fontSize);
    var off = document.createElement('canvas');
    off.width  = W;
    off.height = H;
    var ctx = off.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#000000';
    ctx.font = '400 ' + fs + 'px montrealbook, sans-serif';
    ctx.textBaseline = 'alphabetic';

    var tRect = titleEl.getBoundingClientRect();
    titleEl.querySelectorAll('.ttj').forEach(function (row) {
      var rr   = row.getBoundingClientRect();
      var text = row.textContent.replace(/\s/g, '');
      var m    = ctx.measureText(text);
      var desc = typeof m.actualBoundingBoxDescent === 'number'
                 ? m.actualBoundingBoxDescent : fs * 0.18;
      var x = rr.left - tRect.left;
      var y = rr.bottom - tRect.top - desc;
      var ls = -0.01 * fs;
      for (var i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, y);
        x += ctx.measureText(text[i]).width + ls;
      }
    });

    var STEP = 4;
    var data = ctx.getImageData(0, 0, W, H).data;
    var pts  = [];
    for (var py = 0; py < H; py += STEP) {
      for (var px = 0; px < W; px += STEP) {
        var k = (py * W + px) * 4;
        if (data[k] < 110) {
          pts.push(px - W / 2, H / 2 - py);
        }
      }
    }
    return pts; /* flat [x,y, x,y, ...] */
  }

  /* ── Main ───────────────────────────────────────────────── */
  function init() {
    var parentEl = titleEl.parentElement;
    parentEl.style.position = 'relative';
    var pRect = parentEl.getBoundingClientRect();
    var tRect = titleEl.getBoundingClientRect();
    var W = Math.round(tRect.width);
    var H = Math.round(tRect.height);
    if (!W || !H) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pts2d = sampleText(W, H);
    var N = pts2d.length / 2;
    if (N < 10) return;

    /* ── Renderer ─────────────────────────────────────────── */
    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    var canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:10;opacity:0;transition:opacity 0.5s;';
    canvas.style.left = Math.round(tRect.left - pRect.left) + 'px';
    canvas.style.top  = Math.round(tRect.top  - pRect.top)  + 'px';
    parentEl.appendChild(canvas);

    /* ── Scene ───────────────────────────────────────────── */
    var scene  = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, -500, 500);
    camera.position.z = 200;

    /* ── Buffers ─────────────────────────────────────────── */
    var positions  = new Float32Array(N * 3);
    var homes      = new Float32Array(N * 3);
    var velocities = new Float32Array(N * 3);
    var phases     = new Float32Array(N);

    for (var i = 0; i < N; i++) {
      var hx = pts2d[i * 2];
      var hy = pts2d[i * 2 + 1];
      homes[i*3]   = hx;
      homes[i*3+1] = hy;
      homes[i*3+2] = 0;
      phases[i]    = i * 0.23;
      /* Entrance: scattered randomly across canvas */
      positions[i*3]   = (Math.random() - 0.5) * W * 1.6;
      positions[i*3+1] = (Math.random() - 0.5) * H * 2.0;
      positions[i*3+2] = (Math.random() - 0.5) * 140;
    }

    var geo  = new THREE.BufferGeometry();
    var attr = new THREE.BufferAttribute(positions, 3);
    geo.setAttribute('position', attr);

    var mat = new THREE.PointsMaterial({
      size:            2.8,
      map:             makePointTex(),
      transparent:     true,
      alphaTest:       0.005,
      depthTest:       false,
      sizeAttenuation: true,
      color:           0x0a0a0a
    });

    scene.add(new THREE.Points(geo, mat));

    /* Fade in canvas + hide HTML chars */
    requestAnimationFrame(function () { canvas.style.opacity = '1'; });
    titleEl.querySelectorAll('.ttj .char').forEach(function (ch) {
      ch.style.color = 'transparent';
    });

    /* ── Physics params ──────────────────────────────────── */
    var SPRING  = 0.072;
    var DAMPING = 0.80;
    var REPEL_R = 85;   /* px repulsion radius */
    var REPEL_F = 4.2;  /* repulsion force */
    var IDLE_Z  = 3.5;  /* idle Z oscillation amplitude */

    var worldMX = -99999, worldMY = -99999;

    document.addEventListener('mousemove', function (e) {
      worldMX = e.clientX - tRect.left - W / 2;
      worldMY = H / 2 - (e.clientY - tRect.top);
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      worldMX = -99999; worldMY = -99999;
    });

    /* ── Render loop ─────────────────────────────────────── */
    var clock   = new THREE.Clock();
    var hasRepel = false;

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      hasRepel = worldMX > -9000;
      var pos = attr.array;

      for (var i = 0; i < N; i++) {
        var i3 = i * 3;
        var px = pos[i3], py = pos[i3+1], pz = pos[i3+2];
        var hx = homes[i3], hy = homes[i3+1];
        /* Idle Z target: slow sine per particle */
        var hz = Math.sin(t * 0.7 + phases[i]) * IDLE_Z;

        /* Spring toward home */
        var fx = (hx - px) * SPRING;
        var fy = (hy - py) * SPRING;
        var fz = (hz - pz) * SPRING;

        /* Mouse repulsion */
        if (hasRepel) {
          var dx = px - worldMX;
          var dy = py - worldMY;
          var d  = Math.sqrt(dx * dx + dy * dy) || 1;
          if (d < REPEL_R) {
            var str = (1 - d / REPEL_R) * REPEL_F;
            fx += (dx / d) * str;
            fy += (dy / d) * str;
            fz += str * 0.55; /* push toward viewer */
          }
        }

        /* Integrate velocity */
        velocities[i3]   = (velocities[i3]   + fx) * DAMPING;
        velocities[i3+1] = (velocities[i3+1] + fy) * DAMPING;
        velocities[i3+2] = (velocities[i3+2] + fz) * DAMPING;

        pos[i3]   = px + velocities[i3];
        pos[i3+1] = py + velocities[i3+1];
        pos[i3+2] = pz + velocities[i3+2];
      }

      attr.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();

    /* ── Resize ─────────────────────────────────────────── */
    window.addEventListener('resize', function () {
      tRect = titleEl.getBoundingClientRect();
      var pR = parentEl.getBoundingClientRect();
      W = Math.round(tRect.width);
      H = Math.round(tRect.height);
      renderer.setSize(W, H);
      camera.left = -W/2; camera.right  =  W/2;
      camera.top  =  H/2; camera.bottom = -H/2;
      camera.updateProjectionMatrix();
      canvas.style.left = Math.round(tRect.left - pR.left) + 'px';
      canvas.style.top  = Math.round(tRect.top  - pR.top)  + 'px';
    }, { passive: true });
  }

})();
