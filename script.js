/* ============================================
   SKYSPOOFER — Interactions
   ============================================ */
(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Navbar scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 16) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Animated counters ---------- */
  const formatNumber = (value, suffix = '') => {
    let formatted;
    if (value >= 1000) {
      formatted = Math.round(value).toLocaleString('en-US');
    } else if (Number.isInteger(value)) {
      formatted = value.toString();
    } else {
      formatted = value.toFixed(1);
    }
    return formatted + suffix;
  };

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      el.textContent = formatNumber(current, suffix);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, suffix);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- IntersectionObserver: reveal + counters ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Start any counters inside
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          if (!el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCounter(el);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Register elements that should reveal on scroll
  const revealSelectors = [
    '.hero-stats',
    '.feature-card',
    '.game-card',
    '.step',
    '.price-card',
    '.faq-item',
    '.section-head',
    '.cta-inner'
  ];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  });

  /* ---------- Hero terminal — re-run when scrolled into view ---------- */
  // (Purely visual — the lines animate via CSS classes toggled here.)
  const heroCard = document.querySelector('.hero-card-body');
  if (heroCard) {
    const lines = Array.from(heroCard.querySelectorAll('.spoofer-line'));
    const runSequence = () => {
      lines.forEach(l => l.style.opacity = '0');
      lines.forEach((l, i) => {
        setTimeout(() => {
          l.style.transition = 'opacity .25s ease';
          l.style.opacity = '1';
        }, 400 + i * 600);
      });
    };
    // Initial run
    runSequence();
    // Re-run when scrolled back into view
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          runSequence();
        }
      });
    }, { threshold: [0.6] });
    cardObserver.observe(heroCard);
  }

  /* ---------- Smooth anchor offset (for fixed navbar) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Single open FAQ at a time (accordion) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

})();
