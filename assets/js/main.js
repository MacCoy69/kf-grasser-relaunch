/* =========================================================
   GRASSER CARS — Main JavaScript
   GSAP + ScrollTrigger + Lenis
   Wunderwald Media · 2025
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Lenis Smooth Scroll ──────────────────────────────── */
  const lenis = new Lenis({
    duration: 1.25,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  /* ── Register GSAP Plugins ────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Navbar ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  ScrollTrigger.create({
    start: '80px top',
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  // Mobile burger
  const burger   = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Hero Animation (on load) ─────────────────────────── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  heroTl
    .to('.hero__eyebrow span', {
      y: '0%',
      duration: 1,
      delay: 0.2,
    })
    .to('.hero__title span', {
      y: '0%',
      duration: 1.2,
      stagger: 0.08,
    }, '-=0.7')
    .to('.hero__tagline span', {
      y: '0%',
      duration: 1,
    }, '-=0.7')
    .to('.hero__actions', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.6')
    .to('.hero__scroll', {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, '-=0.5');

  /* ── Hero Parallax on Scroll — auf Bild angewendet ───── */
  gsap.to('.hero__bg', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '#start',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Fade out hero content on scroll
  gsap.to('.hero__content', {
    opacity: 0,
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#start',
      start: 'top top',
      end: '35% top',
      scrub: true,
    },
  });

  /* ── Scroll Reveal (global) ───────────────────────────── */
  function createReveal(selector, extra = {}) {
    document.querySelectorAll(selector).forEach(el => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        ...extra,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  createReveal('.reveal');
  createReveal('.reveal-left');
  createReveal('.reveal-right');

  // Stagger for groups
  document.querySelectorAll('.stagger-group').forEach(group => {
    const items = group.querySelectorAll('.stagger-item');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
      },
    });
  });

  /* ── Quote Section ────────────────────────────────────── */
  gsap.fromTo('#zitat .quote__accent',
    { width: 0 },
    {
      width: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#zitat', start: 'top 80%' },
    }
  );

  /* ── Vehicle Slider ───────────────────────────────────── */
  const track   = document.querySelector('.vehicles__track');
  const prevBtn = document.querySelector('.vehicles__arrow.prev');
  const nextBtn = document.querySelector('.vehicles__arrow.next');

  if (track && prevBtn && nextBtn) {
    function getCardWidth() {
      const card = track.querySelector('.vehicle-card');
      if (!card) return 0;
      const gap = 20;
      return card.offsetWidth + gap;
    }

    function updateArrows() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
    }

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();

    // Touch / swipe
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) {
        track.scrollBy({ left: dx > 0 ? getCardWidth() : -getCardWidth(), behavior: 'smooth' });
      }
    }, { passive: true });
  }

  /* ── FAQ Accordion ────────────────────────────────────── */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq__answer').style.height = '0';
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open if was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.height = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Contact Form ─────────────────────────────────────── */
  const form = document.querySelector('.contact__form form');
  const successMsg = document.querySelector('.form__success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Basic validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--accent)';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Simulate send (prototype)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Wird gesendet…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
        }
      }, 1200);
    });
  }

  /* ── Smooth anchor scroll ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      }
    });
  });

}); // END DOMContentLoaded
