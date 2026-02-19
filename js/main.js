/* ==============================================
   UNASHAMED — Main JavaScript
   Scroll animations, FAQ accordion, nav scroll,
   Firebase Analytics event tracking
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');

  const handleNavScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');

        // Firebase: FAQ open event
        trackEvent('faq_open', {
          question: question.textContent.trim()
        });
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#buy') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // =============================================
  // FIREBASE ANALYTICS — Event Tracking
  // =============================================

  /**
   * Safe wrapper — logs event only when Firebase is loaded.
   * Firebase SDK is loaded as a module in index.html and
   * exposes window.__analytics and window.__logEvent.
   */
  function trackEvent(eventName, params) {
    try {
      if (window.__analytics && window.__logEvent) {
        window.__logEvent(window.__analytics, eventName, params);
      }
    } catch (e) {
      // Silently fail — analytics should never break the site
    }
  }

  // --- CTA Button Clicks ---
  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('click_buy_button', {
        location: btn.getAttribute('data-cta'),
        button_text: btn.textContent.trim()
      });
    });
  });

  // --- Section View Tracking ---
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackEvent('view_section', {
          section_id: entry.target.id,
          section_name: entry.target.id.replace(/-/g, '_')
        });
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  sections.forEach(section => sectionObserver.observe(section));

});
