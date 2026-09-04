/* =====================================================
   PULSE JIU-JITSU — main.js
   ===================================================== */

// ── Header scroll effect ──────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when a link is clicked
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

const observerOptions = { rootMargin: '-30% 0px -60% 0px' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

// ── Scroll-in animation ───────────────────────────────
const animateEls = document.querySelectorAll(
  '.card, .beneficio, .team__card, .stat, .contato__item, .sobre__foto'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Staggered delay based on position among siblings
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateEls.forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// ── Animated stat counters ────────────────────────────
const statNumbers = document.querySelectorAll('.stat__number[data-count]');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });

statNumbers.forEach(el => countObserver.observe(el));

// ── Efeito de scroll na grade de horários ─────────────
// Entra levemente menor e desfocada; ganha escala e foco
// conforme se aproxima do centro da tela (como na referência).
const horariosFx = document.getElementById('horariosFx');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (horariosFx && !reduceMotion) {
  let ticking = false;

  const updateFx = () => {
    ticking = false;
    const rect = horariosFx.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const elCenter = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    // 0 no centro da tela, 1 nas bordas
    const t = Math.min(Math.abs(elCenter - viewCenter) / (window.innerHeight * 0.75), 1);
    const scale = 1 - 0.06 * t;
    const blur = 2.5 * Math.max(t - 0.35, 0);
    horariosFx.style.transform = `scale(${scale.toFixed(3)})`;
    horariosFx.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateFx); }
  }, { passive: true });
  window.addEventListener('resize', updateFx, { passive: true });
  updateFx();
}

// ── Smooth scroll for all anchor links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Inject fade-in CSS ────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .5s ease, transform .5s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .nav__link.active {
    color: #fff !important;
  }
`;
document.head.appendChild(style);
