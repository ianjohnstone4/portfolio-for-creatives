/* Spread the Lions' contour gaps locally around the pointer, then close them. */
(() => {
  'use strict';
  const footers = document.querySelectorAll('[data-footer-contours]');
  if (!footers.length) return;
  const motion = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  );
  const ns = 'http://www.w3.org/2000/svg';
  let sourcePromise;
  const svgElement = (tag, attributes, parent) => {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    parent.append(element);
    return element;
  };
  const loadSource = url => {
    if (!sourcePromise) sourcePromise = fetch(url).then(response => {
      if (!response.ok) throw new Error('Contour artwork could not be loaded.');
      return response.text();
    }).then(text => {
      const document = new DOMParser().parseFromString(text, 'image/svg+xml');
      const paths = [...document.querySelectorAll('g > path')].map(path => {
        const d = path.getAttribute('d') || '';
        const commands = d.match(/[a-z]/gi) || [];
        const values = (d.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
        if (commands[0] !== 'M' || commands.slice(1).some(command => command !== 'C') ||
            values.length < 8 || (values.length - 2) % 6 || values.some(value => !Number.isFinite(value))) {
          throw new Error('Unsupported contour geometry.');
        }
        return { values, strokeWidth: path.getAttribute('stroke-width') || '1.15' };
      });
      if (!paths.length) throw new Error('Contour artwork contains no paths.');
      return paths;
    });
    return sourcePromise;
  };

  function createField(footer, layer, source, index) {
    const svg = svgElement('svg', {
      class: 'footer-contours-deform-svg', 'aria-hidden': 'true', focusable: 'false'
    }, layer);
    const definitions = svgElement('defs', {}, svg);
    const gradientId = `footer-contour-light-${index}`;
    const gradient = svgElement('radialGradient', {
      id: gradientId, gradientUnits: 'userSpaceOnUse'
    }, definitions);
    [[0, '#315d43', .18], [.42, '#416b51', .09], [1, '#416b51', 0]].forEach(([offset, color, opacity]) => {
      svgElement('stop', { offset, 'stop-color': color, 'stop-opacity': opacity }, gradient);
    });
    const base = svgElement('g', { fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
    const shine = svgElement('g', {
      fill: 'none', stroke: `url(#${gradientId})`, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'
    }, svg);
    const lines = source.map((spec, lineIndex) => {
      const id = `footer-contour-${index}-${lineIndex}`;
      const path = svgElement('path', {
        id, class: 'footer-contour-path', 'stroke-width': spec.strokeWidth,
        'vector-effect': 'non-scaling-stroke'
      }, definitions);
      svgElement('use', { href: `#${id}` }, base);
      svgElement('use', { href: `#${id}` }, shine);
      return { source: spec.values, points: new Float64Array(spec.values.length),
        offsets: new Float64Array(spec.values.length / 2), xText: [], path };
    });
    let width = 0;
    let height = 0;
    let radiusX = 0;
    let radiusY = 0;
    const paintLine = line => {
      const coordinates = [];
      for (let i = 0; i < line.points.length; i += 2) {
        coordinates.push(line.xText[i / 2], (line.points[i + 1] + line.offsets[i / 2]).toFixed(2));
      }
      line.path.setAttribute('d', `M${coordinates[0]},${coordinates[1]}C${coordinates.slice(2).join(',')}`);
    };
    const reset = () => {
      lines.forEach(line => { line.offsets.fill(0); if (width) paintLine(line); });
    };
    return {
      measure(bounds) {
        if (bounds.width === width && bounds.height === height) return;
        width = bounds.width;
        height = bounds.height;
        const artworkWidth = Math.max(width, 720);
        const left = (width - artworkWidth) / 2;
        radiusX = Math.max(140, Math.min(220, width * .12));
        radiusY = Math.max(70, Math.min(105, height * .14));
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        gradient.setAttribute('r', Math.max(260, Math.min(600, innerWidth * .45)));
        gradient.setAttribute('cx', width / 2);
        gradient.setAttribute('cy', height * .45);
        const baseStyle = getComputedStyle(layer.querySelector('.footer-contours-base'));
        base.setAttribute('stroke', baseStyle.backgroundColor);
        base.setAttribute('opacity', baseStyle.opacity);
        shine.setAttribute('opacity', getComputedStyle(layer.querySelector('.footer-contours-light')).opacity);
        lines.forEach(line => {
          for (let i = 0; i < line.source.length; i += 2) {
            line.points[i] = left + line.source[i] * artworkWidth / 1000;
            line.points[i + 1] = line.source[i + 1] * height / 480;
            line.xText[i / 2] = line.points[i].toFixed(2);
          }
        });
        reset();
      },
      setActive(active) { footer.classList.toggle('footer-contours-deform-ready', active); },
      light(position) {
        gradient.setAttribute('cx', position.x.toFixed(3));
        gradient.setAttribute('cy', position.y.toFixed(3));
      },
      update(pointer, inside, elapsed) {
        let error = 0;
        lines.forEach(line => {
          let dirty = false;
          for (let i = 0; i < line.points.length; i += 2) {
            const dx = (line.points[i] - pointer.x) / radiusX;
            const dy = line.points[i + 1] - pointer.y;
            // This increasing vertical mapping opens nearby gaps without line crossings.
            let target = inside ? dy * .85 * Math.exp(-.5 * (dx * dx + dy * dy / (radiusY * radiusY))) : 0;
            if (Math.abs(target) < .025) target = 0;
            const old = line.offsets[i / 2];
            const returning = Math.abs(target) < Math.abs(old);
            const follow = 1 - Math.exp(-elapsed / (returning ? 55 : 70));
            const next = Math.abs(target - old) < .025 ? target : old + (target - old) * follow;
            if (next !== old) dirty = true;
            line.offsets[i / 2] = next;
            error = Math.max(error, Math.abs(target - next));
          }
          if (dirty) paintLine(line);
        });
        return error > .025;
      },
      reset
    };
  }

  footers.forEach((footer, index) => {
    const layer = footer.querySelector('.footer-contours-layer');
    const isLions = footer.dataset.footerArt !== 'growth-rings';
    let field;
    let fieldLoading = false;
    let fieldFailed = false;
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
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const requestRender = () => {
      if (!frame && canAnimate()) frame = requestAnimationFrame(render);
    };
    const ensureField = () => {
      if (!isLions || !layer || field || fieldLoading || fieldFailed || !canAnimate()) return;
      const mask = getComputedStyle(layer.querySelector('.footer-contours-base')).maskImage;
      const url = mask.match(/^url\(["']?(.*?)["']?\)$/)?.[1];
      if (!url) return;
      fieldLoading = true;
      loadSource(url).then(source => {
        field = createField(footer, layer, source, index);
        fieldLoading = false;
        boundsDirty = true;
        requestRender();
      }).catch(error => {
        fieldLoading = false;
        fieldFailed = true;
        console.warn('Using the static contour footer:', error);
      });
    };
    function render(time) {
      frame = 0;
      if (!canAnimate()) return;
      if (boundsDirty) {
        bounds = footer.getBoundingClientRect();
        boundsDirty = false;
        if (bounds.width && bounds.height) field?.measure(bounds);
      }
      if (!bounds.width || !bounds.height) return;
      const target = { x: bounds.width / 2, y: bounds.height * .45 };
      if (pointerInside && pointer) {
        const x = pointer.x - bounds.left;
        const y = pointer.y - bounds.top;
        if (x >= 0 && x <= bounds.width && y >= 0 && y <= bounds.height) {
          target.x = x;
          target.y = y;
        } else pointerInside = false;
      }
      if (!current) current = { x: bounds.width / 2, y: bounds.height * .45 };
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      const follow = 1 - Math.exp(-elapsed / 110);
      current.x += (target.x - current.x) * follow;
      current.y += (target.y - current.y) * follow;
      footer.style.setProperty('--footer-light-x', `${current.x.toFixed(3)}px`);
      footer.style.setProperty('--footer-light-y', `${current.y.toFixed(3)}px`);
      field?.setActive(true);
      field?.light(current);
      const gapsSettling = field?.update(target, pointerInside, elapsed);
      const lightSettling = Math.hypot(target.x - current.x, target.y - current.y) > .15;
      if (!lightSettling) Object.assign(current, target);
      previousTime = time;
      if (gapsSettling || lightSettling) frame = requestAnimationFrame(render);
      else previousTime = 0;
    }
    const recenter = () => { pointerInside = false; requestRender(); };
    const invalidate = () => {
      boundsDirty = true;
      ensureField();
      requestRender();
    };
    const resetMotion = () => {
      cancelFrame();
      pointerInside = false;
      pointer = undefined;
      current = undefined;
      boundsDirty = true;
      field?.reset();
      field?.setActive(false);
      clearPosition();
      ensureField();
      requestRender();
    };
    const track = event => {
      if (!motion.matches || !pageActive || document.hidden || event.pointerType === 'touch') return;
      if (!pointerInside) boundsDirty = true;
      pointerInside = true;
      pointer = { x: event.clientX, y: event.clientY };
      ensureField();
      requestRender();
    };
    footer.addEventListener('pointerenter', track, { passive: true });
    footer.addEventListener('pointermove', track, { passive: true });
    footer.addEventListener('pointerleave', recenter);
    footer.addEventListener('pointercancel', recenter);
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('blur', recenter);
    window.addEventListener('pagehide', () => { pageActive = false; resetMotion(); });
    window.addEventListener('pageshow', () => { pageActive = true; resetMotion(); });
    document.addEventListener('visibilitychange', resetMotion);
    motion.addEventListener('change', resetMotion);
    if ('ResizeObserver' in window) new ResizeObserver(invalidate).observe(footer);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) invalidate();
        else resetMotion();
      }).observe(footer);
    }
    ensureField();
    requestRender();
  });
})();
