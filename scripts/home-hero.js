/* Cursor field follows gently and returns to centre when the pointer leaves. */
(() => {
  const hero = document.querySelector('.work-page .hero');
  if (!hero) return;
  const motion = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  );
  const glow = document.createElement('div');
  glow.className = 'hero-cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  hero.prepend(glow);

  let bounds;
  let boundsDirty = true;
  let pointerInside = false;
  let lastPointer;
  let current;
  let frame = 0;
  let previousTime = 0;

  const cancelFrame = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  };

  const render = (time) => {
    frame = 0;
    if (!motion.matches || document.hidden) return;
    if (boundsDirty) {
      bounds = hero.getBoundingClientRect();
      boundsDirty = false;
    }
    const target = { x: bounds.width / 2, y: bounds.height / 2 };
    if (pointerInside && lastPointer) {
      const x = lastPointer.x - bounds.left;
      const y = lastPointer.y - bounds.top;
      if (x >= 0 && x <= bounds.width && y >= 0 && y <= bounds.height) {
        target.x = x;
        target.y = y;
      } else {
        pointerInside = false;
      }
    }
    if (!current) current = { x: bounds.width / 2, y: bounds.height / 2 };
    const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
    const follow = 1 - Math.exp(-delta / 90);
    current.x += (target.x - current.x) * follow;
    current.y += (target.y - current.y) * follow;
    previousTime = time;
    glow.style.setProperty('--glow-x', `${current.x.toFixed(2)}px`);
    glow.style.setProperty('--glow-y', `${current.y.toFixed(2)}px`);
    glow.classList.add('is-visible');
    if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.2) {
      frame = window.requestAnimationFrame(render);
    } else {
      previousTime = 0;
    }
  };

  const requestRender = () => {
    if (!frame && motion.matches && !document.hidden) {
      frame = window.requestAnimationFrame(render);
    }
  };
  const resetToCentre = () => {
    pointerInside = false;
    requestRender();
  };
  const trackPointer = (event) => {
    if (!motion.matches || event.pointerType === 'touch') return;
    if (!pointerInside) boundsDirty = true;
    pointerInside = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    requestRender();
  };
  const invalidateBounds = () => {
    boundsDirty = true;
    requestRender();
  };
  const syncMotion = () => {
    cancelFrame();
    pointerInside = false;
    current = undefined;
    boundsDirty = true;
    hero.classList.toggle('has-cursor-gradient', motion.matches);
    glow.classList.remove('is-visible');
    requestRender();
  };

  hero.addEventListener('pointerenter', trackPointer);
  hero.addEventListener('pointermove', trackPointer, { passive: true });
  hero.addEventListener('pointerleave', resetToCentre);
  hero.addEventListener('pointercancel', resetToCentre);
  window.addEventListener('scroll', invalidateBounds, { passive: true });
  window.addEventListener('resize', invalidateBounds, { passive: true });
  window.addEventListener('blur', resetToCentre);
  window.addEventListener('pagehide', cancelFrame);
  window.addEventListener('pageshow', invalidateBounds);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelFrame();
    else resetToCentre();
  });
  motion.addEventListener('change', syncMotion);
  if ('ResizeObserver' in window) new ResizeObserver(invalidateBounds).observe(hero);
  syncMotion();
})();
