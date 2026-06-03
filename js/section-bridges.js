/**
 * Enhanced section bridges with advanced parallax and blending animations
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    // Enhanced parallax mapping for smoother movement
    const mapY = gsap.utils.mapRange(0, 1, 0, 18);
    const mapY2 = gsap.utils.mapRange(0, 1, 0, 32);
    const mapOpacity = gsap.utils.mapRange(0, 1, 0.85, 1);
    const mapScale = gsap.utils.mapRange(0, 1, 1, 1.02);

    gsap.utils.toArray('.section-bridge[data-parallax]').forEach((bridge) => {
      const fill = bridge.querySelector('.bridge-fill');
      const rim = bridge.querySelector('.bridge-rim');
      const accent = bridge.querySelector('.bridge-accent');
      const svg = bridge.querySelector('svg');

      // Create smooth parallax animation
      ScrollTrigger.create({
        trigger: bridge,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2, // Slower scrub for smoother effect
        onUpdate(self) {
          const p = gsap.utils.clamp(0, 1, self.progress);
          
          // Multi-layered parallax with different speeds
          if (fill) {
            gsap.set(fill, {
              y: mapY2(p),
              opacity: mapOpacity(p)
            });
          }
          if (rim) {
            gsap.set(rim, {
              y: mapY(p),
              opacity: mapOpacity(p) * 0.9
            });
          }
          if (accent) {
            gsap.set(accent, {
              y: mapY(p) * 0.6,
              opacity: mapOpacity(p) * 0.7
            });
          }
          if (svg) {
            gsap.set(svg, {
              scale: mapScale(p)
            });
          }
        },
      });

      // Add subtle hover effect for bridges
      bridge.addEventListener('mouseenter', () => {
        gsap.to(fill, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
        gsap.to(rim, {
          opacity: 1,
          strokeWidth: 2,
          duration: 0.4,
          ease: 'power2.out'
        });
        gsap.to(accent, {
          opacity: 0.4,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      bridge.addEventListener('mouseleave', () => {
        gsap.to(fill, {
          opacity: 0.95,
          duration: 0.4,
          ease: 'power2.out'
        });
        gsap.to(rim, {
          opacity: 0.85,
          strokeWidth: 1.5,
          duration: 0.4,
          ease: 'power2.out'
        });
        gsap.to(accent, {
          opacity: 0.2,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      // Add entrance animation for bridges
      gsap.fromTo(bridge, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bridge,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Add smooth background color transitions between sections
    const sections = document.querySelectorAll('.section--base, .section--alt');
    sections.forEach((section) => {
      const nextSection = section.nextElementSibling;
      if (nextSection && nextSection.classList.contains('section-bridge')) {
        // Create smooth transition effect when entering bridge zone
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom 50%',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate(self) {
            const p = gsap.utils.clamp(0, 1, self.progress);
            // Subtle color blend transition
            const bridge = nextSection;
            if (bridge) {
              gsap.set(bridge, {
                opacity: 0.95 + (p * 0.05)
              });
            }
          }
        });
      }
    });

    // Add floating particles effect near bridges for enhanced blending
    const createBridgeParticles = (bridge) => {
      if (bridge.querySelector('.bridge-particle')) return; // Already has particles
      
      const particleCount = 3;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'bridge-particle';
        particle.style.cssText = `
          position: absolute;
          width: ${2 + Math.random() * 2}px;
          height: ${2 + Math.random() * 2}px;
          background: rgba(99, 102, 241, ${0.3 + Math.random() * 0.3});
          border-radius: 50%;
          left: ${20 + Math.random() * 60}%;
          top: ${30 + Math.random() * 40}%;
          opacity: 0;
          pointer-events: none;
        `;
        bridge.appendChild(particle);

        // Animate particles
        gsap.to(particle, {
          y: -20 - Math.random() * 30,
          x: (Math.random() - 0.5) * 20,
          opacity: 0,
          duration: 3 + Math.random() * 2,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: bridge,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.5
          },
          onComplete: () => {
            gsap.set(particle, { y: 0, x: 0, opacity: 0.6 });
            gsap.to(particle, {
              y: -20 - Math.random() * 30,
              x: (Math.random() - 0.5) * 20,
              opacity: 0,
              duration: 3 + Math.random() * 2,
              ease: 'power1.out',
              repeat: -1,
              repeatDelay: 1 + Math.random()
            });
          }
        });
      }
    };

    // Apply particles to bridges
    gsap.utils.toArray('.section-bridge').forEach(createBridgeParticles);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
