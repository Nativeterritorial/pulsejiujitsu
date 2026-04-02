
/* =====================================================
   PULSE JIU-JITSU — main.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const navLinksNoCta = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const sections = document.querySelectorAll('section[id]');

  /* ── Header scroll effect ────────────────────────── */
  if (header) {
    const handleHeaderScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };

    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  /* ── Mobile nav toggle ───────────────────────────── */
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link on scroll ───────────────────── */
  if (sections.length && navLinksNoCta.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinksNoCta.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ── Scroll-in animation ─────────────────────────── */
  const animateEls = document.querySelectorAll(
    '.card, .beneficio, .team__card, .stat, .contato__item'
  );

  if (animateEls.length) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.children] : [];
        const idx = siblings.indexOf(entry.target);

        entry.target.style.transitionDelay = `${Math.max(idx, 0) * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.1
    });

    animateEls.forEach(el => {
      el.classList.add('fade-in');
      fadeObserver.observe(el);
    });
  }

  /* ── Smooth scroll for anchor links ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const offset = header ? header.offsetHeight + 8 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  /* ── Inject fade-in CSS ──────────────────────────── */
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
      color: #ffffff !important;
    }
  `;
  document.head.appendChild(style);
});
