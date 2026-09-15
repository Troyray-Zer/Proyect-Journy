// ============================================================
// Cuaderno de ruta — interacciones
// Menú móvil · scroll reveal · contadores · filtro de países
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menú móvil ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('nav-principal');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });
  }

  /* ---------- Revelado al hacer scroll ---------- */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ---------- Contadores de cifras ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('es-ES') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('es-ES') + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach((el) => statObserver.observe(el));
  } else {
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = target.toLocaleString('es-ES') + suffix;
    });
  }

  /* ---------- Filtro de países por continente ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const countryChips = document.querySelectorAll('.country-chip');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      countryChips.forEach((chip) => {
        const matches = filter === 'todos' || chip.getAttribute('data-continent') === filter;
        chip.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /* ---------- Botón volver arriba ---------- */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Barra de progreso de lectura ---------- */
  const progressBar = document.getElementById('progress-bar');

  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Índice deslizable (derecha) ---------- */
  const indexToggle = document.getElementById('index-toggle');
  const indexDrawer = document.getElementById('index-drawer');
  const indexOverlay = document.getElementById('index-overlay');
  const indexClose = document.getElementById('index-close');
  const indexLinks = document.querySelectorAll('[data-index-link]');

  const openIndex = () => {
    indexDrawer.classList.add('is-open');
    indexDrawer.setAttribute('aria-hidden', 'false');
    indexOverlay.hidden = false;
    requestAnimationFrame(() => indexOverlay.classList.add('is-visible'));
    indexToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeIndex = () => {
    indexDrawer.classList.remove('is-open');
    indexDrawer.setAttribute('aria-hidden', 'true');
    indexOverlay.classList.remove('is-visible');
    indexToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { indexOverlay.hidden = true; }, 620);
  };

  if (indexToggle && indexDrawer && indexOverlay) {
    indexToggle.addEventListener('click', () => {
      const isOpen = indexDrawer.classList.contains('is-open');
      isOpen ? closeIndex() : openIndex();
    });

    if (indexClose) indexClose.addEventListener('click', closeIndex);
    indexOverlay.addEventListener('click', closeIndex);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && indexDrawer.classList.contains('is-open')) {
        closeIndex();
      }
    });

    indexLinks.forEach((link) => {
      link.addEventListener('click', () => closeIndex());
    });
  }

  /* ---------- Scrollspy: sección activa en la navegación y el índice ---------- */
  const trackedSections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinksAll = document.querySelectorAll('.main-nav a[href^="#"], [data-index-link]');

  if ('IntersectionObserver' in window && trackedSections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');

        navLinksAll.forEach((link) => {
          const matches = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', matches);
        });
      });
    }, { threshold: 0.4, rootMargin: '-15% 0px -55% 0px' });

    trackedSections.forEach((section) => spyObserver.observe(section));
  }

});
