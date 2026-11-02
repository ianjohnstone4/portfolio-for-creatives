(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-velvet-preview]').forEach((root) => {
    const screens = [...root.querySelectorAll('.vp-screen')];
    const selectors = [...root.querySelectorAll('[data-vp-screen]')];
    const play = root.querySelector('.vp-play');
    const playLabel = play.querySelector('.vp-play-label');
    const symbol = play.querySelector('.vp-play-symbol');
    const caption = root.querySelector('.vp-caption-text');
    const source = root.querySelector('.vp-source-link');
    const counter = root.querySelector('.vp-stage-count');
    const announcement = root.querySelector('[aria-live]');
    const reducedNote = root.querySelector('.vp-reduced-note');
    const delay = 4200;
    const progress = document.createElement('span');
    const progressTrack = document.createElement('span');
    progressTrack.className = 'vp-playback-progress';
    progressTrack.setAttribute('aria-hidden', 'true');
    progressTrack.appendChild(progress);
    root.querySelector('.vp-browser').appendChild(progressTrack);
    let progressAnimation;
    let index = 0;
    let timer = 0;
    let visible = false;
    let paused = root.dataset.autoplay !== 'true';
    let manuallyPaused = false;
    let labReduced = false;
    const isReduced = () => preference.matches || labReduced;

    function stopTimer() {
      window.clearTimeout(timer);
      timer = 0;
      progressAnimation?.cancel();
      progressAnimation = null;
    }
    function schedule() {
      stopTimer();
      if (!paused && visible && !document.hidden && !isReduced()) {
        timer = window.setTimeout(() => { select((index + 1) % screens.length); schedule(); }, delay);
        progressAnimation = progress.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: delay, easing: 'linear', fill: 'forwards' });
      }
      root.dataset.playing = String(!paused && visible && !document.hidden && !isReduced());
    }
    function updateControl() {
      playLabel.textContent = paused ? 'Play preview' : 'Pause';
      symbol.textContent = paused ? '▶' : 'Ⅱ';
      play.setAttribute('aria-label', paused ? 'Play Velvet Pour screen preview' : 'Pause Velvet Pour screen preview');
      play.hidden = isReduced();
      reducedNote.hidden = !isReduced();
      schedule();
    }
    function select(next, manual = false) {
      index = next;
      screens.forEach((screen, i) => {
        screen.classList.toggle('is-active', i === index);
        screen.setAttribute('aria-hidden', String(i !== index));
      });
      selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(screens.length).padStart(2, '0')}`;
      caption.textContent = screens[index].dataset.caption;
      source.href = screens[index].querySelector('img').getAttribute('src');
      source.setAttribute('aria-label', `View full capture: ${selectors[index].dataset.title}`);
      if (manual) {
        paused = true;
        manuallyPaused = true;
        announcement.textContent = `${selectors[index].dataset.title}. ${caption.textContent}`;
        updateControl();
      }
    }
    selectors.forEach((button, i) => button.addEventListener('click', () => select(i, true)));
    play.addEventListener('click', () => {
      paused = !paused;
      manuallyPaused = paused;
      if (!paused) select((index + 1) % screens.length);
      updateControl();
    });
    // Keyboard users can inspect controls without the current screen changing.
    root.addEventListener('focusin', (event) => {
      if (event.target !== play && !paused) {
        paused = true;
        manuallyPaused = true;
        updateControl();
      }
    });
    document.addEventListener('visibilitychange', schedule);
    preference.addEventListener('change', updateControl);
    document.addEventListener('portfolio:reduce-motion', (event) => {
      labReduced = Boolean(event.detail);
      if (!labReduced && !manuallyPaused) paused = root.dataset.autoplay !== 'true';
      updateControl();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        const next = entry.isIntersecting && entry.intersectionRatio >= .2;
        if (next !== visible) { visible = next; schedule(); }
      }, { threshold: [0, .2] }).observe(root.querySelector('.vp-stage'));
    } else { visible = true; }
    root.querySelector('.vp-controls').hidden = false;
    select(0);
    updateControl();
  });
})();
