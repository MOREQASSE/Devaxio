/**
 * Devaxio — Portfolio Laptop Carousel
 * Self-contained: data + logic. Add projects below.
 */
(function () {
  'use strict';

  var projects = [
    {
      tag: 'Healthcare retail',
      title: 'Optician Dynamic Website',
      desc: 'All-in-one optician store built for total administrative control. Powered by PHP, PHPMailer, SQLite, and Gmail SMTP, the platform lets the admin change writing, colors, fonts, toggle options, and manage workflows — all with zero code or technical knowledge. Features include product management, a loyalty system, appointments, messaging, order management, and user accounts.',
      techs: ['PHP', 'PHPMailer', 'SQLite', 'Gmail SMTP'],
      links: [
        { label: 'Live Demo', url: 'https://moreqasse.github.io/Nadar-Optique/', primary: true },
        { label: 'Get Similar', url: '#contact', primary: false }
      ],
      image: 'images/Optician.webp',
      alt: 'Optician Dynamic Website — all-in-one optician store'
    },
    {
      tag: 'Advertising',
      title: 'Modern Advertising Studio',
      desc: '3D-inspired agency site with smooth animations and a premium dark theme.',
      techs: ['HTML', 'CSS', 'GSAP'],
      links: [
        { label: 'Live Demo', url: 'https://moreqasse.github.io/ads-studio-website', primary: true },
        { label: 'Get Similar', url: '#contact', primary: false }
      ],
      image: 'images/ads studio.webp',
      alt: 'Advertising agency website'
    },
    {
      tag: 'Hospitality',
      title: 'Frial Café & Resto',
      desc: 'Menu, gallery, reviews integration, and loyalty features for a restaurant brand.',
      techs: ['Tailwind', 'Maps API'],
      links: [
        { label: 'Live Demo', url: 'https://moreqasse.github.io/FrialCafeResto/', primary: true }
      ],
      image: 'images/frial.webp',
      alt: 'Restaurant website'
    },
    {
      tag: 'E-commerce',
      title: 'Luxury Fashion Store',
      desc: 'High-end storefront with filters and seamless checkout experience.',
      techs: [],
      links: [
        { label: 'Live Demo', url: 'https://stylehub-commerce-0593l18.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/LuxSite.webp',
      alt: 'E-commerce fashion'
    },
    {
      tag: 'SaaS',
      title: 'ClientFlow CMS',
      desc: 'Client management with roles, projects, invoicing, and reporting.',
      techs: [],
      links: [
        { label: 'Live Demo', url: 'https://clientflow-cms-e75il93.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/CMS.webp',
      alt: 'ClientFlow CMS'
    },
    {
      tag: 'SaaS',
      title: 'Pharmacy Inventory Tracker',
      desc: 'Stock tracking, expiration alerts, and compliance-focused workflows.',
      techs: [],
      links: [
        { label: 'Live Demo', url: 'https://pharmacy-inventory-fmm7o80.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/pharma.webp',
      alt: 'Pharmacy inventory'
    },
    {
      tag: 'Finance SaaS',
      title: 'Accounting Platform',
      desc: 'Dashboards, transactions, reports, and client portal in one suite.',
      techs: [],
      links: [
        { label: 'Live Demo', url: 'https://accounting-c7dm002.public.builtwithrocket.new/financial-reports', primary: true }
      ],
      image: 'images/AccountingSaas.webp',
      alt: 'Accounting SaaS'
    },
    {
      tag: 'Agency',
      title: 'Consultation & Contact Hub',
      desc: 'Secure forms, scheduling, and polished client engagement flows.',
      techs: [],
      links: [
        { label: 'Live Demo', url: 'https://agency-j5p5223.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/Consulation.webp',
      alt: 'Agency consultation'
    },
    {
      tag: 'Your idea',
      title: "Let's Build Your Vision",
      desc: 'Brand identity, web design, maintenance, SEO, and ads\u2014we shape ideas into products.',
      links: [
        { label: "Let's Talk Business", url: '#contact', primary: true }
      ],
      image: 'images/GetinTouch.webp',
      alt: 'Custom project'
    }
  ];

  var TOTAL = projects.length;
  if (!TOTAL) return;

  var img = document.getElementById('pj-img');
  var tag = document.getElementById('pj-tag');
  var title = document.getElementById('pj-title');
  var desc = document.getElementById('pj-desc');
  var techs = document.getElementById('pj-techs');
  var links = document.getElementById('pj-links');
  var dots = document.querySelectorAll('.portfolio-dot');
  var prevBtn = document.getElementById('prev-project');
  var nextBtn = document.getElementById('next-project');
  var wrap = document.querySelector('.portfolio-showcase');
  var screen = document.querySelector('.laptop-screen');

  var current = 0;
  var timer = null;
  var paused = false;
  var animating = false;

  // Transparent placeholder to avoid empty src
  var PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3C/svg%3E';

  function render(index) {
    var p = projects[index];
    if (!p) return;

    // Image
    if (img) {
      var newSrc = p.image;
      if (img.src !== newSrc && img.src !== window.location.href) {
        img.src = PLACEHOLDER;
        // Use a small delay to force reflow, then set real src
        setTimeout(function () {
          img.src = newSrc;
          img.alt = p.alt || '';
        }, 20);
      } else {
        img.alt = p.alt || '';
      }
    }

    if (tag) tag.textContent = p.tag || '';
    if (title) title.textContent = p.title || '';
    if (desc) desc.textContent = p.desc || '';

    // Tech tags
    if (techs) {
      techs.innerHTML = '';
      (p.techs || []).forEach(function (t) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        techs.appendChild(span);
      });
    }

    // Links
    if (links) {
      links.innerHTML = '';
      (p.links || []).forEach(function (lk) {
        var a = document.createElement('a');
        a.href = lk.url;
        a.className = 'project-link' + (lk.primary ? ' project-link--primary' : ' project-link--secondary');
        a.textContent = lk.label;
        if (lk.url !== '#contact') {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        links.appendChild(a);
      });
    }

    // Dots
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
    });

    current = index;
  }

  function goTo(index) {
    index = ((index % TOTAL) + TOTAL) % TOTAL;
    if (index === current || animating) return;

    animating = true;
    if (screen) {
      screen.classList.add('closing');
      setTimeout(function () {
        render(index);
        setTimeout(function () {
          screen.classList.remove('closing');
          animating = false;
        }, 80);
      }, 600);
    } else {
      render(index);
      animating = false;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.index, 10));
      restart();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      goTo(current + (e.key === 'ArrowRight' ? 1 : -1));
      restart();
    }
  });

  function start() {
    stop();
    if (!paused) {
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restart() {
    start();
  }

  if (wrap) {
    wrap.addEventListener('mouseenter', function () { paused = true; stop(); });
    wrap.addEventListener('mouseleave', function () { paused = false; start(); });
  }

  // Init: set placeholder, then render first project
  if (img) img.src = PLACEHOLDER;
  render(0);
  start();
})();
