/* CareNote progressive enhancement. Core features remain usable without JavaScript. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    // Subtle entrance animation for major content surfaces.
    const surfaces = document.querySelectorAll('.panel, .metric-card, .hero-card, .auth-card, .result-heading');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      surfaces.forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 55}ms`;
      });
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      surfaces.forEach(el => observer.observe(el));
    }

    // Provide feedback while forms submit; do not interfere with invalid forms.
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.reportValidity();
          return;
        }
        const submit = form.querySelector('button[type="submit"], button:not([type])');
        if (submit && !submit.dataset.noLoading && !form.hasAttribute('data-no-loading')) {
          submit.classList.add('is-loading');
          submit.setAttribute('aria-busy', 'true');
          submit.dataset.originalText = submit.textContent.trim();
          // Avoid locking destructive actions until their confirmation has completed.
        }
      });
    });

    // Consistent accessible delete confirmation for forms that opt in.
    document.querySelectorAll('form[data-confirm]').forEach(form => {
      form.addEventListener('submit', event => {
        const message = form.getAttribute('data-confirm') || 'Continue with this action?';
        if (!window.confirm(message)) event.preventDefault();
      });
    });

    // Bootstrap tooltips are optional; initialize only when Bootstrap is loaded.
    if (window.bootstrap && bootstrap.Tooltip) {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
    }
  });
})();
