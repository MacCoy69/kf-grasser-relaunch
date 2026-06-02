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
      // Mobile: ein Durchlauf, dann Standbild auf erstem Frame
      canvas.style.display = 'none';
      if (mobileVideo) {
        mobileVideo.style.display = 'block';
        mobileVideo.loop = false; // sicherstellen, kein Loop

        // Wenn Video durchgelaufen ist → zurück auf Frame 0 und pausieren
        mobileVideo.addEventListener('ended', () => {
          mobileVideo.currentTime = 0;
          mobileVideo.pause();
        });

        // Autoplay versuchen — bei Blockade wird das Poster (erstes Frame) gezeigt
        mobileVideo.play().catch(() => {});
      }
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

    // Cinematic Shader: nur dezente Vignette (Grain entfernt → kein Flackern)
    const uniforms = {
      uVideo:        { value: videoTexture },
      uResolution:   { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      uVideoAspect:  { value: 16 / 9 },
      uVignetteSize: { value: 0.95 },
      uVignetteSoft: { value: 0.65 }
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
      uniform vec2 uResolution;
      uniform float uVideoAspect;
      uniform float uVignetteSize;
      uniform float uVignetteSoft;

      void main() {
        // Cover-fit: match video aspect to screen aspect
        float screenAspect = uResolution.x / uResolution.y;
        vec2 uv = vUv;

        if (screenAspect > uVideoAspect) {
          float scale = uVideoAspect / screenAspect;
          uv.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          float scale = screenAspect / uVideoAspect;
          uv.x = (uv.x - 0.5) * scale + 0.5;
        }

        vec4 color = texture2D(uVideo, uv);

        // ── Vignette — sehr dezent, nur ganz leichtes Abdunkeln der Ecken ──
        vec2 vigUv = vUv - 0.5;
        float dist = length(vigUv);
        float vignette = smoothstep(uVignetteSize, uVignetteSize - uVignetteSoft, dist);
        color.rgb *= mix(0.92, 1.0, vignette);

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
    let videoFrameReady = false; // True when a fresh decoded frame is available

    function setupScrollScrub() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[Hero Video] GSAP/ScrollTrigger not loaded');
        return;
      }

      // PIN-MODE: Hero bleibt am Bildschirm haften, während das Video
      // scroll-gesteuert von 0 → duration läuft. Erst danach wird das
      // Pin freigegeben und die nachfolgenden Sections scrollen normal rein.
      //
      // end: '+=120%' = ab Pin-Start noch 120% der Viewport-Höhe weiter-
      // scrollen bevor das Pin endet → komfortable Distanz, nicht zu lang
      scrollTriggerInstance = gsap.to(video, {
        currentTime: video.duration || 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=120%',
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    }

    // Decoder-Init Trick: play() + pause() initialisiert den Decoder,
    // damit currentTime-Sets später sofort dekodieren statt zu warten
    video.addEventListener('loadedmetadata', () => {
      uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;

      // Force decoder warmup
      const playPromise = video.play();
      if (playPromise && playPromise.then) {
        playPromise.then(() => {
          video.pause();
          video.currentTime = 0;
          videoFrameReady = true;
          setupScrollScrub();
        }).catch(() => {
          // Fallback if autoplay blocked
          videoFrameReady = true;
          setupScrollScrub();
        });
      } else {
        videoFrameReady = true;
        setupScrollScrub();
      }
    });

    // ── On-Demand Rendering ─────────────────────────────
    // Da kein animiertes Uniform (Grain weg) ist, brauchen wir keine
    // 60Hz rAF Loop mehr. Wir rendern nur, wenn:
    //  (a) ein neuer Video-Frame präsentiert wird (rVFC),
    //  (b) ein Seek abgeschlossen ist,
    //  (c) Resize passiert.
    // Das eliminiert jegliches Restflackern durch wiederholtes Texture-Upload.

    function renderOnce() {
      if (!isVisible) return;
      videoTexture.needsUpdate = true;
      renderer.render(scene, camera);
    }

    const useVideoFrameCallback = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    if (useVideoFrameCallback) {
      const onVideoFrameCallback = () => {
        renderOnce();
        video.requestVideoFrameCallback(onVideoFrameCallback);
      };
      video.requestVideoFrameCallback(onVideoFrameCallback);
    } else {
      // Fallback ohne rVFC: minimaler 30Hz Loop
      const renderInterval = setInterval(renderOnce, 33);
    }

    // Beim Seek (durch GSAP-Scrub) explizit re-rendern
    video.addEventListener('seeked', renderOnce);

    // Initial-Render sobald Video bereit ist
    if (video.readyState >= 2) renderOnce();
    else video.addEventListener('loadeddata', renderOnce, { once: true });

    // ── IntersectionObserver: skip rendering when hero out of view ─
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
      renderOnce();
      if (scrollTriggerInstance && scrollTriggerInstance.scrollTrigger) {
        scrollTriggerInstance.scrollTrigger.refresh();
      }
    }
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // ── Scroll-Synced Audio ─────────────────────────────
    // Audio läuft mit dem scroll-driven Video parallel:
    //  – Initial muted (Browser-Policy: kein Autoplay-Audio)
    //  – Erst nach Klick auf Mute-Button wird Audio entsperrt
    //  – Audio.currentTime wird kontinuierlich an video.currentTime
    //    gekoppelt (kleine Drift wird korrigiert)
    //  – Während aktivem Scroll-Movement spielt Audio,
    //    während Stillstand pausiert es
    setupHeroAudio(video);

    // Text Outro Animation entfernt — Headlines bleiben statisch im Hero

    // ── Fallback if Three.js fails for some reason ──────
    function fallbackToNativeVideo() {
      canvas.style.display = 'none';
      if (mobileVideo) {
        mobileVideo.style.display = 'block';
        mobileVideo.loop = false;
        mobileVideo.addEventListener('ended', () => {
          mobileVideo.currentTime = 0;
          mobileVideo.pause();
        });
        mobileVideo.play().catch(() => {});
      }
    }
  }

  // ────────────────────────────────────────────────────────
  // Audio Sync & Toggle
  // ────────────────────────────────────────────────────────
  function setupHeroAudio(video) {
    const audio  = document.getElementById('hero-audio');
    const toggle = document.getElementById('hero-audio-toggle');
    if (!audio || !toggle) return;

    let audioUnlocked = false; // True nachdem User einmal auf Mute-Button geklickt hat
    let scrollIdleTimer = null;
    let isAudioPlaying = false;

    // Toggle-Click: Audio entsperren oder muten
    toggle.addEventListener('click', () => {
      if (!audioUnlocked) {
        // Erstklick: muted entfernen, einmal play+pause aufrufen, damit
        // der Browser Audio dauerhaft erlaubt
        audio.muted = false;
        audio.currentTime = video.currentTime;
        const p = audio.play();
        if (p && p.then) {
          p.then(() => {
            // Sofort wieder pausieren — wir starten nur bei Scroll
            if (!isCurrentlyScrolling()) audio.pause();
            audioUnlocked = true;
            toggle.classList.add('is-on');
            toggle.setAttribute('aria-pressed', 'true');
            toggle.setAttribute('aria-label', 'Ton ausschalten');
          }).catch(err => {
            console.warn('[Hero Audio] play blocked:', err);
          });
        }
        return;
      }

      // Zweiter+ Klick: An/Aus toggeln
      const turningOn = !toggle.classList.contains('is-on');
      toggle.classList.toggle('is-on', turningOn);
      toggle.setAttribute('aria-pressed', String(turningOn));
      toggle.setAttribute('aria-label', turningOn ? 'Ton ausschalten' : 'Ton einschalten');
      audio.muted = !turningOn;
      if (!turningOn) audio.pause();
    });

    // Audio-Zeit kontinuierlich an Video-Zeit anpassen
    // (passiert via ScrollTrigger-Updates — wir hängen uns an die rVFC + seeked Events)
    function syncAudioTime() {
      if (!audioUnlocked || audio.muted) return;
      const drift = Math.abs(audio.currentTime - video.currentTime);
      // Bei >150ms Drift: hart resyncen
      if (drift > 0.15) {
        audio.currentTime = video.currentTime;
      }
    }

    // Scroll-Activity Detection — Audio läuft nur wenn aktiv gescrollt wird
    function isCurrentlyScrolling() {
      return scrollIdleTimer !== null;
    }

    function onScrollActivity() {
      if (!audioUnlocked || !toggle.classList.contains('is-on')) return;

      // Audio starten falls noch nicht
      if (!isAudioPlaying && audio.paused) {
        syncAudioTime();
        const p = audio.play();
        if (p && p.then) p.catch(() => {});
        isAudioPlaying = true;
      }

      // Drift korrigieren
      syncAudioTime();

      // Idle-Timer resetten
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        scrollIdleTimer = null;
        audio.pause();
        isAudioPlaying = false;
      }, 250);
    }

    // ScrollTrigger Update als Trigger nutzen
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.addEventListener('refresh', () => syncAudioTime());
      // Lenis Scroll feuert ScrollTrigger.update — wir hängen uns in das Scroll-Event
    }

    // Direkter Scroll-Listener als Activity-Indikator
    window.addEventListener('scroll', onScrollActivity, { passive: true });

    // Wenn Video seeked (durch GSAP scrub) → Audio re-syncen
    video.addEventListener('seeked', syncAudioTime);
  }
})();
