(() => {
  'use strict';
  const comparison = document.querySelector('.gi-comparison');
  const range = document.querySelector('#comparison-range');
  const compareButtons = [...document.querySelectorAll('[data-compare]')];
  if (comparison && range) {
    comparison.classList.add('is-enhanced');
    document.querySelector('.gi-compare-buttons').hidden = false;
    document.querySelector('.gi-range-control').hidden = false;
    const updateComparison = value => {
      const percent = Math.max(0, Math.min(100, Number(value)));
      range.value = String(percent);
      range.setAttribute('aria-valuetext', `${percent} percent final layout revealed`);
      document.querySelector('.gi-comparison-final').style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      comparison.style.setProperty('--reveal', `${percent}%`);
      comparison.classList.toggle('is-split', percent > 0 && percent < 100);
      document.querySelector('#comparison-value').textContent = `${percent}%`;
      document.querySelector('#comparison-explanation').textContent = percent === 0 ? 'Earlier direction shown in full.' : percent === 100 ? 'Final group layout shown in full.' : 'Final layout on the left. Earlier direction on the right.';
      compareButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.compare) === percent)));
    };
    range.addEventListener('input', () => updateComparison(range.value));
    compareButtons.forEach(button => button.addEventListener('click', () => updateComparison(button.dataset.compare)));
    updateComparison(range.value);
  }

  const artwork = {
    opening: { src:'assets/homepage-opening.png', width:1440, height:744, title:'Final homepage / opening', alt:'Final desktop homepage header and waterfront hero', caption:'Shared group design by Sara, Avery and Ian. An excerpt from homepage frame 377:43. The full concept is linked in Figma.' },
    earlier: { src:'assets/homepage-earlier.png', width:1440, height:770, title:'Earlier homepage direction', alt:'Earlier homepage with four colourful shortcut cards above weekly events', caption:'From Ian’s earlier mockup working file, Home frame 1:2. This frame is not confirmed as the exact tested version.' },
    final: { src:'assets/homepage-final.png', width:1440, height:770, title:'Final homepage / content hierarchy', alt:'Final group layout with weekly events above the shortcut cards', caption:'Shared final homepage, frame 377:43. The new order is a design response, with no verified post-revision usability result.' },
    ia: { src:'assets/information-hierarchy.png', width:1413, height:1488, title:'My independent IA proposal', alt:'Original Visit, Explore and Public Market information hierarchy branches', caption:'Excerpt from GI - Informtion Hiearchy.pdf, page 9. The structure was inferred from the supplied historical content inventory. Original artwork and typography are preserved.' },
    vendor: { src:'assets/vendor-profile.png', width:1410, height:1158, title:'Final vendor profile / excerpt', alt:'Shared Blue Parrot Coffee vendor profile with hours, location, View Menu action and a photograph of its sign', caption:'Shared final vendor design, frame 377:566. Prototype content is illustrative. The menu destination remains incomplete in the sampled prototype.' },
    menu: { src:'assets/vendor-menu-detail.png', width:720, height:290, title:'The menu action / detail', alt:'View Menu action beneath daily hours and the Granville Island Public Market location', caption:'An unchanged detail crop of the final vendor frame, 377:566. Participants requested menu access; the action is visible, while its destination still needs to be completed.' },
    recommendation: { src:'assets/recommendation-details.png', width:633, height:140, title:'Recommendation page / practical details', alt:'Vendor hours and location on the recommendation page', caption:'An unchanged detail crop of Quick Bites frame 377:730. Hours and location are available before opening the vendor profile. Details are sample prototype content.' }
  };
  const viewer = document.querySelector('.gi-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const close = document.querySelector('#viewer-close');
  const zoom = document.querySelector('#viewer-zoom');
  let lastTrigger = null;
  const setZoom = active => {
    viewer.classList.toggle('is-actual-size', active);
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Fit to view' : 'Actual size';
  };
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const item = artwork[button.dataset.view];
    if (!item) return;
    if (typeof viewer.showModal !== 'function') { window.open(item.src, '_blank', 'noopener'); return; }
    lastTrigger = button;
    document.querySelector('#viewer-title').textContent = item.title;
    document.querySelector('#viewer-caption').textContent = item.caption;
    viewerImage.src = item.src;
    viewerImage.alt = item.alt;
    viewerImage.width = item.width;
    viewerImage.height = item.height;
    viewer.style.setProperty('--artwork-width', `${item.width}px`);
    setZoom(false);
    viewer.showModal();
    viewer.scrollTop = 0;
    document.querySelector('.gi-viewer-content').scrollTop = 0;
    document.querySelector('.gi-viewer-content').scrollLeft = 0;
    document.body.classList.add('gi-modal-open');
    close.focus();
  }));
  close.addEventListener('click', () => viewer.close());
  zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('gi-modal-open');
    lastTrigger?.focus({preventScroll:true});
  });
})();
