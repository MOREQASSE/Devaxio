/**
 * Devaxio — UI interactions (no build step)
 */
(function () {
  'use strict';

  const html = document.documentElement;
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

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

  /* Header hide on scroll */
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y > lastScroll && y > 120) header?.classList.add('is-hidden');
      else header?.classList.remove('is-hidden');
      lastScroll = y;
    },
    { passive: true }
  );

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
