(() => {
  const page = document.querySelector('.sharedstandard-page');
  if (!page) return;

  const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const desktopStory = window.matchMedia('(min-width: 900px) and (min-height: 650px)');
  const story = page.querySelector('.ss-walkthrough');
  const steps = [...story.querySelectorAll('.ss-story-step')];
  const screens = [...story.querySelectorAll('.ss-stage-screen')];
  const toggle = story.querySelector('.ss-motion-toggle');
  const stageCount = story.querySelector('.ss-stage-count');
  const stageLabel = story.querySelector('.ss-stage-label');
  const timeline = page.querySelector('.ss-timeline');
  const phases = [...timeline.querySelectorAll('.process-timeline-item')];
  let showTogether = false;
  let activeIndex = -1;
  let frame = 0;

  function update() {
    frame = 0;
    if (document.hidden) return;
    const focusLine = window.innerHeight * 0.5;

    if (motionAllowed.matches) {
      const bounds = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (focusLine - bounds.top) / bounds.height));
      timeline.style.setProperty('--ss-progress', progress.toFixed(4));
      let currentPhase = 0;
      phases.forEach((phase, index) => {
        const passed = phase.getBoundingClientRect().top <= focusLine;
        phase.classList.toggle('is-past', passed);
        if (passed) currentPhase = index;
      });
      phases.forEach((phase, index) => phase.classList.toggle('is-current', index === currentPhase));
    }

    if (!story.classList.contains('is-enhanced')) return;
    let next = 0;
    steps.forEach((step, index) => {
      if (step.getBoundingClientRect().top <= focusLine) next = index;
    });
    if (next === activeIndex) return;
    activeIndex = next;
    steps.forEach((step, index) => step.classList.toggle('is-active', index === next));
    screens.forEach((screen, index) => screen.classList.toggle('is-active', index === next));
    stageCount.textContent = `${String(next + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    stageLabel.textContent = steps[next].querySelector('h3').textContent;
    story.style.setProperty('--ss-story-progress', (next + 1) / steps.length);
  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function syncMode() {
    const eligible = motionAllowed.matches && desktopStory.matches;
    const enhanced = eligible && !showTogether;
    story.classList.toggle('is-enhanced', enhanced);
    toggle.hidden = !eligible;
    toggle.setAttribute('aria-pressed', String(showTogether));
    toggle.textContent = showTogether ? 'Use scroll walkthrough' : 'Show screens together';
    // Keep a description of each screen in the semantic reading order even
    // when its visual duplicate lives in the sticky presentation area.
    steps.forEach((step) => {
      const link = step.querySelector('.ss-screen-full-link');
      const img = step.querySelector('.ss-step-figure img');
      link.setAttribute('aria-label', `View screen full size: ${img.alt}`);
    });
    if (!motionAllowed.matches) {
      timeline.style.removeProperty('--ss-progress');
      phases.forEach((phase) => phase.classList.remove('is-past', 'is-current'));
    }
    activeIndex = -1;
    scheduleUpdate();
  }

  toggle.addEventListener('click', () => {
    showTogether = !showTogether;
    syncMode();
  });
  motionAllowed.addEventListener('change', syncMode);
  desktopStory.addEventListener('change', syncMode);
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  document.addEventListener('visibilitychange', scheduleUpdate);
  syncMode();
})();
