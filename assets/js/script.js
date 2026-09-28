/* ============================================================
   VIORA — WOMEN'S WELLNESS | script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────── */
  const html = document.documentElement;
  const body = document.body;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('viora-theme', theme);
    const icon = document.getElementById('theme-icon');
    const mobileIcon = document.getElementById('theme-icon-mobile');
    const emoji = theme === 'dark' ? '☀️' : '🌙';
    if (icon) icon.textContent = emoji;
    if (mobileIcon) mobileIcon.textContent = emoji;
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  const savedTheme = localStorage.getItem('viora-theme') || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  /* ── RTL ─────────────────────────────────────────────────── */
  function applyRTL(rtl) {
    body.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    localStorage.setItem('viora-rtl', rtl ? '1' : '0');
    document.querySelectorAll('.rtl-indicator').forEach(el => {
      el.textContent = rtl ? 'LTR' : 'RTL';
    });
  }

  function toggleRTL() {
    const current = body.getAttribute('dir') === 'rtl';
    applyRTL(!current);
  }

  const savedRTL = localStorage.getItem('viora-rtl') === '1';
  applyRTL(savedRTL);

  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.addEventListener('click', toggleRTL);
  });

  /* ── Header scroll ───────────────────────────────────────── */
  const header = document.getElementById('site-header');

  function handleScroll() {
    if (window.scrollY > 60) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile nav ──────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMobileNav() {
    hamburger && hamburger.classList.add('open');
    mobileNav && mobileNav.classList.add('open');
    mobileOverlay && mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    hamburger && hamburger.classList.remove('open');
    mobileNav && mobileNav.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger && hamburger.addEventListener('click', openMobileNav);
  mobileClose && mobileClose.addEventListener('click', closeMobileNav);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileNav);

  // Close nav links click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ── Intersection Observer ───────────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createObserver(options, callback) {
    if (prefersReducedMotion) return null;
    return new IntersectionObserver(callback, options || { threshold: 0.15 });
  }

  /* Generic .reveal elements */
  const revealObs = createObserver({ threshold: 0.12 }, entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        revealObs && revealObs.unobserve(e.target);
      }
    });
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObs ? revealObs.observe(el) : el.classList.add('animated');
  });

  /* ── Section 2: Wellness cards (staggered alternating) ───── */
  const cardObs = createObserver({ threshold: 0.1 }, entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        cardObs && cardObs.unobserve(e.target);
      }
    });
  });

  document.querySelectorAll('.wellness-card').forEach(card => {
    cardObs ? cardObs.observe(card) : card.classList.add('animated');
  });

  /* ── Section 3: Services (curtain + horizontal reveal) ───── */
  const servicesObs = createObserver({ threshold: 0.1 }, entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Image curtain
        const imgWrap = e.target.querySelector('.services-image-wrap');
        if (imgWrap) setTimeout(() => imgWrap.classList.add('animated'), 0);

        // Content slide
        const content = e.target.querySelector('.services-content');
        if (content) setTimeout(() => content.classList.add('animated'), 200);

        // Service items sequential
        const items = e.target.querySelectorAll('.service-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('animated'), 300 + i * 120);
        });

        // CTA
        const cta = e.target.querySelector('.services-cta');
        if (cta) setTimeout(() => cta.classList.add('animated'), 300 + items.length * 120 + 100);

        servicesObs && servicesObs.unobserve(e.target);
      }
    });
  });

  const servicesSection = document.getElementById('services');
  servicesSection && (servicesObs ? servicesObs.observe(servicesSection) : (() => {
    servicesSection.querySelectorAll('.services-image-wrap,.services-content,.service-item,.services-cta').forEach(el => el.classList.add('animated'));
  })());

  /* ── Section 4: Stories (horizontal storytelling) ────────── */
  const storiesObs = createObserver({ threshold: 0.1 }, entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      // Story cards
      e.target.querySelectorAll('.story-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('animated'), i * 150);
      });

      // Timeline connectors + steps
      const connectors = e.target.querySelectorAll('.timeline-connector');
      const steps = e.target.querySelectorAll('.timeline-step');

      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('animated'), i * 120);
      });
      connectors.forEach((conn, i) => {
        setTimeout(() => conn.classList.add('animated'), 60 + i * 120);
      });

      // Quote blur reveal
      const quote = e.target.querySelector('.stories-bg-quote');
      if (quote) {
        const qObs = new IntersectionObserver(qEntries => {
          qEntries.forEach(qe => {
            if (qe.isIntersecting) {
              qe.target.classList.add('animated');
              qObs.unobserve(qe.target);
            }
          });
        }, { threshold: 0.3 });
        qObs.observe(quote);
      }

      storiesObs && storiesObs.unobserve(e.target);
    });
  });

  const storiesSection = document.getElementById('stories');
  storiesSection && (storiesObs ? storiesObs.observe(storiesSection) : (() => {
    storiesSection.querySelectorAll('.story-card,.timeline-step,.timeline-connector,.stories-bg-quote').forEach(el => el.classList.add('animated'));
  })());

  /* ── Section 5: Contact (immersive mask reveal) ──────────── */
  const contactObs = createObserver({ threshold: 0.1 }, entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      const imgWrap = e.target.querySelector('.contact-image-wrap');
      if (imgWrap) setTimeout(() => imgWrap.classList.add('animated'), 0);

      const formSide = e.target.querySelector('.contact-form-side');
      if (formSide) setTimeout(() => formSide.classList.add('animated'), 150);

      const formGroups = e.target.querySelectorAll('.form-group');
      formGroups.forEach((g, i) => {
        setTimeout(() => g.classList.add('animated'), 300 + i * 100);
      });

      contactObs && contactObs.unobserve(e.target);
    });
  });

  const contactSection = document.getElementById('contact');
  contactSection && (contactObs ? contactObs.observe(contactSection) : (() => {
    contactSection.querySelectorAll('.contact-image-wrap,.contact-form-side,.form-group').forEach(el => el.classList.add('animated'));
  })());

  /* ── Smooth scroll for nav links ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Contact form submission ─────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  contactForm && contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent';
    btn.style.background = '#5a8a6a';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      this.reset();
    }, 3000);
  });

  /* ── Newsletter form ─────────────────────────────────────── */
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm && newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.newsletter-btn');
    const input = this.querySelector('.newsletter-input');
    if (!btn) return;
    btn.textContent = 'Subscribed ✓';
    btn.style.background = '#5a8a6a';
    btn.style.color = '#fff';
    if (input) input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  });

  /* ── Active nav highlight ────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    let current = '';
    const offset = 120;
    sections.forEach(sec => {
      if (window.pageYOffset >= sec.offsetTop - offset) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--champagne)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── Parallax for hero image on desktop ─────────────────── */
  if (!prefersReducedMotion && window.innerWidth > 1024) {
    const heroImg = document.querySelector('.hero-image-wrap img');
    window.addEventListener('scroll', () => {
      if (!heroImg) return;
      const scrolled = window.pageYOffset;
      heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
    }, { passive: true });
  }

  /* ── Wellness section appear ─────────────────────────────── */
  const wellnessObs = createObserver({ threshold: 0.05 }, entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.wellness-header .reveal').forEach(el => el.classList.add('animated'));
      wellnessObs && wellnessObs.unobserve(e.target);
    });
  });
  const wellnessSection = document.getElementById('wellness');
  wellnessSection && (wellnessObs ? wellnessObs.observe(wellnessSection) : null);

})();
