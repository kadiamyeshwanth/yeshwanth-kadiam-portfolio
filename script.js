/* =============================================================
   YESHWANTH KADIAM — Portfolio Script
   Shane Mielke-inspired interactions
   ============================================================= */

(function () {
  'use strict';

  const qs   = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa  = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const lerp = (a, b, t) => a + (b - a) * t;

  // 1. PAGE ENTRY TRANSITION
  const overlay = qs('#pageOverlay');
  if (overlay) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('open');
        overlay.classList.add('closed');
      });
    });
  }

  // 2. CUSTOM CURSOR
  const cursorDot  = qs('#cursorDot');
  const cursorRing = qs('#cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let cx = -100, cy = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursorDot.style.transform = `translate(${cx}px, ${cy}px)`;
    });
    (function animateCursor() {
      rx = lerp(rx, cx, 0.11); ry = lerp(ry, cy, 0.11);
      cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(animateCursor);
    })();
    const sel = 'a, button, .flip-card, .skill-col, .tl-item, .c-item, .fact-item, .interest-list li, .contact-email-link';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(sel)) cursorRing.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(sel)) cursorRing.classList.remove('cursor-hover');
    });
    document.addEventListener('mousedown', () => cursorDot.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => cursorDot.classList.remove('cursor-click'));
    document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursorDot.style.opacity = '1'; cursorRing.style.opacity = '1'; });
  }

  // 3. SCROLL PROGRESS BAR
  const scrollBar = qs('#scrollBar');
  function updateScrollBar() {
    if (!scrollBar) return;
    const s = document.documentElement.scrollTop;
    const t = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollBar.style.width = (t > 0 ? (s / t) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateScrollBar, { passive: true });

  // 4. NAVBAR
  const navbar = qs('#navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const navToggle  = qs('#navToggle');
  const navLinksEl = qs('#navLinks');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const open = navLinksEl.classList.toggle('open');
      navToggle.classList.toggle('active', open);
    });
    qsa('a', navLinksEl).forEach(a => a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('active');
    }));
  }

  // Active nav section
  const sections = qsa('section[id]');
  const navAs    = qsa('.nav-links a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.remove('active'));
        const a = qs(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => secObs.observe(s));

  // 5. HERO 3D TILT + PARALLAX BG
  const heroSection = qs('#home');
  const heroName    = qs('#heroName');
  const heroBg      = qs('#heroBgWord');
  if (heroSection && heroName) {
    let tx = 0, ty = 0, cx2 = 0, cy2 = 0, bx = 0, by = 0;
    heroSection.addEventListener('mousemove', e => {
      const r = heroSection.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    });
    heroSection.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
    (function heroLoop() {
      cx2 = lerp(cx2, tx, 0.06); cy2 = lerp(cy2, ty, 0.06);
      bx  = lerp(bx, tx * 30, 0.04); by = lerp(by, ty * 14, 0.04);
      heroName.style.transform = `perspective(900px) rotateX(${-cy2 * 7}deg) rotateY(${cx2 * 7}deg) translateZ(16px)`;
      if (heroBg) heroBg.style.transform = `translate(calc(-50% + ${bx}px), calc(-50% + ${by}px))`;
      requestAnimationFrame(heroLoop);
    })();
  }

  // 6. ROLE WORD CYCLING
  const roleWords = qsa('.role-word');
  if (roleWords.length > 1) {
    let cur = 0;
    setInterval(() => {
      const prev = roleWords[cur];
      prev.classList.remove('active');
      prev.classList.add('exit');
      setTimeout(() => prev.classList.remove('exit'), 650);
      cur = (cur + 1) % roleWords.length;
      roleWords[cur].classList.add('active');
    }, 2800);
  }

  // 7. SCROLL REVEAL
  const revealEls = qsa('.reveal, .reveal-left');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
  revealEls.forEach(el => revObs.observe(el));

  // 8. MAGNETIC LINKS
  qsa('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left - r.width / 2) * 0.35;
      const my = (e.clientY - r.top  - r.height / 2) * 0.35;
      el.style.transform = `translate(${mx}px, ${my}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // 9. FLIP-CARD MICRO-TILT
  if (window.innerWidth >= 768) {
    qsa('.flip-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r   = card.getBoundingClientRect();
        const mx  = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        const my  = ((e.clientY - r.top)  / r.height - 0.5) * 8;
        const inner = card.querySelector('.flip-card-inner');
        if (inner) { inner.style.setProperty('--mx', mx + 'deg'); inner.style.setProperty('--my', my + 'deg'); }
      });
      card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.flip-card-inner');
        if (inner) { inner.style.removeProperty('--mx'); inner.style.removeProperty('--my'); }
      });
    });
  }

  // 10. SMOOTH SCROLL
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = qs(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
    });
  });

  // 11. COUNTER ANIMATION
  qsa('.fact-num').forEach(el => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const raw = el.textContent.trim();
      const match = raw.match(/\d+/);
      if (!match) return;
      const end = parseInt(match[0]);
      const suffix = raw.replace(/\d+/, '');
      let val = 0;
      const step = 16;
      const inc = end / (1100 / step);
      const t = setInterval(() => {
        val = Math.min(val + inc, end);
        el.textContent = Math.round(val) + suffix;
        if (val >= end) clearInterval(t);
      }, step);
      obs.unobserve(el);
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  // 12. TIMELINE DOT FIX — inject dot spans
  qsa('.tl-item').forEach(item => {
    if (!item.querySelector('.tl-dot')) {
      const dot = document.createElement('span');
      dot.className = 'tl-dot';
      item.prepend(dot);
    }
  });

})();

