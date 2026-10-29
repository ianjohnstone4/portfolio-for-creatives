/* No dependencies, scroll interception, remote services or production writes. */
(() => {
  'use strict';
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const glow = document.querySelector('.hero-glow');
  const work = document.querySelector('.work-section');
  const stage = document.querySelector('.work-stage');
  const feature = document.querySelector('.featured-project');
  const motionButton = document.querySelector('.motion-toggle');
  const jumpButton = document.querySelector('.list-jump');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 760px) and (min-height: 560px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  let storedChoice = null;
  try { storedChoice = localStorage.getItem('ian-preview-motion'); } catch (_) { /* Storage can be unavailable in previews. */ }
  let motionPaused = storedChoice === 'off' || reduceMotion.matches;
  let scrolling = false;
  let geometry = {};
  let scrollFrame = 0;
  let heroFrame = 0;
  let heroVisible = true;
  let currentX = hero.clientWidth / 2;
  let currentY = hero.clientHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let footerReady = false;
  let refreshFooter = () => {};
  root.classList.add('js');
  motionButton.hidden = false;

  function measure() {
    scrolling = desktop.matches && !motionPaused;
    root.classList.toggle('scroll-enabled', scrolling);
    const width = stage.clientWidth - parseFloat(getComputedStyle(stage).paddingLeft) * 2;
    const stageHeight = Math.max(640, window.innerHeight);
    const distance = Math.min(900, Math.max(580, window.innerHeight * .92));
    geometry = {
      top: work.getBoundingClientRect().top + window.scrollY,
      width,
      distance,
      fullHeight: Math.min(680, Math.max(430, window.innerHeight - 185)),
      rowHeight: 137,
      startTitle: Math.min(60, Math.max(32, window.innerWidth * .04)),
      endTitle: Math.min(34, Math.max(24, window.innerWidth * .023)),
    };
    work.style.setProperty('--stage-height', `${stageHeight}px`);
    work.style.setProperty('--scroll-distance', `${distance}px`);
    jumpButton.hidden = !scrolling;
    updateScroll();
    targetX = clamp(targetX, 0, hero.clientWidth);
    targetY = clamp(targetY, 0, hero.clientHeight);
    if (motionPaused) {
      currentX = targetX = hero.clientWidth * .5;
      currentY = targetY = hero.clientHeight * .5;
      drawGlow();
    }
    if (footerReady) refreshFooter();
  }

  function updateScroll() {
    scrollFrame = 0;
    if (!scrolling) {
      feature.removeAttribute('style');
      work.style.removeProperty('--rows-progress');
      work.removeAttribute('data-collapse');
      return;
    }
    const progress = clamp((window.scrollY - geometry.top) / geometry.distance);
    const p = smooth(progress);
    const row = geometry.rowHeight;
    const startArtWidth = geometry.width * .58;
    const startArtX = geometry.width * .42;
    const height = lerp(geometry.fullHeight, row, p);
    const copy = 1 - smooth(clamp(progress / .48));
    const shade = [230, 241, 232].map((c, i) => Math.round(lerp(c, [250, 251, 248][i], p)));
    const props = {
      '--collapse': p,
      '--card-height': `${height}px`,
      '--corner': `${lerp(20, 0, p)}px`,
      '--art-x': `${startArtX}px`,
      '--art-y': '0px',
      '--art-width': `${startArtWidth}px`,
      '--art-height': `${height}px`,
      '--art-opacity': 1 - smooth(clamp(progress / .72)),
      '--thumb-opacity': smooth(clamp((progress - .55) / .4)),
      '--label-x': `${lerp(40, 180, p)}px`,
      '--label-y': `${lerp(geometry.fullHeight * .32, 39, p)}px`,
      '--title-size': `${lerp(geometry.startTitle, geometry.endTitle, p)}px`,
      '--copy-opacity': copy,
      '--row-opacity': smooth(clamp((progress - .68) / .32)),
      '--card-shade': `rgb(${shade.join(' ')})`,
    };
    for (const [name, value] of Object.entries(props)) feature.style.setProperty(name, value);
    work.style.setProperty('--rows-progress', smooth(clamp(progress * 1.5)));
    work.dataset.collapse = progress.toFixed(3);
  }

  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', queueScroll, { passive: true });
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(measure);
  }, { passive: true });
  desktop.addEventListener('change', measure);

  jumpButton.addEventListener('click', () => {
    // The end of the scroll scene is the complete list, not a separate duplicate.
    window.scrollTo({ top: geometry.top + geometry.distance, behavior: 'smooth' });
  });
  document.querySelectorAll('.project-row a').forEach(link => {
    link.addEventListener('focus', () => {
      // Keyboard navigation exposes the list immediately instead of leaving focus below a pinned card.
      if (scrolling && window.scrollY < geometry.top + geometry.distance) {
        window.scrollTo({ top: geometry.top + geometry.distance, behavior: 'instant' });
        updateScroll();
      }
    });
  });

  function drawGlow() {
    glow.style.setProperty('--glow-x', `${currentX.toFixed(2)}px`);
    glow.style.setProperty('--glow-y', `${currentY.toFixed(2)}px`);
  }
  function moveGlow() {
    heroFrame = 0;
    if (motionPaused || !heroVisible || document.hidden) return;
    currentX = lerp(currentX, targetX, .075);
    currentY = lerp(currentY, targetY, .075);
    drawGlow();
    if (Math.abs(currentX - targetX) + Math.abs(currentY - targetY) > .3) heroFrame = requestAnimationFrame(moveGlow);
  }
  function startGlow() { if (!heroFrame) heroFrame = requestAnimationFrame(moveGlow); }
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || motionPaused) return;
    const bounds = hero.getBoundingClientRect();
    targetX = event.clientX - bounds.left;
    targetY = event.clientY - bounds.top;
    startGlow();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetX = hero.clientWidth * .5;
    targetY = hero.clientHeight * .5;
    startGlow();
  });

  function updateMotion() {
    root.classList.toggle('motion-off', motionPaused);
    root.classList.toggle('motion-enabled', !motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionButton.setAttribute('aria-label', motionPaused ? 'Enable motion' : 'Pause motion');
    document.querySelector('.motion-label').textContent = motionPaused ? 'Motion off' : 'Motion on';
    measure();
  }
  motionButton.addEventListener('click', () => {
    const previousTop = work.getBoundingClientRect().top;
    const wasScrolling = scrolling;
    motionPaused = !motionPaused;
    storedChoice = motionPaused ? 'off' : 'on';
    try { localStorage.setItem('ian-preview-motion', storedChoice); } catch (_) { /* Optional persistence. */ }
    updateMotion();
    if (wasScrolling && previousTop < 0) window.scrollTo({ top: geometry.top, behavior: 'instant' });
  });
  reduceMotion.addEventListener('change', () => {
    motionPaused = reduceMotion.matches || storedChoice === 'off';
    updateMotion();
  });

  // Decorative dot lettering. No third-party canvas or animation library.
  const playground = document.querySelector('.footer-playground');
  const canvas = document.querySelector('.footer-dots');
  const rippleButton = document.querySelector('.ripple-button');
  const context = canvas.getContext('2d');
  let points = [];
  let footerFrame = 0;
  let footerVisible = false;
  let pointer = { x: -1000, y: -1000, active: false };
  let ripples = [];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let lastTime = 0;

  function buildDots() {
    if (!context) return;
    canvasWidth = playground.clientWidth;
    canvasHeight = playground.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mask = document.createElement('canvas');
    mask.width = canvasWidth;
    mask.height = canvasHeight;
    const m = mask.getContext('2d', { willReadFrequently: true });
    const text = "LET'S TALK";
    let fontSize = canvasWidth * .2;
    m.font = `600 ${fontSize}px Jost, sans-serif`;
    fontSize *= (canvasWidth * .92) / m.measureText(text).width;
    fontSize = Math.min(fontSize, canvasHeight * .85);
    m.font = `600 ${fontSize}px Jost, sans-serif`;
    m.fillStyle = '#fff';
    m.textAlign = 'center';
    m.textBaseline = 'middle';
    m.fillText(text, canvasWidth / 2, canvasHeight * .48);
    const pixels = m.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const gap = canvasWidth < 600 ? 4 : 6;
    points = [];
    for (let y = 0; y < canvasHeight; y += gap) {
      for (let x = 0; x < canvasWidth; x += gap) {
        if (pixels[(y * canvasWidth + x) * 4 + 3] > 100) points.push({ x, y, dx: 0, dy: 0, energy: 0 });
      }
    }
    root.classList.add('canvas-ready');
    ripples = [];
    rippleButton.hidden = false;
    rippleButton.disabled = motionPaused;
    rippleButton.setAttribute('aria-label', motionPaused ? 'Ripple animation paused; enable motion at the top of the page' : 'Make a ripple in the decorative dots');
    renderDots(performance.now(), true);
  }

  function renderDots(time, staticFrame = false) {
    footerFrame = 0;
    if (!context) return;
    const active = !motionPaused && footerVisible && !document.hidden && !staticFrame;
    const dt = Math.min(2, Math.max(.5, (time - lastTime) / 16.667 || 1));
    lastTime = time;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const radius = canvasWidth < 600 ? 100 : 165;
    let settling = false;
    ripples = ripples.filter(r => time - r.start < 1600);
    for (const point of points) {
      let tx = 0;
      let ty = 0;
      let energy = 0;
      if (active && pointer.active) {
        const vx = point.x - pointer.x;
        const vy = point.y - pointer.y;
        const dist = Math.hypot(vx, vy);
        const strength = Math.pow(clamp(1 - dist / radius), 2);
        tx += (vx / (dist || 1)) * strength * 23;
        ty += (vy / (dist || 1)) * strength * 23;
        energy += strength;
      }
      if (active) {
        for (const ripple of ripples) {
          const age = (time - ripple.start) / 1600;
          const dx = point.x - ripple.x;
          const dy = point.y - ripple.y;
          const distance = Math.hypot(dx, dy);
          const ring = Math.exp(-Math.pow((distance - age * canvasWidth * .75) / 34, 2)) * (1 - age);
          tx += (dx / (distance || 1)) * ring * 13;
          ty += (dy / (distance || 1)) * ring * 13;
          energy += ring;
        }
      }
      const easing = active ? 1 - Math.pow(.86, dt) : 1;
      point.dx = lerp(point.dx, tx, easing);
      point.dy = lerp(point.dy, ty, easing);
      point.energy = lerp(point.energy, clamp(energy), easing);
      if (Math.abs(point.dx - tx) + Math.abs(point.dy - ty) + Math.abs(point.energy - energy) > .05) settling = true;
      const light = clamp(point.energy);
      context.fillStyle = `rgba(${Math.round(lerp(122, 211, light))}, ${Math.round(lerp(154, 235, light))}, ${Math.round(lerp(128, 192, light))}, ${lerp(.50, .98, light).toFixed(2)})`;
      context.beginPath();
      context.arc(point.x + point.dx, point.y + point.dy, (canvasWidth < 600 ? .95 : 1.3) + light * .5, 0, Math.PI * 2);
      context.fill();
    }
    if (active && (settling || ripples.length)) footerFrame = requestAnimationFrame(renderDots);
  }
  function requestDots() {
    if (!footerFrame && !motionPaused && footerVisible) footerFrame = requestAnimationFrame(renderDots);
  }
  function addRipple(x, y) {
    if (motionPaused) return;
    ripples.push({ x, y, start: performance.now() });
    if (ripples.length > 3) ripples.shift();
    requestDots();
  }
  playground.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || motionPaused) return;
    const bounds = playground.getBoundingClientRect();
    pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
    requestDots();
  }, { passive: true });
  playground.addEventListener('pointerleave', () => { pointer.active = false; requestDots(); });
  playground.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    const bounds = playground.getBoundingClientRect();
    addRipple(event.clientX - bounds.left, event.clientY - bounds.top);
  }, { passive: true });
  rippleButton.addEventListener('click', () => addRipple(canvasWidth * .5, canvasHeight * .48));
  refreshFooter = buildDots;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) {
          heroVisible = entry.isIntersecting;
          document.querySelector('.rotating-text').style.animationPlayState = heroVisible && !document.hidden ? 'running' : 'paused';
          if (heroVisible) startGlow();
        } else {
          footerVisible = entry.isIntersecting;
          if (footerVisible) requestDots();
        }
      }
    });
    observer.observe(hero);
    observer.observe(playground);
  } else {
    footerVisible = true;
  }
  document.addEventListener('visibilitychange', () => {
    document.querySelector('.rotating-text').style.animationPlayState = heroVisible && !document.hidden ? 'running' : 'paused';
    if (!document.hidden) { queueScroll(); requestDots(); }
  });
  updateMotion();
  drawGlow();
  document.fonts.ready.then(() => {
    footerReady = true;
    measure();
  });
})();
