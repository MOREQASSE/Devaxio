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

    gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
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
