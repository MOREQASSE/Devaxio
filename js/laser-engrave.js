/**
 * Laser Engraving Stats Animation
 * Inspired by Cursor's section bridges with dramatic laser effect
 */
(function () {
  'use strict';
  
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const statsSection = document.querySelector('[data-laser-engrave]');
    if (!statsSection) return;

    const laserItems = document.querySelectorAll('.stat-item--laser');
    if (laserItems.length === 0) return;

    // Create laser engraving animation sequence
    laserItems.forEach((item, index) => {
      const svgPath = item.querySelector('.stat-number-path');
      const engravedValue = item.querySelector('.stat-value--engraved');
      const statValue = item.querySelector('.stat-value');

      if (!svgPath || !engravedValue) return;

      // Get the text content for stroke length calculation
      const textLength = svgPath.getComputedTextLength ? svgPath.getComputedTextLength() : 200;
      
      // Set initial stroke properties
      svgPath.style.strokeDasharray = textLength;
      svgPath.style.strokeDashoffset = textLength;
      engravedValue.style.opacity = '0';

      // Create the laser engraving timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 0.3,
          toggleActions: 'play none none reverse'
        }
      });

      // Laser beam stroke animation
      tl.to(svgPath, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power2.inOut',
        onStart: () => {
          item.classList.add('engraving');
        },
        onComplete: () => {
          item.classList.remove('engraving');
        }
      });

      // Reveal the engraved value
      tl.to(engravedValue, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.3');

      // Count up animation for the engraved value
      const endValue = parseFloat(engravedValue.dataset.count) || 0;
      const suffix = engravedValue.dataset.suffix || '';
      
      tl.to({}, {
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: function() {
          const progress = this.progress();
          const currentVal = Math.floor(progress * endValue);
          engravedValue.textContent = currentVal + suffix;
        }
      }, '-=0.2');

      // Final glow effect
      tl.to(engravedValue, {
        textShadow: '0 0 10px rgba(56, 189, 248, 0.4), 0 0 20px rgba(99, 102, 241, 0.2)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Add laser canvas overlay animation
    const laserCanvas = statsSection.querySelector('.laser-canvas');
    if (laserCanvas) {
      gsap.to(laserCanvas, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsSection,
          start: 'top 90%',
          end: 'top 70%',
          scrub: 0.5
        }
      });
    }

    // Add background glow effect to the entire stats section
    gsap.to(statsSection, {
      onStart: () => {
        statsSection.classList.add('engraving');
      },
      onComplete: () => {
        statsSection.classList.remove('engraving');
      },
      scrollTrigger: {
        trigger: statsSection,
        start: 'top 85%',
        end: 'top 65%',
        scrub: 0.5
      }
    });

    // Create laser beam sweep effect across the section
    const beamTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: statsSection,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 0.8
      }
    });

    // Add temporary laser beam elements that sweep across
    const container = statsSection.querySelector('.container');
    if (container) {
      for (let i = 0; i < 4; i++) {
        const beam = document.createElement('div');
        beam.className = 'laser-beam';
        beam.style.left = '-10%';
        beam.style.width = '20%';
        beam.style.top = `${20 + i * 15}%`;
        beam.style.opacity = '0';
        container.appendChild(beam);

        beamTimeline.to(beam, {
          left: '90%',
          opacity: 1,
          duration: 0.8,
          ease: 'power1.inOut',
          delay: i * 0.15
        }, i * 0.15);

        beamTimeline.to(beam, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, `>-0.2`);
      }
    }

    // Add spark effects at engraving points
    laserItems.forEach((item, index) => {
      const sparkTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 60%',
          scrub: 0.4
        }
      });

      for (let i = 0; i < 3; i++) {
        const spark = document.createElement('div');
        spark.className = 'laser-spark';
        spark.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
        spark.style.top = `${40 + (Math.random() - 0.5) * 20}%`;
        spark.style.opacity = '0';
        item.appendChild(spark);

        sparkTimeline.to(spark, {
          opacity: 1,
          scale: 1.5,
          duration: 0.15,
          ease: 'power1.out',
          delay: index * 0.1 + i * 0.08
        });

        sparkTimeline.to(spark, {
          opacity: 0,
          scale: 0.5,
          y: '-=20',
          x: `${(Math.random() - 0.5) * 30}`,
          duration: 0.25,
          ease: 'power2.in'
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();