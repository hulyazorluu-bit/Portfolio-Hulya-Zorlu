/* ============================================================
   Hulya Zorlu Portfolio — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Loader ── */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      startReveal();
    }, 1800);
  });

  document.body.style.overflow = 'hidden';

  /* ── Custom Cursor ── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = 'a, button, .tag, .project-card__media, .btn';

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  /* ── Sticky Nav ── */
  const nav = document.getElementById('nav');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile Menu ── */
  const menuToggle  = document.getElementById('menuToggle');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let menuOpen = false;

  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const spans = menuToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(3.75px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-3.75px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });

  /* ── Typed Text ── */
  const typedEl   = document.getElementById('typed');
  const words     = ['UI/UX Designer', 'Web Designer', 'Creative'];
  let   wordIdx   = 0;
  let   charIdx   = 0;
  let   isDeleting = false;
  let   typeTimer;

  function typeLoop() {
    const currentWord = words[wordIdx];
    const displayed   = currentWord.slice(0, charIdx);
    typedEl.textContent = displayed;

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === currentWord.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 400;
    }

    charIdx += isDeleting ? -1 : 1;
    typeTimer = setTimeout(typeLoop, delay);
  }

  /* ── Scroll Reveal ── */
  function startReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.04) + 's';
      observer.observe(el);
    });

    typeLoop();
  }

  /* ── Parallax Hero ── */
  const heroBgText = document.querySelector('.hero__bg-text');
  const heroAccent = document.querySelector('.hero__accent');

  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      heroBgText.style.transform = `translateX(-50%) translateY(${sy * 0.25}px)`;
      if (heroAccent) {
        heroAccent.style.transform = `translateY(${sy * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ── Active nav link highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

}());
