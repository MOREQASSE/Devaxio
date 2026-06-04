/**
 * Devaxio — UI interactions (no build step)
 */
(function () {
  'use strict';

  const html = document.documentElement;
  const header = document.querySelector('.site-header');

  /* Theme */
  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
      icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    /* Nav always uses flat 2D mark; hero uses full Devaxio.webp */
    document.querySelectorAll('.brand-logo--nav').forEach((img) => {
      img.src = 'images/Devaxio2D.webp';
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved || (prefersLight ? 'light' : 'dark'));
  }

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyTheme(html.classList.contains('light') ? 'dark' : 'light');
  });

  initTheme();

  /* Header is fixed — always visible */

  /* Language dropdown */
  const langBtn = document.getElementById('language-toggle');
  const langDrop = document.getElementById('language-dropdown');
  langBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    langDrop?.classList.toggle('is-open');
  });
  document.addEventListener('click', () => langDrop?.classList.remove('is-open'));

  /* Mobile nav */
  const mobileBtn = document.getElementById('mobile-menu-btn') || document.getElementById('mobile-menu-button');
  const mobileNav = document.getElementById('mobile-nav') || document.getElementById('mobile-menu');
  mobileBtn?.addEventListener('click', () => mobileNav?.classList.toggle('is-open'));
  mobileNav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => mobileNav.classList.remove('is-open'));
  });

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileNav?.classList.remove('is-open');
    });
  });

  /* Active nav */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function setActiveNav() {
    let current = '';
    const offset = 120;
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* Portfolio carousel */
  const track = document.getElementById('portfolio-track');
  const dots = document.querySelectorAll('.portfolio-dot');
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  let slide = 0;

  function getSlideCount() {
    return track ? track.children.length : 0;
  }

  function goTo(index) {
    const total = getSlideCount();
    if (!total || !track) return;
    slide = ((index % total) + total) % total;
    track.style.transform = `translateX(-${slide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === slide));
  }

  prevBtn?.addEventListener('click', () => goTo(slide - 1));
  nextBtn?.addEventListener('click', () => goTo(slide + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index, 10)));
  });

  let carouselTimer = setInterval(() => goTo(slide + 1), 8000);
  track?.closest('.portfolio-track-wrap')?.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  track?.closest('.portfolio-track-wrap')?.addEventListener('mouseleave', () => {
    carouselTimer = setInterval(() => goTo(slide + 1), 8000);
  });

  /* Tech filter */
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const techItems = document.querySelectorAll('.tech-item[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      techItems.forEach((item) => {
        const show = f === 'all' || item.dataset.category === f;
        item.hidden = !show;
        if (show && typeof gsap !== 'undefined') {
          gsap.fromTo(item, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35 });
        }
      });
    });
  });

  /* FAQ */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach((q) => {
        q.setAttribute('aria-expanded', 'false');
        q.parentElement.querySelector('.faq-answer')?.setAttribute('hidden', '');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.parentElement.querySelector('.faq-answer')?.removeAttribute('hidden');
      }
    });
  });

  /* Contact form */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'name', msg: 'Name is required' },
      { id: 'email', msg: 'Valid email required', test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'phone', msg: 'Phone is required' },
      { id: 'subject', msg: 'Subject is required' },
      { id: 'message', msg: 'Message is required' },
    ];

    fields.forEach(({ id, msg, test }) => {
      const input = document.getElementById(id);
      const err = document.getElementById(id + '-error');
      const val = input?.value.trim() || '';
      if (!val || (test && !test(val))) {
        if (err) {
          err.textContent = msg;
          err.hidden = false;
        }
        valid = false;
      } else if (err) err.hidden = true;
    });

    if (!valid) return;

    if (typeof grecaptcha !== 'undefined') {
      const token = grecaptcha.getResponse();
      if (!token) {
        alert('Please complete the reCAPTCHA verification.');
        return;
      }
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending…';

    try {
      const fd = new FormData(form);
      if (typeof grecaptcha !== 'undefined') {
        fd.append('g-recaptcha-response', grecaptcha.getResponse());
      }
      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        alert('Message sent successfully!');
        form.reset();
        grecaptcha?.reset();
      } else {
        alert('There was a problem submitting your form. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
    }
  });

  // Mobile theme toggle
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener('click', () => {
    // Sync with desktop theme toggle
    const desktopToggle = document.getElementById('theme-toggle');
    if (desktopToggle) desktopToggle.click();
  });
}

// Mobile language toggle
const mobileLangToggle = document.getElementById('mobile-language-toggle');
const mobileLangDropdown = document.getElementById('mobile-language-dropdown');
if (mobileLangToggle && mobileLangDropdown) {
  mobileLangToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileLangDropdown.classList.toggle('is-open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileLangToggle.contains(e.target) && !mobileLangDropdown.contains(e.target)) {
      mobileLangDropdown.classList.remove('is-open');
    }
  });
}
  /* Services showcase carousel */
  (function servicesCarousel() {
    const showcase = document.getElementById('services-showcase');
    if (!showcase) return;
    const panels = showcase.querySelectorAll('.service-panel');
    const total = panels.length;
    if (total < 2) return;
    const dots = document.querySelectorAll('.showcase-dot');
    let current = 0;
    let timer = null;
    let activeTl = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function killPanelAnims(index) {
      if (typeof gsap === 'undefined') return;
      const panel = panels[index];
      if (!panel) return;
      gsap.killTweensOf(panel.querySelectorAll('.showcase-svg *'));
      panel.querySelectorAll('.showcase-svg [opacity="0"]').forEach(function (el) { el.style.opacity = '0'; });
      panel.querySelectorAll('.showcase-svg [stroke-dashoffset]').forEach(function (el) { el.style.strokeDashoffset = ''; });
    }

    var panelAnims = [
      /* Panel 0: Browser */
      function (tl) {
        var svg = panels[0].querySelector('.browser-svg');
        if (!svg) return;
        var cursor = svg.querySelector('.browser-cursor');
        var click = svg.querySelector('.cursor-click');
        tl
          .fromTo(svg.querySelector('.browser-content'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.05)
          .set(cursor, { x: 188, y: 14, autoAlpha: 1 }, 0.2)
          .to(cursor, { x: 188, y: 56, duration: 0.45, ease: 'power1.inOut' }, 0.3)
          .to(cursor, { x: 100, y: 56, duration: 0.35, ease: 'power1.inOut' }, 0.8)
          .to(cursor, { x: 83, y: 148, duration: 0.5, ease: 'power2.inOut' }, 1.2)
          .set(click, { x: 0, y: 0, autoAlpha: 1, attr: { r: 0 } })
          .to(click, { attr: { r: 10 }, autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 1.75);
      },
      /* Panel 1: Pen tool */
      function (tl) {
        var svg = panels[1].querySelector('.pen-svg');
        if (!svg) return;
        var curve = svg.querySelector('.pen-curve');
        if (curve) {
          var len = curve.getTotalLength() || 580;
          curve.style.strokeDasharray = len;
          curve.style.strokeDashoffset = len;
        }
        var pen = svg.querySelector('.pen-tool');
        var geo = {
          circle: svg.querySelector('.pen-geo-circle'),
          rect: svg.querySelector('.pen-geo-rect'),
          tri: svg.querySelector('.pen-geo-triangle'),
        };
        var hs = svg.querySelectorAll('.pen-handle-1, .pen-handle-2, .pen-handle-3, .pen-handle-4');
        var cs = svg.querySelectorAll('.pen-ctrl-1, .pen-ctrl-2, .pen-ctrl-3, .pen-ctrl-4');
        var as = svg.querySelectorAll('.pen-anchor');
        ['circle','rect','tri'].forEach(function (k) {
          var el = geo[k];
          if (el) {
            var l = el.getTotalLength ? el.getTotalLength() : ({ circle: 138, rect: 205, tri: 128 })[k];
            el.style.strokeDasharray = l;
            el.style.strokeDashoffset = l;
          }
        });
        tl
          .set(pen, { x: 50, y: 180, autoAlpha: 1 })
          .to(curve, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 0.1)
          .to(pen, { x: 210, y: 130, duration: 0.3, ease: 'power1.inOut' }, 0.15)
          .to(pen, { x: 320, y: 95, duration: 0.25, ease: 'power1.inOut' }, 0.5)
          .to(pen, { x: 370, y: 120, duration: 0.2, ease: 'power1.out' }, 0.75)
          .to(hs, { autoAlpha: 1, duration: 0.2 }, 0.2)
          .to(cs, { autoAlpha: 1, duration: 0.15 }, 0.3)
          .to(as, { autoAlpha: 1, duration: 0.1 }, 0.4)
          .to(svg.querySelector('.pen-fill'), { autoAlpha: 1, duration: 0.3 }, 0.6)
          .to([hs, cs, as], { autoAlpha: 0, duration: 0.15 }, 0.85)
          .to(pen, { x: 80, y: 43, duration: 0.3, ease: 'power2.inOut' }, 1.05)
          .to(geo.circle, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut' }, 1.35)
          .to(pen, { x: 275, y: 170, duration: 0.2, ease: 'power2.inOut' }, 1.75)
          .to(geo.rect, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut' }, 1.95)
          .to(pen, { x: 185, y: 130, duration: 0.2, ease: 'power2.inOut' }, 2.35)
          .to(geo.tri, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut' }, 2.55)
          .to(svg.querySelector('.pen-swatches'), { autoAlpha: 1, duration: 0.2 }, 2.75)
          .to(svg.querySelector('.swatch-active'), { autoAlpha: 1, duration: 0.15 }, 2.95)
          .to(svg.querySelector('.swatch-glow'), { autoAlpha: 1, scale: 1.4, duration: 0.4, ease: 'power2.out', transformOrigin: '158px 225px' }, 2.95);
      },
      /* Panel 2: Chart */
      function (tl) {
        var svg = panels[2].querySelector('.chart-svg');
        if (!svg) return;
        var trendline = svg.querySelector('.chart-trendline');
        if (trendline) {
          trendline.style.strokeDasharray = '320';
          trendline.style.strokeDashoffset = '320';
          trendline.style.opacity = '1';
        }
        var bars = svg.querySelectorAll('.chart-bar');
        var stats = svg.querySelectorAll('.stat-card');
        tl
          .set(svg.querySelector('.chart-bars'), { autoAlpha: 1 })
          .to(bars, { autoAlpha: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(1.2)' }, 0.1)
          .to(svg.querySelectorAll('.chart-dot'), { autoAlpha: 1, duration: 0.25, stagger: 0.08 }, 0.4)
          .to(svg.querySelectorAll('.chart-label, .chart-hline, .chart-xlabel'), { autoAlpha: 1, duration: 0.25 }, 0.1)
          .to(svg.querySelector('.chart-axis'), { autoAlpha: 1, duration: 0.3 }, 0.5)
          .to(trendline, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
          .to(svg.querySelectorAll('.trend-dot'), { autoAlpha: 1, duration: 0.25, stagger: 0.1 }, 1.0)
          .to(svg.querySelector('.chart-trendarrow'), { autoAlpha: 1, duration: 0.25 }, 1.3)
          .to(svg.querySelector('.chart-growth'), { autoAlpha: 1, duration: 0.4, ease: 'back.out(1.7)' }, 1.4)
          .to(svg.querySelector('.stats-divider'), { autoAlpha: 1, duration: 0.3 }, 1.6)
          .to(stats, { autoAlpha: 1, y: -8, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 1.8)
          .to(svg.querySelectorAll('.chart-sparkle'), { autoAlpha: 1, scale: 1.5, duration: 0.4, stagger: 0.12, ease: 'power2.out', transformOrigin: 'center' }, 2.2);
      },
    ];

    function goTo(index) {
      if (index === current || !panels[index]) return;
      if (activeTl && typeof activeTl.kill === 'function') activeTl.kill();
      killPanelAnims(current);
      panels[current].classList.remove('active');
      panels[current].setAttribute('aria-hidden', 'true');
      current = index;
      panels[current].classList.add('active');
      panels[current].removeAttribute('aria-hidden');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current);
      });
      if (!reduceMotion && typeof gsap !== 'undefined' && panelAnims[current]) {
        activeTl = gsap.timeline();
        panelAnims[current](activeTl);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    function startTimer() { stopTimer(); timer = setInterval(function () { goTo((current + 1) % total); }, 3500); }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

    showcase.addEventListener('mouseenter', stopTimer);
    showcase.addEventListener('mouseleave', startTimer);
    var dw = document.querySelector('.showcase-dots');
    if (dw) { dw.addEventListener('mouseenter', stopTimer); dw.addEventListener('mouseleave', startTimer); }

    if (!reduceMotion && typeof gsap !== 'undefined' && panelAnims[0]) {
      activeTl = gsap.timeline({ delay: 0.8 });
      panelAnims[0](activeTl);
    }
    startTimer();
  })();

  /* Footer year */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Newsletter (mailto fallback — static site) */
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email')?.value;
    if (email) window.location.href = `mailto:contact@devaxio.com?subject=Newsletter&body=Subscribe: ${encodeURIComponent(email)}`;
  });
})();
