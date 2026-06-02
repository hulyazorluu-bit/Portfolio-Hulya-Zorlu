/**
 * fx-bg.js
 * WebGL Perlin/simplex noise overlay on the hero section.
 * No external dependencies — browser only.
 */
(function () {
  'use strict';

  var VS = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  var FS = `
    precision mediump float;
    uniform float uTime;
    varying vec2 vUv;

    // --- 2D Simplex Noise ---
    vec3 mod289v3(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec2 mod289v2(vec2 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec3 permute(vec3 x){return mod289v3(((x * 34.0) + 1.0) * x);}

    float snoise(vec2 v){
      const vec4 C = vec4(
        0.211324865405187,
        0.366025403784439,
       -0.577350269189626,
        0.024390243902439
      );
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289v2(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x  = 2.0 * fract(p * C.www) - 1.0;
      vec3 h  = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x  * x0.x   + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // --- FBM (4 octaves) ---
    float fbm(vec2 uv){
      float val   = 0.0;
      float amp   = 0.5;
      float freq  = 1.0;
      for(int i = 0; i < 4; i++){
        val  += snoise(uv * freq) * amp;
        amp  *= 0.5;
        freq *= 2.0;
      }
      return val;
    }

    void main(){
      vec2 uv = vUv * 3.5 + uTime * 0.04;
      float n = fbm(uv);
      // Remap from [-1,1] to [0,1] range roughly
      n = n * 0.5 + 0.5;
      gl_FragColor = vec4(0.04, 0.04, 0.04, n * 0.06);
    }
  `;

  function createShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('fx-bg shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function init() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Ensure hero is positioned
    if (window.getComputedStyle(hero).position === 'static') {
      hero.style.position = 'relative';
    }

    var canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:1',
      'opacity:0.045',
      'display:block'
    ].join(';');
    hero.insertBefore(canvas, hero.firstChild);

    var gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) { canvas.remove(); return; }

    var vs = createShader(gl, gl.VERTEX_SHADER, VS);
    var fs = createShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { canvas.remove(); return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('fx-bg link error:', gl.getProgramInfoLog(prog));
      canvas.remove();
      return;
    }

    var quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    var buf  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    var aPos  = gl.getAttribLocation(prog, 'aPos');
    var uTime = gl.getUniformLocation(prog, 'uTime');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var startTime = performance.now();

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var w = hero.offsetWidth;
      var h = hero.offsetHeight;
      // Half resolution for performance
      canvas.width  = Math.floor(w * dpr * 0.5);
      canvas.height = Math.floor(h * dpr * 0.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function render() {
      requestAnimationFrame(render);
      var t = (performance.now() - startTime) * 0.001;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    resize();
    render();
    window.addEventListener('resize', resize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
