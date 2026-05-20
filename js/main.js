/* =============================================
   PORTFOLIO — MAIN JAVASCRIPT
   Effects: loader, custom cursor, magnetic,
   noise, smooth scroll, GSAP reveals,
   WebGL distortion on project hover
   ============================================= */

'use strict';

// ─── UTILS ───────────────────────────────────
const lerp   = (a, b, t) => a + (b - a) * t;
const clamp  = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
const qs     = (sel, ctx = document) => ctx.querySelector(sel);
const qsa    = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =============================================
   NOISE CANVAS
   Animated film-grain overlay
   ============================================= */
function initNoise() {
    const canvas = qs('#noiseCanvas');
    const ctx    = canvas.getContext('2d');
    const dpr    = Math.min(window.devicePixelRatio, 2);
    let raf;

    function resize() {
        canvas.width  = window.innerWidth  * dpr;
        canvas.height = window.innerHeight * dpr;
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const img = ctx.createImageData(w, h);
        const d   = img.data;
        for (let i = 0; i < d.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            d[i] = d[i+1] = d[i+2] = v;
            d[i+3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
}

/* =============================================
   CUSTOM CURSOR
   Outer circle lags behind, inner follows exactly
   ============================================= */
function initCursor() {
    const outer = qs('#cursorOuter');
    const inner = qs('#cursorInner');
    let mx = -200, my = -200;
    let ox = -200, oy = -200;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        inner.style.left = mx + 'px';
        inner.style.top  = my + 'px';
        qs('#cursorText').style.left = mx + 'px';
        qs('#cursorText').style.top  = my + 'px';
    });

    function loop() {
        ox = lerp(ox, mx, .1);
        oy = lerp(oy, my, .1);
        outer.style.left = ox + 'px';
        outer.style.top  = oy + 'px';
        requestAnimationFrame(loop);
    }
    loop();

    // States
    qsa('a, button, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
    });

    qsa('.project').forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('is-project');
            document.body.classList.remove('is-hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-project');
        });
    });

    document.addEventListener('mouseleave', () => { qs('#cursor').style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { qs('#cursor').style.opacity = '1'; });
}

/* =============================================
   MAGNETIC EFFECT
   Elements gently pull toward the cursor
   ============================================= */
function initMagnetic() {
    qsa('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width  / 2)) * .3;
            const dy = (e.clientY - (r.top  + r.height / 2)) * .3;
            gsap.to(el, { x: dx, y: dy, duration: .5, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.5)' });
        });
    });
}

/* =============================================
   LOADER
   Counter 0→100, then slide up to reveal page
   ============================================= */
function runLoader() {
    return new Promise(resolve => {
        const numEl    = qs('#counterNumber');
        const fillEl   = qs('#progressFill');
        const loader   = qs('#loader');
        const header   = qs('#header');
        const DURATION = 2400;
        const start    = performance.now();

        function tick(now) {
            const p  = clamp((now - start) / DURATION, 0, 1);
            // Ease in-out cubic
            const ep = p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
            const n  = Math.floor(ep * 100);
            numEl.textContent  = n;
            fillEl.style.width = n + '%';
            if (p < 1) {
                requestAnimationFrame(tick);
            } else {
                numEl.textContent  = '100';
                fillEl.style.width = '100%';
                setTimeout(() => {
                    // Slide loader up
                    gsap.to(loader, {
                        yPercent: -100,
                        duration: 1.1,
                        ease: 'power4.inOut',
                        onComplete: () => {
                            loader.style.display = 'none';
                            gsap.to(header, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' });
                            resolve();
                        }
                    });
                }, 350);
            }
        }
        requestAnimationFrame(tick);
    });
}

/* =============================================
   SMOOTH SCROLL  — Lenis
   ============================================= */
let lenis;
function initSmoothScroll() {
    lenis = new Lenis({
        duration:      1.5,
        easing:        t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel:   true,
        wheelMultiplier: .85,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
}

/* =============================================
   TEXT HELPERS
   ============================================= */

/* Wrap every word in a span for word-scrub */
function wrapWords(el) {
    const raw   = el.textContent.trim();
    const words = raw.split(/\s+/);
    el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
    return qsa('.word', el);
}

/* =============================================
   HERO ENTRANCE
   ============================================= */
function animateHero() {
    const tl = gsap.timeline({ delay: .15 });

    // All .line-inner inside hero slide up from translateY(110%)
    const lines = qsa('.hero .line-inner');
    tl.to(lines, {
        y: '0%',
        duration: 1.3,
        stagger: .09,
        ease: 'power4.out'
    }, 0);

    return tl;
}

/* =============================================
   SCROLL ANIMATIONS  — GSAP + ScrollTrigger
   ============================================= */
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* --- Generic line reveals (skip hero, handled separately) --- */
    qsa('.line-inner').forEach(el => {
        if (el.closest('.hero')) return;
        gsap.to(el, {
            y: '0%',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 88%',
                toggleActions:'play none none none'
            }
        });
    });

    /* --- Project rows fade-in --- */
    qsa('.project').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            y: 24,
            duration: .7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger:      item,
                start:        'top 88%',
                toggleActions:'play none none none'
            }
        });
    });

    /* --- About list items stagger --- */
    gsap.from(qsa('.about__list li'), {
        opacity: 0,
        y: 16,
        stagger: .05,
        duration: .6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger:      '.about__cols',
            start:        'top 80%',
            toggleActions:'play none none none'
        }
    });

    gsap.from('.about__small', {
        opacity: 0,
        y: 20,
        duration: .8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger:      '.about__small',
            start:        'top 88%',
            toggleActions:'play none none none'
        }
    });

    /* --- About big paragraph: word-by-word color scrub --- */
    const bigPara = qs('.about__big');
    if (bigPara) {
        const words = wrapWords(bigPara);
        gsap.to(words, {
            color: 'var(--fg)',
            stagger: .04,
            ease: 'none',
            scrollTrigger: {
                trigger: bigPara,
                start:   'top 72%',
                end:     'bottom 42%',
                scrub:   1.2
            }
        });
    }

    /* --- Contact title lines --- */
    qsa('.contact .line-inner').forEach(el => {
        gsap.to(el, {
            y: '0%',
            duration: 1.1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 88%',
                toggleActions:'play none none none'
            }
        });
    });

    /* --- Section labels fade --- */
    qsa('.section-label, .section-count').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            duration: .6,
            scrollTrigger: {
                trigger:      el,
                start:        'top 90%',
                toggleActions:'play none none none'
            }
        });
    });

    /* --- Footer fade --- */
    gsap.from('.footer', {
        opacity: 0,
        duration: .6,
        scrollTrigger: {
            trigger:      '.footer',
            start:        'top 95%',
            toggleActions:'play none none none'
        }
    });

    /* --- Hero parallax on scroll --- */
    gsap.to('.hero__title', {
        y: -90,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start:   'top top',
            end:     'bottom top',
            scrub:   1.4
        }
    });

    gsap.to('.hero__eyebrow, .hero__bottom', {
        y: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start:   'top top',
            end:     '40% top',
            scrub:   1
        }
    });
}

/* =============================================
   WEBGL — Distortion shader on project hover
   Uses Three.js + simplex noise in GLSL
   ============================================= */
function initWebGL() {
    const canvas = qs('#webglCanvas');
    if (!canvas || typeof THREE === 'undefined') return null;

    const W = 400, H = 270;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10);
    camera.position.z = 1;

    /* ---- GLSL shaders ---- */
    const vert = /* glsl */`
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
    `;

    const frag = /* glsl */`
        uniform float uTime;
        uniform float uStrength;   // 0→1 lerped on hover
        uniform vec3  uColorA;
        uniform vec3  uColorB;
        uniform vec2  uMouse;
        varying vec2  vUv;

        // ---- Simplex noise 3D ----
        vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
        vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
            const vec2 C=vec2(1./6.,1./3.);
            const vec4 D=vec4(0.,.5,1.,2.);
            vec3 i=floor(v+dot(v,C.yyy));
            vec3 x0=v-i+dot(i,C.xxx);
            vec3 g=step(x0.yzx,x0.xyz);
            vec3 l=1.-g;
            vec3 i1=min(g.xyz,l.zxy);
            vec3 i2=max(g.xyz,l.zxy);
            vec3 x1=x0-i1+C.xxx;
            vec3 x2=x0-i2+C.yyy;
            vec3 x3=x0-D.yyy;
            i=mod289v3(i);
            vec4 p=permute(permute(permute(
                i.z+vec4(0.,i1.z,i2.z,1.))
                +i.y+vec4(0.,i1.y,i2.y,1.))
                +i.x+vec4(0.,i1.x,i2.x,1.));
            float n_=.142857142857;
            vec3 ns=n_*D.wyz-D.xzx;
            vec4 j=p-49.*floor(p*ns.z*ns.z);
            vec4 x_=floor(j*ns.z);
            vec4 y_=floor(j-7.*x_);
            vec4 x=x_*ns.x+ns.yyyy;
            vec4 y=y_*ns.x+ns.yyyy;
            vec4 h=1.-abs(x)-abs(y);
            vec4 b0=vec4(x.xy,y.xy);
            vec4 b1=vec4(x.zw,y.zw);
            vec4 s0=floor(b0)*2.+1.;
            vec4 s1=floor(b1)*2.+1.;
            vec4 sh=-step(h,vec4(0.));
            vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
            vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
            vec3 p0=vec3(a0.xy,h.x);
            vec3 p1=vec3(a0.zw,h.y);
            vec3 p2=vec3(a1.xy,h.z);
            vec3 p3=vec3(a1.zw,h.w);
            vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
            vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
            m=m*m;
            return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }
        // ---- end noise ----

        void main(){
            vec2 uv = vUv;
            float s  = uStrength;

            // Slow base noise distortion
            float n1 = snoise(vec3(uv*2.5, uTime*.35));
            float n2 = snoise(vec3(uv*4.5+1.7, uTime*.25));

            // Mouse-proximity ripple
            float dist      = distance(uv, uMouse);
            float proximity = smoothstep(.55, 0., dist) * s;
            float ripple    = snoise(vec3(uv*6., uTime*.6));

            uv.x += (n1*.04 + n2*.025) * s;
            uv.y += (n2*.04 + n1*.025) * s;
            uv.x += sin(uv.y*9. + uTime*1.2) * .018 * proximity;
            uv.y += cos(uv.x*9. + uTime*1.2) * .018 * proximity;

            // Gradient color
            vec3 col = mix(uColorA, uColorB, uv.y + n1*.18);

            // Shimmer highlight
            float shimmer = snoise(vec3(uv*12., uTime)) * .08 * s;
            col = clamp(col + shimmer, 0., 1.);

            // Vignette
            vec2 vig = vUv*2.-1.;
            float v  = 1. - dot(vig*.55, vig*.55);
            col *= clamp(v, 0., 1.);

            // Fractal detail overlay
            float detail = snoise(vec3(uv*18., uTime*.2)) * .04 * s;
            col += vec3(detail);

            gl_FragColor = vec4(clamp(col,0.,1.), 1.);
        }
    `;

    const uniforms = {
        uTime:     { value: 0 },
        uStrength: { value: 0 },
        uColorA:   { value: new THREE.Color('#0d1b2a') },
        uColorB:   { value: new THREE.Color('#162340') },
        uMouse:    { value: new THREE.Vector2(.5, .5) }
    };

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms })
    );
    scene.add(mesh);

    // Mouse relative to canvas
    document.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        uniforms.uMouse.value.set(
            (e.clientX - r.left) / r.width,
            1 - (e.clientY - r.top)  / r.height
        );
    });

    // Animation loop
    let targetStrength = 0;
    (function loop() {
        requestAnimationFrame(loop);
        uniforms.uTime.value     += .012;
        uniforms.uStrength.value  = lerp(uniforms.uStrength.value, targetStrength, .055);
        renderer.render(scene, camera);
    })();

    return {
        setActive(on) { targetStrength = on ? 1 : 0; },
        setColors(a, b) {
            uniforms.uColorA.value.set(a);
            uniforms.uColorB.value.set(b);
        }
    };
}

/* =============================================
   PROJECT HOVER  — floating preview card
   ============================================= */
function initProjectHover(webgl) {
    const card     = qs('#previewCard');
    let tx = 0, ty = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    (function loop() {
        cx = lerp(cx, tx, .09);
        cy = lerp(cy, ty, .09);
        card.style.left = cx + 'px';
        card.style.top  = cy + 'px';
        requestAnimationFrame(loop);
    })();

    qsa('.project').forEach(item => {
        const colorA = item.dataset.color || '#0d1b2a';
        // Derive a slightly lighter color for gradient
        const colorB = colorA; // WebGL shader handles it

        item.addEventListener('mouseenter', () => {
            card.classList.add('is-active');
            if (webgl) {
                webgl.setActive(true);
                webgl.setColors(colorA, colorA);
            }
        });

        item.addEventListener('mouseleave', () => {
            card.classList.remove('is-active');
            if (webgl) webgl.setActive(false);
        });
    });
}

/* =============================================
   INIT
   ============================================= */
async function init() {
    // Noise runs immediately (visible during load)
    initNoise();

    // Cursor
    initCursor();

    // WebGL (boot early so shader compiles)
    const webgl = initWebGL();

    // Loader — wait until complete
    await runLoader();

    // Smooth scroll
    initSmoothScroll();

    // GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance animation
    animateHero();

    // Scroll-based animations
    initScrollAnimations();

    // Magnetic
    initMagnetic();

    // Project hover + WebGL preview
    initProjectHover(webgl);
}

document.addEventListener('DOMContentLoaded', init);
