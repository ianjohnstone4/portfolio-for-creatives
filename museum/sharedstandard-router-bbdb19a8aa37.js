(() => {
  const release = 'ss-apartment-20261113';
  const museumPath = '/museum/';
  const roomPath = '/museum/sharedstandard/';
  const dedicated = location.pathname.replace(/\/$/, '') === roomPath.replace(/\/$/, '');
  const projects = new Set(['crave', 'lynn-valley', 'cospace', 'granville-island', 'scootroute', 'velvet-pour']);
  let entered = false;
  let redirecting = false;

  function navigate(url) {
    if (redirecting) return;
    redirecting = true;
    location.replace(url.href);
  }

  if (dedicated && new URLSearchParams(location.search).get('exhibit') !== 'sharedstandard') {
    const room = new URL(roomPath, location.origin);
    room.searchParams.set('exhibit', 'sharedstandard');
    room.searchParams.set('v', release);
    navigate(room);
    return;
  }

  function inspectRoom() {
    const shared = document.body.classList.contains('sharedstandard-scene');
    if (!dedicated) {
      if (shared) {
        const room = new URL(roomPath, location.origin);
        room.searchParams.set('exhibit', 'sharedstandard');
        room.searchParams.set('v', release);
        navigate(room);
      }
      return;
    }
    if (shared) {
      entered = true;
      const skip = document.querySelector('.skip-link');
      if (skip) skip.href = location.pathname + location.search + '#direct-access';
      return;
    }
    if (!entered) return;
    const museum = new URL(museumPath, location.origin);
    const next = location.hash.slice(1);
    museum.searchParams.set('v', release);
    if (projects.has(next)) museum.searchParams.set('exhibit', next);
    museum.hash = projects.has(next) ? next : 'map';
    navigate(museum);
  }

  function connect() {
    const observer = new MutationObserver(inspectRoom);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    inspectRoom();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connect, { once: true });
  else connect();
})();
