/* Keep the contour geometry still; move only the soft light behind it. */
(() => {
  'use strict';
  const footers = document.querySelectorAll('[data-footer-contours]');
  if (!footers.length) return;

  const motion = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  );

  footers.forEach(footer => {
    let bounds;
    let boundsDirty = true;
    let visible = !('IntersectionObserver' in window);
    let pageActive = true;
    let pointerInside = false;
    let pointer;
    let current;
    let frame = 0;
    let previousTime = 0;

    const canAnimate = () => motion.matches && visible && pageActive && !document.hidden;
    const clearPosition = () => {
      footer.style.removeProperty('--footer-light-x');
      footer.style.removeProperty('--footer-light-y');
    };
    const cancelFrame = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const paint = () => {
      footer.style.setProperty('--footer-light-x', `${current.x.toFixed(3)}px`);
      footer.style.setProperty('--footer-light-y', `${current.y.toFixed(3)}px`);
    };

    const render = time => {
      frame = 0;
      if (!canAnimate()) return;
      if (boundsDirty) {
        bounds = footer.getBoundingClientRect();
        boundsDirty = false;
      }
      if (!bounds.width || !bounds.height) {
        current = undefined;
        clearPosition();
        previousTime = 0;
        return;
      }

      const target = { x: bounds.width / 2, y: bounds.height * .45 };
      if (pointerInside && pointer) {
        const x = pointer.x - bounds.left;
        const y = pointer.y - bounds.top;
        if (x >= 0 && x <= bounds.width && y >= 0 && y <= bounds.height) {
          target.x = x;
          target.y = y;
        } else {
          pointerInside = false;
        }
      }
      if (!current) current = { x: bounds.width / 2, y: bounds.height * .45 };

      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      const follow = 1 - Math.exp(-elapsed / 110);
      current.x += (target.x - current.x) * follow;
      current.y += (target.y - current.y) * follow;
      previousTime = time;
      const settling = Math.hypot(target.x - current.x, target.y - current.y) > .15;
      if (!settling) Object.assign(current, target);
      paint();
      if (settling) frame = window.requestAnimationFrame(render);
      else previousTime = 0;
    };

    const requestRender = () => {
      if (!frame && canAnimate()) frame = window.requestAnimationFrame(render);
    };
    const recenter = () => {
      pointerInside = false;
      requestRender();
    };
    const invalidate = () => {
      boundsDirty = true;
      requestRender();
    };
    const resetMotion = () => {
      cancelFrame();
      pointerInside = false;
      pointer = undefined;
      current = undefined;
      boundsDirty = true;
      clearPosition();
      requestRender();
    };
    const track = event => {
      if (!canAnimate() || event.pointerType === 'touch') return;
      if (!pointerInside) boundsDirty = true;
      pointerInside = true;
      pointer = { x: event.clientX, y: event.clientY };
      requestRender();
    };

    footer.addEventListener('pointerenter', track, { passive: true });
    footer.addEventListener('pointermove', track, { passive: true });
    footer.addEventListener('pointerleave', recenter);
    footer.addEventListener('pointercancel', recenter);
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('blur', recenter);
    window.addEventListener('pagehide', () => {
      pageActive = false;
      pointerInside = false;
      cancelFrame();
    });
    window.addEventListener('pageshow', () => {
      pageActive = true;
      resetMotion();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pointerInside = false;
        cancelFrame();
      } else resetMotion();
    });
    motion.addEventListener('change', resetMotion);

    if ('ResizeObserver' in window) new ResizeObserver(invalidate).observe(footer);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) invalidate();
        else {
          pointerInside = false;
          current = undefined;
          cancelFrame();
          clearPosition();
        }
      }).observe(footer);
    }
    requestRender();
  });
})();
