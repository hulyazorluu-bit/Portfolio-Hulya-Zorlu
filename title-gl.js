/* ============================================================
   Title WebGL Lens Refraction
   Canvas 2D → texture · GLSL displacement shader · mouse lerp
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.WebGLRenderingContext) return;

  /* ── GLSL ─────────────────────────────────────────────────── */

  var VS = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main(){',
    '  vUv = aPos * 0.5 + 0.5;',
    '  gl_Position = vec4(aPos, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FS = [
    'precision mediump float;',
    'uniform sampler2D uTex;',
    'uniform vec2 uMouse;',
    'uniform vec2 uRes;',
    'uniform float uStr;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 uv   = vUv;',
    '  vec2 m    = vec2(uMouse.x / uRes.x, 1.0 - uMouse.y / uRes.y);',
    '  vec2 d    = uv - m;',
    '  d.x      *= uRes.x / uRes.y;',
    '  float dist = length(d);',
    '  float r    = 110.0 / uRes.y;',
    '  float g    = exp(-dist * dist / (2.0 * r * r));',
    '  vec2 n     = normalize(d + vec2(0.0001));',
    '  gl_FragColor = texture2D(uTex, uv + n * (uStr / uRes.y) * g);',
    '}'
  ].join('\n');

  /* ── Shader helpers ───────────────────────────────────────── */

  function mkShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function mkProgram(gl) {
    var p = gl.createProgram();
    gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER,   VS));
    gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(p);
    return p;
  }

  /* ── Build text texture ────────────────────────────────────── */

  function buildTexture(gl, titleEl) {
    var dpr  = Math.min(window.devicePixelRatio || 1, 2);
    var rect = titleEl.getBoundingClientRect();
    var W    = Math.round(rect.width);
    var H    = Math.round(rect.height);
    if (!W || !H) return null;

    var off = document.createElement('canvas');
    off.width  = W * dpr;
    off.height = H * dpr;
    var ctx = off.getContext('2d');
    ctx.scale(dpr, dpr);

    /* cream background */
    ctx.fillStyle = '#F8F6F2';
    ctx.fillRect(0, 0, W, H);

    /* match CSS typography */
    var fs = parseFloat(window.getComputedStyle(titleEl).fontSize);
    var ls = -0.03 * fs; /* letter-spacing: -0.03em */

    ctx.fillStyle    = '#0A0A0A';
    ctx.font         = '400 ' + fs + 'px montrealbook, sans-serif';
    ctx.textBaseline = 'alphabetic';

    /* render each title row */
    titleEl.querySelectorAll('.ttj').forEach(function (row) {
      var rr   = row.getBoundingClientRect();
      var text = row.textContent.replace(/\s/g, '');
      var m    = ctx.measureText(text);
      var desc = (typeof m.actualBoundingBoxDescent === 'number')
                  ? m.actualBoundingBoxDescent
                  : fs * 0.18;
      var x = rr.left - rect.left;
      var y = rr.bottom - rect.top - desc;

      for (var i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, y);
        x += ctx.measureText(text[i]).width + ls;
      }
    });

    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
    return t;
  }

  /* ── State ────────────────────────────────────────────────── */

  var glCanvas, gl, uMouse, uRes, uStr, tex;
  var mx = -999, my = -999, targetX = -999, targetY = -999;
  var titleEl;

  /* ── Resize ───────────────────────────────────────────────── */

  function resize() {
    if (!gl || !titleEl || !glCanvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var tr  = titleEl.getBoundingClientRect();
    var pr  = glCanvas.parentElement.getBoundingClientRect();
    var W   = Math.round(tr.width);
    var H   = Math.round(tr.height);

    glCanvas.width  = W * dpr;
    glCanvas.height = H * dpr;
    glCanvas.style.width  = W + 'px';
    glCanvas.style.height = H + 'px';
    glCanvas.style.left   = Math.round(tr.left - pr.left) + 'px';
    glCanvas.style.top    = Math.round(tr.top  - pr.top)  + 'px';

    gl.viewport(0, 0, W * dpr, H * dpr);
    if (uRes) gl.uniform2f(uRes, W * dpr, H * dpr);

    if (tex) gl.deleteTexture(tex);
    tex = buildTexture(gl, titleEl);
  }

  /* ── Render loop ──────────────────────────────────────────── */

  function loop() {
    requestAnimationFrame(loop);
    if (!tex) return;
    mx += (targetX - mx) * 0.1;
    my += (targetY - my) * 0.1;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    gl.uniform2f(uMouse, mx * dpr, my * dpr);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /* ── Setup ────────────────────────────────────────────────── */

  function setup() {
    titleEl = document.querySelector('.cnt_tt');
    if (!titleEl) return;

    glCanvas = document.createElement('canvas');
    glCanvas.id = 'title-gl';
    glCanvas.setAttribute('aria-hidden', 'true');

    /* append inside hero_cnt, after the title */
    titleEl.parentElement.appendChild(glCanvas);

    gl = glCanvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) { glCanvas.remove(); return; }

    var glProg = mkProgram(gl);
    gl.useProgram(glProg);

    /* full-screen quad */
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(glProg, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(gl.getUniformLocation(glProg, 'uTex'), 0);
    uMouse = gl.getUniformLocation(glProg, 'uMouse');
    uRes   = gl.getUniformLocation(glProg, 'uRes');
    uStr   = gl.getUniformLocation(glProg, 'uStr');
    gl.uniform1f(uStr, 7.0); /* max displacement px */

    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* mouse tracking */
    document.addEventListener('mousemove', function (e) {
      var r = glCanvas.getBoundingClientRect();
      targetX = e.clientX - r.left;
      targetY = e.clientY - r.top;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      targetX = -999; targetY = -999;
    });

    /* fade in canvas · make HTML chars transparent */
    requestAnimationFrame(function () {
      glCanvas.style.transition = 'opacity 0.5s ease';
      glCanvas.style.opacity    = '1';
      titleEl.querySelectorAll('.ttj .char').forEach(function (ch) {
        ch.style.color = 'transparent';
      });
    });

    loop();
  }

  /* ── Entry ──────────────────────────────────────────────── */

  var ran = false;
  function trySetup() {
    if (ran) return;
    ran = true;
    var el = document.querySelector('.cnt_tt');
    if (!el) return;
    var fs = parseFloat(window.getComputedStyle(el).fontSize);
    var fontSpec = '400 ' + fs + 'px montrealbook';
    var p = (document.fonts && document.fonts.load)
              ? document.fonts.load(fontSpec)
              : Promise.resolve();
    p.then(setup).catch(setup);
  }

  /* Trigger from revealPage() signal */
  document.addEventListener('titleReady', trySetup, { once: true });

  /* Hard fallback: run 3s after window load regardless */
  window.addEventListener('load', function () {
    setTimeout(trySetup, 3000);
  });

})();
