/**
 * Subtle parallax on section bridges (gsap.utils.mapRange)
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    const mapY = gsap.utils.mapRange(0, 1, 0, 22);
    const mapY2 = gsap.utils.mapRange(0, 1, 0, 38);

    gsap.utils.toArray('.section-bridge[data-parallax]').forEach((bridge) => {
      const fill = bridge.querySelector('.bridge-fill');
      const rim = bridge.querySelector('.bridge-rim');
      const accent = bridge.querySelector('.bridge-accent');

      ScrollTrigger.create({
        trigger: bridge,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate(self) {
          const p = gsap.utils.clamp(0, 1, self.progress);
          if (fill) gsap.set(fill, { y: mapY2(p) });
          if (rim) gsap.set(rim, { y: mapY(p) });
          if (accent) gsap.set(accent, { y: mapY(p) * 0.7 });
        },
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
