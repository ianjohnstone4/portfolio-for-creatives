(() => {
  const root = document.querySelector('[data-lynn-reveal]');
  if (!root) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 801px)');
  const track = root.querySelector('.lynn-motion-track');
  const stage = root.querySelector('.lynn-motion-stage');
  const sticky = root.querySelector('.lynn-motion-sticky');
  const replay = root.querySelector('[data-lynn-replay]');
  let animation = 0;
  let frame = 0;
  let manual = false;
  let entered = false;
  const set = (value) => root.style.setProperty('--lv-progress', String(Math.max(0,Math.min(1,value))));
  function stop() {
    cancelAnimationFrame(animation);
    animation = 0;
    replay.textContent = 'Replay reveal';
    replay.setAttribute('aria-pressed','false');
  }
  function update() {
    frame = 0;
    if (preference.matches || !desktop.matches || manual) return;
    set((96-track.getBoundingClientRect().top)/Math.max(1,track.offsetHeight-sticky.offsetHeight));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function play(duration = 2600) {
    if (preference.matches) return;
    stop();
    manual = true;
    const start = performance.now();
    set(0);
    replay.textContent = 'Pause reveal';
    replay.setAttribute('aria-pressed','true');
    function animate(now) {
      const t = Math.max(0,Math.min(1,(now-start)/duration));
      set(t*t*(3-2*t));
      if (t<1) animation = requestAnimationFrame(animate);
      else stop();
    }
    animation = requestAnimationFrame(animate);
  }
  function sync() {
    stop();
    manual = false;
    root.classList.toggle('is-motion-ready',!preference.matches);
    replay.hidden = preference.matches;
    if (preference.matches || !desktop.matches) set(1);
    else schedule();
  }
  function resume() { if (desktop.matches) { manual = false; stop(); } }
  replay.addEventListener('click',() => {
    if (animation) { stop(); return; }
    const bounds = stage.getBoundingClientRect();
    if (desktop.matches && (bounds.top < 60 || bounds.bottom > innerHeight-50)) track.scrollIntoView({block:'start',behavior:'smooth'});
    play();
  });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('wheel',resume,{passive:true});
  window.addEventListener('touchmove',resume,{passive:true});
  window.addEventListener('keydown',(event) => {
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement) return;
    if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)) resume();
  });
  preference.addEventListener('change',sync);
  desktop.addEventListener('change',sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !entered) {
        entered = true;
        if (!desktop.matches && !preference.matches) play(1500);
      }
    },{threshold:.25}).observe(stage);
  }
  document.addEventListener('visibilitychange',() => { if (document.hidden) stop(); });
  sync();
})();
