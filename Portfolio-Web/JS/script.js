

/**
 * Query helper â€” shorthand for document.querySelector
 * @param {string} selector
 * @param {Element|Document} context
 * @returns {Element|null}
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * QueryAll helper â€” shorthand for document.querySelectorAll
 * @param {string} selector
 * @param {Element|Document} context
 * @returns {NodeList}
 */
const $$ = (selector, context = document) => context.querySelectorAll(selector);

/* 0. ORBIT ANIMATION – random 3-axis rotation per ring */
function initOrbitAnimation() {
  const rings = Array.from(document.querySelectorAll('.iso-ring'));
  if (!rings.length) return;

  // Give each ring independent random angular velocities (deg/frame at 60fps)
  const rand = (min, max) => Math.random() * (max - min) + min;
  const ringStates = rings.map(() => ({
    rx: rand(-180, 180),   // current X angle
    ry: rand(-180, 180),   // current Y angle
    rz: rand(-180, 180),   // current Z angle
    vx: rand(-0.35, 0.35), // X speed (negative = reverse)
    vy: rand(-0.40, 0.40), // Y speed
    vz: rand(-0.55, 0.55), // Z speed (primary spin axis)
    // Randomly drift velocities for extra chaos
    ax: rand(-0.004, 0.004),
    ay: rand(-0.004, 0.004),
    az: rand(-0.006, 0.006),
  }));

  const MAX_V = 0.65;

  function tick() {
    ringStates.forEach((s, i) => {
      // Drift the velocities for organic wandering
      s.vx += s.ax; s.vy += s.ay; s.vz += s.az;
      // Occasionally nudge drift direction so velocity stays bounded
      s.ax += rand(-0.0005, 0.0005);
      s.ay += rand(-0.0005, 0.0005);
      s.az += rand(-0.0005, 0.0005);
      // Clamp velocity so rings don't go too fast or freeze
      s.vx = Math.max(-MAX_V, Math.min(MAX_V, s.vx));
      s.vy = Math.max(-MAX_V, Math.min(MAX_V, s.vy));
      s.vz = Math.max(-MAX_V, Math.min(MAX_V, s.vz));
      // Nudge back towards a safe speed if velocity gets too small
      if (Math.abs(s.vz) < 0.08) s.vz += s.vz < 0 ? -0.05 : 0.05;

      // Advance angles
      s.rx += s.vx; s.ry += s.vy; s.rz += s.vz;

      rings[i].style.transform =
        `rotateX(${s.rx}deg) rotateY(${s.ry}deg) rotateZ(${s.rz}deg)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

initOrbitAnimation();


/* 2. MOBILE NAVIGATION */

const hamburgerBtn = $('#hamburger');
const mobileMenu = $('#mobile-menu');
const mobileLinks = $$('.mobile-link');

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

hamburgerBtn.addEventListener('click', toggleMobileMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});


document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburgerBtn.contains(e.target)
  ) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.focus(); // Return focus to trigger
  }
});


/* 3. SCROLL-REVEAL ANIMATIONS */

function initScrollReveal() {
  const revealEls = $$('.reveal-3d');

  if (!revealEls.length) return;

  // Respect prefers-reduced-motion â€” reveal everything immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        // Stagger sibling reveals within the same parent container
        const siblings = Array.from(
          entry.target.parentElement?.querySelectorAll('.reveal-3d') || []
        );
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = Math.min(siblingIndex * 80, 400); // Cap at 400ms stagger

        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px 50px 0px',
    }
  );

  revealEls.forEach(el => observer.observe(el));
}

initScrollReveal();

/* 4. NAV â€” HEADER SCROLL SHADOW*/
const siteHeader = $('.site-header');

const headerObserver = new IntersectionObserver(
  ([entry]) => {
    siteHeader.style.boxShadow = entry.isIntersecting
      ? 'none'
      : '0 2px 16px rgba(0,0,0,0.3)';
  },
  { threshold: 1.0 }
);

// Create a small invisible sentinel at the very top of the page
const scrollSentinel = document.createElement('div');
scrollSentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(scrollSentinel);
headerObserver.observe(scrollSentinel);

/*  6. FOOTER YEAR AUTO-UPDATE*/

const footerYear = $('#footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/*  7. TERMINAL TYPING EFFECT (Hero) */

function initTerminalAnimation() {
  const terminalLines = $$('.terminal-body p');
  if (!terminalLines.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  terminalLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(10px)';
    line.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });

  terminalLines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 600 + i * 220);
  });
}

initTerminalAnimation();


/* 8. HERO PARALLAX — 3D Mouse Tracking */

function initHeroParallax() {
  const heroContent = $('.hero-content-right');
  const shieldCol = $('.hero-shield-col');
  const isoWrap = $('.iso-wrap');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TILT_MAX = 6;
  const SHIFT_MAX = 20;

  let animFrame = null;
  let currentRotateX = 0, currentRotateY = 0;
  let targetRotateX = 0, targetRotateY = 0;

  function lerp(start, end, factor) { return start + (end - start) * factor; }

  function animate() {
    currentRotateX = lerp(currentRotateX, targetRotateX, 0.05);
    currentRotateY = lerp(currentRotateY, targetRotateY, 0.05);

    if (heroContent) {
      const shiftX = (currentRotateY / TILT_MAX) * SHIFT_MAX * 0.3;
      const shiftY = (-currentRotateX / TILT_MAX) * SHIFT_MAX * 0.3;
      heroContent.style.transform = `translateX(${shiftX}px) translateY(${shiftY}px)`;
    }

    if (shieldCol) {
      const shiftX = (-currentRotateY / TILT_MAX) * SHIFT_MAX * 0.4;
      const shiftY = (currentRotateX / TILT_MAX) * SHIFT_MAX * 0.4;
      shieldCol.style.transform = `translateX(${shiftX}px) translateY(${shiftY}px)`;
    }

    if (isoWrap) {
      isoWrap.style.transform = `rotateX(${currentRotateX * 0.5}deg) rotateY(${currentRotateY * 0.5}deg)`;
    }

    if (
      Math.abs(currentRotateX - targetRotateX) > 0.01 ||
      Math.abs(currentRotateY - targetRotateY) > 0.01
    ) {
      animFrame = requestAnimationFrame(animate);
    } else {
      animFrame = null;
    }
  }

  function startAnimation() {
    if (!animFrame) animFrame = requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotateX = -ny * TILT_MAX;
    targetRotateY = nx * TILT_MAX;
    startAnimation();
  });

  document.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
    startAnimation();
  });
}

initHeroParallax();


/* 9. ACTIVE NAV LINK HIGHLIGHT */

function initActiveNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'nav-link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-20% 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

initActiveNavHighlight();

/* 10. GSAP SCROLL ANIMATION — Ultra-smooth single timeline */
function initShieldScrollAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const shieldBg = document.querySelector('.global-shield-bg');
  if (!shieldBg) return;

  const mm = gsap.matchMedia();

  // Desktop Path
  mm.add("(min-width: 1025px)", () => {
    const sections = [
      { id: '#hero', pos: { left: '32%', top: '50%', scale: 1, zIndex: 0 } },
      { id: '#about', pos: { left: '85%', top: '25%', scale: 0.9, zIndex: 5 } },
      { id: '#skills', pos: { left: '10%', top: '75%', scale: 0.8, zIndex: 0 } },
      { id: '#education', pos: { left: '88%', top: '20%', scale: 0.85, zIndex: 0 } },
      { id: '#experience', pos: { left: '5%', top: '85%', scale: 0.8, zIndex: 0 } },
      { id: '#certifications', pos: { left: '92%', top: '15%', scale: 0.9, zIndex: 0 } },
      { id: '#projects', pos: { left: '12%', top: '80%', scale: 0.8, zIndex: 0 } },
      { id: '#contact', pos: { left: '80%', top: '50%', scale: 1, zIndex: 0 } }
    ];
    createScrollTimeline(sections, 5);
  });

  // Tablet Path
  mm.add("(min-width: 768px) and (max-width: 1024px)", () => {
    const sections = [
      { id: '#hero', pos: { left: '50%', top: '40%', scale: 0.8, zIndex: 0 } },
      { id: '#about', pos: { left: '80%', top: '30%', scale: 0.7, zIndex: 5 } },
      { id: '#skills', pos: { left: '20%', top: '70%', scale: 0.7, zIndex: 0 } },
      { id: '#education', pos: { left: '75%', top: '25%', scale: 0.7, zIndex: 0 } },
      { id: '#experience', pos: { left: '25%', top: '75%', scale: 0.7, zIndex: 0 } },
      { id: '#certifications', pos: { left: '80%', top: '30%', scale: 0.7, zIndex: 0 } },
      { id: '#projects', pos: { left: '20%', top: '70%', scale: 0.7, zIndex: 0 } },
      { id: '#contact', pos: { left: '50%', top: '50%', scale: 0.8, zIndex: 0 } }
    ];
    createScrollTimeline(sections, 4);
  });

  // Mobile Path
  mm.add("(max-width: 767px)", () => {
    const sections = [
      { id: '#hero', pos: { left: '60%', top: '50%', scale: 0.8, zIndex: 0 } }, // Centered
      { id: '#about', pos: { left: '54%', top: '82%', scale: 0.5, zIndex: 0 } },
      { id: '#skills', pos: { left: '46%', top: '22%', scale: 0.5, zIndex: 0 } },
      { id: '#education', pos: { left: '58%', top: '88%', scale: 0.5, zIndex: 0 } },
      { id: '#experience', pos: { left: '42%', top: '18%', scale: 0.5, zIndex: 0 } },
      { id: '#certifications', pos: { left: '56%', top: '82%', scale: 0.5, zIndex: 0 } },
      { id: '#projects', pos: { left: '44%', top: '22%', scale: 0.5, zIndex: 0 } },
      { id: '#contact', pos: { left: '54%', top: '88%', scale: 0.6, zIndex: 0 } }
    ];
    createScrollTimeline(sections, 3);
  });

  function createScrollTimeline(sections, scrubVal) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: scrubVal,
        invalidateOnRefresh: true
      }
    });

    sections.forEach((section, index) => {
      // First section is our "base" state at scroll 0
      if (index === 0) {
        tl.set(shieldBg, {
          left: section.pos.left,
          top: section.pos.top,
          scale: section.pos.scale,
          zIndex: section.pos.zIndex,
          xPercent: -50,
          yPercent: -50,
          immediateRender: false
        });
      } else {
        tl.to(shieldBg, {
          left: section.pos.left,
          top: section.pos.top,
          scale: section.pos.scale,
          zIndex: section.pos.zIndex,
          xPercent: -50,
          yPercent: -50,
          force3D: true,
          ease: "sine.inOut"
        });
      }
    });
  }
}

// Initialize when DOM be ready
document.addEventListener('DOMContentLoaded', () => {
  // Lock scroll during boot
  document.body.classList.add('boot-locking');

  const shieldBg = document.querySelector('.global-shield-bg');
  if (shieldBg && typeof gsap !== 'undefined') {
    // Perfectly centered for boot on all screens
    gsap.set(shieldBg, {
      left: '70%',
      top: '50%',
      xPercent: -50,
      yPercent: -40,
      scale: 1.1
    });
  }

  if (typeof gsap !== 'undefined') {
    gsap.set(".hero-h1, .hero-eyebrow, .hero-title, .hero-ctas, .scroll-indicator", {
      x: 50,
      opacity: 0
    });
  }
});

window.addEventListener('bootComplete', () => {
  const shieldBg = document.querySelector('.global-shield-bg');
  if (shieldBg && typeof gsap !== 'undefined') {
    initShieldScrollAnimation();

    const isMobile = window.innerWidth < 768;
    const heroLeft = '60%'; // Keep centered for entry reveal on mobile
    const heroTop = '50%';
    const heroScale = isMobile ? 0.8 : 1;

    gsap.to(shieldBg, {
      left: isMobile ? heroLeft : '50',
      top: heroTop,
      scale: heroScale,
      xPercent: -50,
      yPercent: -50,
      duration: 2.5,
      ease: "power3.inOut"
    });

    gsap.to(".hero-h1, .hero-eyebrow, .hero-title, .hero-ctas, .scroll-indicator", {
      x: 0,
      opacity: 1,
      duration: 2.5,
      stagger: 0.15,
      delay: 0.8,
      ease: "power3.out",
      onComplete: () => {
        // Unlock scroll after intro sequence is done
        document.body.classList.remove('boot-locking');
      }
    });
  }
});
