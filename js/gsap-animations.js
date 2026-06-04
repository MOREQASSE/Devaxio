/**
 * Devaxio — GSAP + gsap.utils (hero merge parallax, reveals, counters)
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      document.querySelectorAll('.stat-value[data-count]').forEach((el) => {
        el.textContent = (el.dataset.count || '0') + (el.dataset.suffix || '');
      });
      document.querySelectorAll('.skill-bar-fill[data-width]').forEach((bar) => {
        bar.style.width = (bar.dataset.width || '100') + '%';
      });
      document.querySelectorAll('.about-stat-value[data-count]').forEach((el) => {
        el.textContent = (el.dataset.count || '0') + (el.dataset.suffix || '');
      });
      return;
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.65 } });
      heroTl
        .from('.hero-badge', { y: 14 })
        .from('.hero-copy h1', { y: 20 }, '-=0.45')
        .from('.hero-copy .lead', { y: 14 }, '-=0.5')
        .from('.hero-trust li', { y: 10, stagger: 0.06 }, '-=0.45')
        .from('.hero-cta a', { y: 12, stagger: 0.08 }, '-=0.35')
        .from('.hero-showcase-frame', { scale: 0.96, duration: 0.75 }, '-=0.55');

      const rim = document.querySelector('.hero-merge-layer--rim');
      if (rim && rim.getTotalLength) {
        const len = rim.getTotalLength();
        rim.style.strokeDasharray = String(len);
        rim.style.strokeDashoffset = String(len);
        gsap.to(rim, { strokeDashoffset: 0, duration: 1.35, ease: 'power2.inOut', delay: 0.4 });
      }

      /* gsap.utils.mapRange — parallax layers on scroll through merge zone */
      const mapBackY = gsap.utils.mapRange(0, 1, 0, 28);
      const mapMidY = gsap.utils.mapRange(0, 1, 0, 48);
      const mapRimY = gsap.utils.mapRange(0, 1, 0, 18);
      const mapBeamOpacity = gsap.utils.mapRange(0, 1, 0.65, 0.15);

      const mergeLayers = {
        back: document.querySelector('.hero-merge-layer--back'),
        mid: document.querySelector('.hero-merge-layer--mid'),
        rim: document.querySelector('.hero-merge-layer--rim'),
        accent: document.querySelector('.hero-merge-layer--accent'),
        beam: document.querySelector('.hero-merge-beam'),
      };

      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate(self) {
          const p = gsap.utils.clamp(0, 1, self.progress);
          if (mergeLayers.back) gsap.set(mergeLayers.back, { y: mapBackY(p) });
          if (mergeLayers.mid) gsap.set(mergeLayers.mid, { y: mapMidY(p) });
          if (mergeLayers.rim) gsap.set(mergeLayers.rim, { y: mapRimY(p) });
          if (mergeLayers.accent) gsap.set(mergeLayers.accent, { y: mapMidY(p) * 0.6 });
          if (mergeLayers.beam) mergeLayers.beam.style.opacity = String(mapBeamOpacity(p));
        },
      });

      gsap.to('.hero-showcase-ring', {
        rotation: 3,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.hero-showcase-glow', {
        scale: 1.06,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // About section — visual reveal + content stagger
    const about = document.querySelector('#about');
    if (about) {
      const aboutTl = gsap.timeline({
        scrollTrigger: { trigger: about, start: 'top 80%', once: true },
        defaults: { ease: 'power3.out', duration: 0.5 }
      });
      const aboutLabel = about.querySelector('.section-label');
      const aboutHeading = about.querySelector('h2');
      const aboutText = about.querySelector('p');
      const aboutStats = about.querySelector('.about-stats');
      const aboutBtn = about.querySelector('.btn-secondary');
      const anatomyContainer = about.querySelector('[data-anatomy-container]');
      const anatomyItems = anatomyContainer ? anatomyContainer.querySelectorAll('[data-anatomy]') : null;
      aboutTl
        .from('.about-bg', { scale: 0.92, opacity: 0, duration: 0.6 })
        .from(aboutLabel, { y: -14, opacity: 0 }, '-=0.35')
        .from(aboutHeading, { y: 20, opacity: 0 }, '-=0.3')
        .from(aboutText, { y: 14, opacity: 0 }, '-=0.25')
        .from(aboutStats, { y: 16, opacity: 0 }, '-=0.15')
        .from(aboutBtn, { y: 12, opacity: 0 }, '-=0.1');
      if (anatomyItems && anatomyItems.length) {
        aboutTl.from(anatomyItems, {
          scale: 0.3,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'back.out(2.5)',
          clearProps: 'opacity,visibility'
        }, '-=0.05');
        aboutTl.eventCallback('onComplete', () => {
          if (anatomyContainer) anatomyContainer.setAttribute('data-anatomy-revealed', '');
        });
      }
    }

    // About stat counters
    gsap.utils.toArray('.about-stat-value[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate() { el.textContent = Math.floor(obj.val) + suffix; }
      });
    });

    gsap.utils.toArray('.stat-value[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate() {
          el.textContent = Math.floor(obj.val) + suffix;
        },
      });
    });

    gsap.utils.toArray('.skill-bar-fill[data-width]').forEach((bar) => {
      const w = bar.dataset.width || '100';
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: w + '%',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: bar, start: 'top 92%', once: true },
        }
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
