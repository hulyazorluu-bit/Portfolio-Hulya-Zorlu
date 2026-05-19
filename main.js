
Copier

/* =============================================================
   HULYA ZORLU — Portfolio v21
   main.js — Clock · Typewriter scroll · Mobile menu
   ============================================================= */
 
/* ── Horloge Paris (AM/PM) ───────────────────────────────────── */
(function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
 
  function tick() {
    const fmt = new Intl.DateTimeFormat('fr', {
      timeZone: 'Europe/Paris',
      hour:     '2-digit',
      minute:   '2-digit',
      hour12:   true,      // AM/PM
    });
    // formatToParts pour séparer heure, minute et dayperiod
    const parts = fmt.formatToParts(new Date());
    const h   = parts.find(p => p.type === 'hour')?.value   || '00';
    const m   = parts.find(p => p.type === 'minute')?.value || '00';
    const dp  = parts.find(p => p.type === 'dayPeriod')?.value || '';
 
    // affichage : _PAR 10:29 PM
    el.textContent = `_PAR ${h}:${m} ${dp.toUpperCase()}`;
  }
 
  tick();
  // mise à jour chaque minute à la seconde pile
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => {
    tick();
    setInterval(tick, 60000);
  }, msUntilNextMinute);
})();
 
 
/* ── Typewriter "SCROLL TO EXPLORE" ─────────────────────────── */
(function initScrollTypewriter() {
  const container = document.getElementById('scroll-txt');
  if (!container) return;
 
  const FULL_TEXT  = '[SCROLL TO EXPLORE';
  const CHAR_DELAY = 60;     // ms entre chaque lettre
  // délai avant que le curseur recommence à "défiler" (idle loop)
  const IDLE_DELAY  = 4000;  // ms après fin d'écriture
  const SWEEP_SPEED = 45;    // ms par case dans la boucle idle
 
  let typed = 0;
  let cursorEl = null;
 
  // 1. Créer le curseur carré
  function makeCursor() {
    cursorEl = document.createElement('span');
    cursorEl.className = 'scroll_cursor';
    container.appendChild(cursorEl);
  }
 
  // 2. Écriture lettre par lettre
  function typeNext() {
    if (typed < FULL_TEXT.length) {
      // Insérer le caractère AVANT le curseur
      const char = document.createTextNode(FULL_TEXT[typed]);
      container.insertBefore(char, cursorEl);
      typed++;
      setTimeout(typeNext, CHAR_DELAY);
    } else {
      // Texte entièrement écrit — lancer la boucle idle
      setTimeout(startIdleLoop, IDLE_DELAY);
    }
  }
 
  // 3. Boucle idle : le curseur "parcourt" le texte de droite à gauche
  //    puis revient à la fin — crée l'illusion d'une réécriture discrète
  function startIdleLoop() {
    // on enlève le curseur de sa position actuelle (fin)
    // et on le déplace progressivement vers la gauche puis retour
    const textNodes = [...container.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
    let pos = textNodes.length; // commence à la fin
 
    function sweepLeft() {
      if (pos > 0) {
        pos--;
        // déplacer le curseur avant le nœud texte[pos]
        container.insertBefore(cursorEl, textNodes[pos]);
        setTimeout(sweepLeft, SWEEP_SPEED);
      } else {
        // arrivé au début, revenir vers la droite
        setTimeout(sweepRight, SWEEP_SPEED * 2);
      }
    }
 
    function sweepRight() {
      if (pos < textNodes.length) {
        pos++;
        const ref = pos < textNodes.length ? textNodes[pos] : null;
        container.insertBefore(cursorEl, ref);
        setTimeout(sweepRight, SWEEP_SPEED);
      } else {
        // retour à la fin, pause puis recommencer
        setTimeout(startIdleLoop, IDLE_DELAY);
      }
    }
 
    sweepLeft();
  }
 
  // Démarrage
  makeCursor();
  // petite pause avant de commencer à écrire (après chargement)
  setTimeout(typeNext, 800);
})();
 
 
/* ── Mobile menu ─────────────────────────────────────────────── */
(function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mob-menu');
  const close  = document.getElementById('mob-close');
 
  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
 
  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
 
  if (burger) burger.addEventListener('click', openMenu);
  if (close)  close.addEventListener('click', closeMenu);
 
  menu && menu.querySelectorAll('.mob-link').forEach(l =>
    l.addEventListener('click', closeMenu)
  );
})();