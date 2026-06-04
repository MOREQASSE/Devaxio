// Devaxio Services Page — GSAP Scroll Animations
// Requires: GSAP 3.12+, ScrollTrigger

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // ─── Reduce motion branch ───
  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Set all animated elements to final visible state instantly
    gsap.set('.scroll-progress', { width: '100%' });
    gsap.set(
      '.page-hero .section-label, .page-hero h1, .page-hero p, .page-hero a,' +
      '.page-hero__ring, .page-hero__ring--inner,' +
      '.section-header .section-label, .section-header h2, .section-header p,' +
      '.srv-card, .srv-card__badge,' +
      '.cta-strip h2, .cta-strip p, .cta-strip .btn-group a',
      { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 }
    );
    return; // no animations
  });

  // ─── Full animations branch ───
  mm.add('(prefers-reduced-motion: no-preference)', () => {

    // 1. Scroll progress bar
    gsap.to('.scroll-progress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // 2. Hero entrance — on-load timeline
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });
    heroTL
      .from('.page-hero__ring', { scale: 0.75, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0)
      .from('.page-hero__ring--inner', { scale: 0.7, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.1)
      .from('.page-hero .section-label', { y: -14, opacity: 0 }, '-=0.6')
      .from('.page-hero h1', { y: 24, opacity: 0 }, '-=0.4')
      .from('.page-hero p', { y: 16, opacity: 0 }, '-=0.35')
      .from('.page-hero .hero-nav a', { y: 14, opacity: 0, stagger: 0.08 }, '-=0.3');

    // 3. Per-section animations
    const sections = [
      { id: '#web',    entryStyle: 'rise' },
      { id: '#marketing', entryStyle: 'alternate' },
      { id: '#design', entryStyle: 'scale' }
    ];

    sections.forEach(({ id, entryStyle }) => {
      const section = document.querySelector(id);
      if (!section) return;

      // ── Section header reveal ──
      const label = section.querySelector('.section-label');
      const heading = section.querySelector('h2');
      const desc = section.querySelector('.section-header p');

      if (label) {
        gsap.from(label, {
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
          x: -30,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      if (heading) {
        gsap.from(heading, {
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.15,
          ease: 'power2.out'
        });
      }
      if (desc) {
        gsap.from(desc, {
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
          y: 14,
          opacity: 0,
          duration: 0.5,
          delay: 0.3,
          ease: 'power2.out'
        });
      }

      // ── Cards with per-category entry style ──
      const cards = section.querySelectorAll('.srv-card');
      if (!cards.length) return;

      let fromVars, toVars;

      if (entryStyle === 'rise') {
        fromVars = { y: 60, opacity: 0 };
        toVars = {
          y: 0,
          opacity: 1,
          stagger: { amount: 0.55, from: 'start' },
          duration: 0.55,
          ease: 'power3.out'
        };
      } else if (entryStyle === 'alternate') {
        fromVars = { opacity: 0 };
        toVars = {
          opacity: 1,
          stagger: { amount: 0.55, from: 'start' },
          duration: 0.5,
          ease: 'power2.out'
        };
        // Set x individually per card
        cards.forEach((card, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          gsap.set(card, { x: dir * 60 });
        });
      } else if (entryStyle === 'scale') {
        fromVars = { scale: 0.88, opacity: 0, rotation: -2 };
        toVars = {
          scale: 1,
          opacity: 1,
          rotation: 0,
          stagger: { amount: 0.5, from: 'start' },
          duration: 0.5,
          ease: 'back.out(1.4)'
        };
      }

      if (entryStyle === 'alternate') {
        gsap.to(cards, {
          x: 0,
          opacity: 1,
          stagger: { amount: 0.55, from: 'start' },
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%', once: true }
        });
      } else if (fromVars && toVars) {
        gsap.fromTo(cards, fromVars, {
          ...toVars,
          scrollTrigger: { trigger: section, start: 'top 70%', once: true }
        });
      }

      // ── Badges pop ──
      const badges = section.querySelectorAll('.srv-card__badge');
      if (badges.length) {
        gsap.from(badges, {
          scrollTrigger: { trigger: section, start: 'top 72%', once: true },
          scale: 0,
          opacity: 0,
          stagger: { amount: 0.5, from: 'start' },
          duration: 0.4,
          ease: 'back.out(2.5)'
        });
      }
    });

    // 4. CTA reveal
    gsap.from('.cta-strip h2', {
      scrollTrigger: { trigger: '.cta-strip', start: 'top 85%', once: true },
      y: 24,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
    gsap.from('.cta-strip p', {
      scrollTrigger: { trigger: '.cta-strip', start: 'top 85%', once: true },
      y: 16,
      opacity: 0,
      duration: 0.5,
      delay: 0.15,
      ease: 'power2.out'
    });
    gsap.from('.cta-strip .btn-group a', {
      scrollTrigger: { trigger: '.cta-strip', start: 'top 85%', once: true },
      y: 14,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      delay: 0.3,
      ease: 'power2.out'
    });

    // 5. Floating section orbs
    document.querySelectorAll('.srv-orb').forEach((orb) => {
      gsap.to(orb, {
        y: '-=20',
        rotation: 3,
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    // 6. Hero backdrop orbs — continuous float (opposite directions)
    document.querySelectorAll('.page-hero__orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: i === 0 ? -22 : 24,
        x: i === 0 ? 14 : -10,
        duration: 5.5 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8 + i * 0.3
      });
    });

    // 7. Hero rings — slow pulse
    document.querySelectorAll('.page-hero__ring').forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1.06 + i * 0.02,
        opacity: 0.55 + i * 0.12,
        duration: 4.5 + i * 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.8 + i * 0.2
      });
    });

    ScrollTrigger.refresh();
  });

  // ─── Card hover micro-interactions (always, not inside matchMedia) ───
  document.querySelectorAll('.srv-card').forEach((card) => {
    const icon = card.querySelector('.srv-card__icon');
    const badge = card.querySelector('.srv-card__badge');
    const footerPrice = card.querySelector('.srv-card__footer-price');

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 24px 56px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.12)',
        duration: 0.35,
        ease: 'power2.out'
      });
      if (icon) {
        gsap.to(icon, {
          scale: 1.15,
          boxShadow: '0 0 28px rgba(99,102,241,0.2)',
          duration: 0.35,
          ease: 'back.out(1.2)'
        });
      }
      if (badge) {
        gsap.to(badge, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
      }
      if (footerPrice) {
        gsap.to(footerPrice, { scale: 1.04, duration: 0.3, ease: 'power2.out' });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: 'none',
        duration: 0.35,
        ease: 'power2.out'
      });
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          boxShadow: 'none',
          duration: 0.35,
          ease: 'power2.out'
        });
      }
      if (badge) {
        gsap.to(badge, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
      if (footerPrice) {
        gsap.to(footerPrice, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    });
  });

})();
