(() => {
  'use strict';

  const tabs = [...document.querySelectorAll('[data-insight]')];
  const panels = [...document.querySelectorAll('.cr-insight-panel')];
  if (tabs.length && panels.length) {
    document.querySelector('.cr-insight-tabs').hidden = false;
    const activate = key => {
      tabs.forEach(tab => {
        const active = tab.dataset.insight === key;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.id !== `panel-${key}`; });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.insight));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        activate(tabs[next].dataset.insight);
        tabs[next].focus();
      });
    });
    activate('intent');
  }

  const artwork = {
    'home-content-study': {file:'home-content-study.jpg',width:2880,height:2048,title:'Home / Content hierarchy visual study',alt:'New Home mockup with featured actions, Continue Watching and By Genre',caption:'November 2026 visual study based on the original Home wireframe. Programme content and viewing progress are illustrative. The Play, Info, Save and Not For Me controls are shown as visual concepts, not connected product flows.'},
    'home-profile-study': {file:'home-profile-study.jpg',width:2880,height:2048,title:'Home / Profile context and feedback visual study',alt:'New Home mockup with signed-in context, a personal-profile reminder and visible Not For Me feedback',caption:'November 2026 visual study in the documentary refinement’s visual system. Alex is an illustrative profile. Profile creation and recommendation feedback have not been implemented or tested.'},
    'home-refinement': {file:'home-refinement.png',width:1440,height:1024,title:'Home / October 2026 refinement',alt:'Crave Home concept with a featured documentary, Continue Watching and By Genre',caption:'Unchanged export from the separate 2026 Figma refinement. Programme content and viewing progress are illustrative; this is not a current Crave catalogue.'},
    'home-wireframe': {file:'home-wireframe.png',width:1170,height:832,title:'Home / Original 2025 wireframe',alt:'Original Home wireframe showing direct access, Continue Watching, By Genre and profile-related cues',caption:'Original individual coursework, Phase 3 p. 26. This is a concept wireframe, not a screenshot of the live service. Profile, feedback and playback behaviour were not fully developed or tested.'},
    'documentaries-wireframe': {file:'documentaries-wireframe.png',width:1170,height:832,title:'Documentaries / Original 2025 wireframe',alt:'Original documentary wireframe with subject choices and proposed sorting and refinement controls',caption:'Original individual coursework, Phase 3 p. 27. Historical, Current Events and True Crime connect to interview requests. Additional subjects and refinement controls remain design proposals.'},
    historical: {file:'historical.png',width:1440,height:1024,title:'Historical / Any length',alt:'Historical selected in the later prototype, with any length and six illustrative documentary titles',caption:'Unchanged October 2026 prototype export. Six illustrative titles, with Historical selected. No actual catalogue availability or measured discovery benefit is implied.'},
    'historical-short': {file:'historical-under-60.png',width:1440,height:1024,title:'Historical / Under 60 min',alt:'Historical remains selected, with Under 60 min applied, a Clear filter action and three illustrative titles',caption:'Unchanged October 2026 prototype export. The length hypothesis narrows six illustrative titles to three while retaining Historical. This demonstrates the documented state model, not a usability result.'}
  };

  const lengthButtons = [...document.querySelectorAll('[data-length]')];
  const clear = document.querySelector('#clear-length');
  const image = document.querySelector('#state-image');
  if (lengthButtons.length && clear && image) {
    document.querySelector('.cr-state-controls').hidden = false;
    const showLength = key => {
      const short = key === 'short';
      const view = short ? 'historical-short' : 'historical';
      const item = artwork[view];
      const src = `assets/crave/screens/${item.file}`;
      image.src = src;
      image.alt = item.alt;
      for (const id of ['state-art','state-enlarge']) {
        const link = document.getElementById(id);
        link.href = src;
        link.dataset.view = view;
      }
      document.querySelector('#state-art').setAttribute('aria-label', `Enlarge the Historical documentary state, ${short ? 'under 60 minutes' : 'any length'}`);
      document.querySelector('#state-description').textContent = `Historical selected · ${short ? 'Under 60 min · 3' : 'Any length · 6'} illustrative titles`;
      lengthButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.length === key)));
      clear.hidden = !short;
    };
    lengthButtons.forEach(button => button.addEventListener('click', () => showLength(button.dataset.length)));
    clear.addEventListener('click', () => {
      showLength('any');
      lengthButtons[0].focus({preventScroll:true});
    });
  }

  const viewer = document.querySelector('.cr-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const close = document.querySelector('#viewer-close');
  const zoom = document.querySelector('#viewer-zoom');
  let opener;
  const setZoom = active => {
    viewer.classList.toggle('is-actual-size', active);
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Fit to view' : 'Actual size';
  };
  document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => {
    const item = artwork[link.dataset.view];
    if (!item || typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    opener = link;
    viewerImage.src = `assets/crave/screens/${item.file}`;
    viewerImage.alt = item.alt;
    viewerImage.width = item.width;
    viewerImage.height = item.height;
    document.querySelector('#viewer-title').textContent = item.title;
    document.querySelector('#viewer-caption').textContent = item.caption;
    viewer.style.setProperty('--artwork-width', `${item.width}px`);
    setZoom(false);
    viewer.showModal();
    document.body.classList.add('cr-modal-open');
    const scrollArea = document.querySelector('.cr-viewer-body');
    scrollArea.scrollTop = 0;
    scrollArea.scrollLeft = 0;
    close.focus();
  }));
  close.addEventListener('click', () => viewer.close());
  zoom.addEventListener('click', () => setZoom(!viewer.classList.contains('is-actual-size')));
  viewer.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const stops = [...viewer.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.hidden && element.getClientRects().length);
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const r = viewer.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('cr-modal-open');
    opener?.focus({preventScroll:true});
  });
})();
