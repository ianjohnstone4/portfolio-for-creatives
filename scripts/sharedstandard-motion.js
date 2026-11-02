// Silent loops with one external control. Native controls remain the no-JS fallback.
(() => {
  const section = document.querySelector('.ss-motion');
  if (!section) return;

  const clips = [...section.querySelectorAll('video')];
  const button = section.querySelector('.ss-playback-button');
  const label = button?.querySelector('span');
  const status = section.querySelector('.ss-playback-status');
  if (!clips.length || !button || !label || !status) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const pending = new Set();
  const failed = new Set();
  let paused = reducedMotion.matches;
  let autoplayBlocked = false;

  const shouldPlay = (clip) =>
    !paused && !document.hidden && visible.has(clip) && !failed.has(clip);

  function updateControl() {
    button.dataset.paused = String(paused);
    label.textContent = paused ? 'Play animations' : 'Pause animations';
    status.textContent = paused
      ? autoplayBlocked
        ? 'Select play to watch'
        : reducedMotion.matches
          ? 'Reduced motion is on'
          : 'Animations paused'
      : 'Silent · On repeat';
    button.hidden = failed.size === clips.length;
    if (button.hidden) status.textContent = 'Previews unavailable';
  }

  function syncClip(clip) {
    if (!shouldPlay(clip)) {
      clip.pause();
      return;
    }
    if (!clip.paused || pending.has(clip)) return;

    pending.add(clip);
    clip.play().then(() => {
      pending.delete(clip);
      // A scroll, preference change, or pause can happen while playback loads.
      if (!shouldPlay(clip)) clip.pause();
    }).catch((error) => {
      pending.delete(clip);
      if (error.name === 'NotAllowedError' && shouldPlay(clip)) {
        paused = true;
        autoplayBlocked = true;
        clips.forEach((other) => other.pause());
        updateControl();
      } else if (error.name === 'AbortError' && shouldPlay(clip)) {
        syncClip(clip);
      }
    });
  }

  function syncPlayback() {
    clips.forEach(syncClip);
  }

  button.addEventListener('click', () => {
    paused = !paused;
    autoplayBlocked = false;
    updateControl();
    syncPlayback();
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) paused = true;
    updateControl();
    syncPlayback();
  });

  document.addEventListener('visibilitychange', syncPlayback);

  clips.forEach((clip) => {
    clip.muted = true;
    clip.loop = true;
    clip.controls = false;
    clip.addEventListener('error', () => {
      failed.add(clip);
      clip.pause();
      const fallback = clip.closest('.ss-motion-card').querySelector('.ss-motion-fallback');
      if (fallback) fallback.hidden = false;
      updateControl();
    });
  });
  updateControl();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
        if (isIntersecting && intersectionRatio >= 0.15) visible.add(target);
        else visible.delete(target);
        syncClip(target);
      });
    }, { threshold: [0, 0.15] });
    clips.forEach((clip) => observer.observe(clip));
  } else {
    clips.forEach((clip) => visible.add(clip));
    syncPlayback();
  }
})();
