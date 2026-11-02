(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-evidence-reveal]').forEach((row) => {
    const artwork = row.querySelector('.cr-artwork');
    const replay = row.querySelector('[data-replay-reveal]');
    const notes = row.querySelector('.cr-wireframe-notes');
    let played = false;
    let timer = 0;
    function reveal(restart = false) {
      window.clearTimeout(timer);
      played = true;
      if (preference.matches) {
        row.classList.add('is-revealed');
        return;
      }
      if (restart) row.classList.remove('is-revealed');
      timer = window.setTimeout(() => row.classList.add('is-revealed'), restart ? 80 : 260);
    }
    function sync() {
      replay.hidden = preference.matches;
      row.classList.toggle('cr-reveal-ready', !preference.matches);
      if (preference.matches) {
        window.clearTimeout(timer);
        row.classList.add('is-revealed');
      } else if (played) row.classList.add('is-revealed');
    }
    replay.addEventListener('click', () => reveal(true));
    artwork.addEventListener('focus', () => reveal());
    preference.addEventListener('change', sync);
    sync();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= .25) {
          reveal();
          observer.disconnect();
        }
      }, { threshold: [0,.25] });
      observer.observe(notes);
    } else reveal();
  });
})();
