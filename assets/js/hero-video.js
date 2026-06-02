/* =========================================================
   GRASSER CARS — Scroll-Driven Hero Video
   Three.js WebGL Video-Scrubbing (Desktop)
   Native Autoplay-Loop (Mobile)
   Cinematic Layer: Vignette + Film Grain
   ========================================================= */

(function () {
  'use strict';

  // ── Wait for DOM + Libraries ────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const canvas = document.getElementById('hero-canvas');
    const mobileVideo = document.querySelector('.hero__video-mobile');
    const heroSection = document.getElementById('start');

    if (!canvas || !heroSection) return;

    // ── Mobile Detection ─────────────────────────────────
    // Mobile sees native autoplay loop, no WebGL
    const isMobile =
      window.matchMedia('(max-width: 767px)').matches ||
      (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches);

    if (isMobile) {
      // Hide canvas, ensure mobile video is visible
      canvas.style.display = 'none';
      if (mobileVideo) {
        mobileVideo.style.display = 'block';
        // Try to start playback (autoplay may be blocked until interaction)
        mobileVideo.play().catch(() => {
          // Silently fail — poster will show until user interacts
        });
      }
      // Still wire up the text outro animation
      bindTextOutro();
      return;
    }

    // ── Desktop: Three.js Setup ──────────────────────────
    if (typeof THREE === 'undefined') {
      console.warn('[Hero Video] Three.js not loaded — falling back to native video');
      fallbackToNativeVideo();
      return;
    }

    if (mobileVideo) mobileVideo.style.display = 'none';

    // Hidden video source for WebGL texture
    const video = document.createElement('video');
    video.src = 'videos/hero-scrub.mp4';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.style.display = 'none';
    document.body.appendChild(video);

    // Three.js core
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Video Texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    // Cinematic Shader: Vignette + Film Grain
    const uniforms = {
      uVideo:        { value: videoTexture },
      uTime:         { value: 0 },
      uResolution:   { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      uVideoAspect:  { value: 16 / 9 },
      uGrainAmount:  { value: 0.035 },
      uVignetteSize: { value: 0.85 },
      uVignetteSoft: { value: 0.55 }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVideo;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uVideoAspect;
      uniform float uGrainAmount;
      uniform float uVignetteSize;
      uniform float uVignetteSoft;

      // Hash for grain
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        // Cover-fit: match video aspect to screen aspect (object-fit:cover)
        float screenAspect = uResolution.x / uResolution.y;
        vec2 uv = vUv;

        if (screenAspect > uVideoAspect) {
          // Screen wider than video — fit width, crop top/bottom
          float scale = uVideoAspect / screenAspect;
          uv.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          // Screen taller than video — fit height, crop left/right
          float scale = screenAspect / uVideoAspect;
          uv.x = (uv.x - 0.5) * scale + 0.5;
        }

        // Sample video
        vec4 color = texture2D(uVideo, uv);

        // ── Vignette (radial darkening at edges) ──
        vec2 vigUv = vUv - 0.5;
        float dist = length(vigUv);
        float vignette = smoothstep(uVignetteSize, uVignetteSize - uVignetteSoft, dist);
        color.rgb *= mix(0.78, 1.0, vignette);

        // ── Film Grain (animated noise) ──
        float grain = hash(vUv * uResolution + uTime * 100.0);
        color.rgb += (grain - 0.5) * uGrainAmount;

        gl_FragColor = vec4(color.rgb, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Video Ready & Scroll Wiring ──────────────────────
    let scrollTriggerInstance = null;
    let isVisible = true;

    function setupScrollScrub() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[Hero Video] GSAP/ScrollTrigger not loaded');
        return;
      }
      // Map scroll progress → video.currentTime
      scrollTriggerInstance = gsap.to(video, {
        currentTime: video.duration || 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });
    }

    video.addEventListener('loadedmetadata', () => {
      uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
      setupScrollScrub();
    });

    // ── Render Loop ──────────────────────────────────────
    const startTime = performance.now();

    function renderFrame() {
      uniforms.uTime.value = (performance.now() - startTime) * 0.001;
      videoTexture.needsUpdate = true;
      renderer.render(scene, camera);
    }

    function loop() {
      if (isVisible) renderFrame();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // ── IntersectionObserver: pause when hero out of view ─
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { isVisible = e.isIntersecting; });
    }, { threshold: 0 });
    io.observe(heroSection);

    // ── Resize Handler ───────────────────────────────────
    function handleResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
      if (scrollTriggerInstance && scrollTriggerInstance.scrollTrigger) {
        scrollTriggerInstance.scrollTrigger.refresh();
      }
    }
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // ── Text Outro Animation ─────────────────────────────
    bindTextOutro();

    // ── Fallback if Three.js fails for some reason ──────
    function fallbackToNativeVideo() {
      canvas.style.display = 'none';
      if (mobileVideo) {
        mobileVideo.style.display = 'block';
        mobileVideo.play().catch(() => {});
      }
      bindTextOutro();
    }
  }

  // ── Text Outro: Eyebrow → Title → Tagline fly up out ──
  function bindTextOutro() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const eyebrowSpan = document.querySelector('.hero__eyebrow span');
    const titleSpans  = document.querySelectorAll('.hero__title span');
    const taglineSpan = document.querySelector('.hero__tagline span');
    const actions     = document.querySelector('.hero__actions');
    const scrollHint  = document.querySelector('.hero__scroll');

    // Wait for intro animation to finish (heroTl runs ~2.5s on load)
    // ScrollTrigger handles the rest based on scroll position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#start',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    if (eyebrowSpan) {
      tl.to(eyebrowSpan, { yPercent: -130, ease: 'none' }, 0);
    }
    if (titleSpans.length) {
      tl.to(titleSpans, { yPercent: -130, stagger: 0.05, ease: 'none' }, 0.05);
    }
    if (taglineSpan) {
      tl.to(taglineSpan, { yPercent: -110, ease: 'none' }, 0.15);
    }
    if (actions) {
      tl.to(actions, { y: -60, opacity: 0, ease: 'none' }, 0.1);
    }
    if (scrollHint) {
      tl.to(scrollHint, { opacity: 0, y: 30, ease: 'none' }, 0);
    }
  }
})();
