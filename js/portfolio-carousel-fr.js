(function () {
  'use strict';

  var projects = [
    {
      tag: 'Optique',
      title: 'Siteweb Optician Dynamique',
      desc: "Magasin d'optique tout-en-un conçu pour un contrôle administratif total. Propulsé par PHP, PHPMailer, SQLite et Gmail SMTP, la plateforme permet à l'administrateur de modifier le texte, les couleurs, les polices, d'activer des options et de gérer les flux de travail — sans aucune connaissance technique. Fonctionnalités : gestion des produits, système de fidélité, rendez-vous, messagerie, gestion des commandes et comptes utilisateurs.",
      techs: ['PHP', 'PHPMailer', 'SQLite', 'Gmail SMTP'],
      links: [
        { label: 'Démo en direct', url: 'https://moreqasse.github.io/Nadar-Optique/', primary: true },
        { label: 'Projet similaire', url: '#contact', primary: false }
      ],
      image: 'images/Optician.webp',
      alt: "Siteweb Optician Dynamique — Magasin d'optique tout-en-un"
    },
    {
      tag: 'Publicité',
      title: 'Agence de Publicité Moderne',
      desc: 'Site d\'agence inspiré du 3D avec animations fluides et thème sombre premium.',
      techs: ['HTML', 'CSS', 'GSAP'],
      links: [
        { label: 'Démo en direct', url: 'https://moreqasse.github.io/ads-studio-website', primary: true },
        { label: 'Projet similaire', url: '#contact', primary: false }
      ],
      image: 'images/ads studio.webp',
      alt: "Site d'agence de publicité"
    },
    {
      tag: 'Hôtellerie',
      title: 'Frial Café & Resto',
      desc: 'Menu, galerie, avis intégrés et fonctionnalités de fidélité pour une marque de restauration.',
      techs: ['Tailwind', 'Maps API'],
      links: [
        { label: 'Démo en direct', url: 'https://moreqasse.github.io/FrialCafeResto/', primary: true }
      ],
      image: 'images/frial.webp',
      alt: 'Site de restaurant'
    },
    {
      tag: 'E-commerce',
      title: 'Boutique de Mode Luxe',
      desc: 'Vitrine haut de gamme avec filtres et expérience de paiement fluide.',
      techs: [],
      links: [
        { label: 'Démo en direct', url: 'https://stylehub-commerce-0593l18.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/LuxSite.webp',
      alt: 'E-commerce mode'
    },
    {
      tag: 'SaaS',
      title: 'ClientFlow CMS',
      desc: 'Gestion des clients avec rôles, projets, facturation et rapports.',
      techs: [],
      links: [
        { label: 'Démo en direct', url: 'https://clientflow-cms-e75il93.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/CMS.webp',
      alt: 'ClientFlow CMS'
    },
    {
      tag: 'SaaS',
      title: 'Gestion de Stock Pharmacie',
      desc: "Suivi des stocks, alertes d'expiration et flux conformes à la réglementation.",
      techs: [],
      links: [
        { label: 'Démo en direct', url: 'https://pharmacy-inventory-fmm7o80.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/pharma.webp',
      alt: 'Inventaire pharmacie'
    },
    {
      tag: 'Finance SaaS',
      title: 'Plateforme Comptable',
      desc: 'Tableaux de bord, transactions, rapports et portail client en une suite.',
      techs: [],
      links: [
        { label: 'Démo en direct', url: 'https://accounting-c7dm002.public.builtwithrocket.new/financial-reports', primary: true }
      ],
      image: 'images/AccountingSaas.webp',
      alt: 'SaaS comptabilité'
    },
    {
      tag: 'Agence',
      title: 'Hub de Consultation & Contact',
      desc: "Formulaires sécurisés, planification et flux d'engagement client soignés.",
      techs: [],
      links: [
        { label: 'Démo en direct', url: 'https://agency-j5p5223.public.builtwithrocket.new/', primary: true }
      ],
      image: 'images/Consulation.webp',
      alt: 'Hub de consultation'
    },
    {
      tag: 'Votre idée',
      title: "Construisons Votre Vision",
      desc: 'Identité de marque, design web, maintenance, SEO et publicités\u2014nous façonnons les idées en produits.',
      links: [
        { label: 'Parlons Business', url: '#contact', primary: true }
      ],
      image: 'images/GetinTouch.webp',
      alt: 'Projet sur mesure'
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

  var PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3C/svg%3E';

  function render(index) {
    var p = projects[index];
    if (!p) return;

    if (img) {
      var newSrc = p.image;
      if (img.src !== newSrc && img.src !== window.location.href) {
        img.src = PLACEHOLDER;
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

    if (techs) {
      techs.innerHTML = '';
      (p.techs || []).forEach(function (t) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        techs.appendChild(span);
      });
    }

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

    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-label', 'Diapositive ' + (i + 1));
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

  if (img) img.src = PLACEHOLDER;
  render(0);
  start();
})();
