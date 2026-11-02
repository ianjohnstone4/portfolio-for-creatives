(() => {
  'use strict';
  const artwork = {"opening": {"src": "assets/granville-island/optimized/opening-1440.webp", "width": 1440, "height": 744, "title": "Final homepage / opening", "alt": "Final homepage header and waterfront hero", "caption": "Shared group design by Sara, Avery and Ian. Excerpt from frame 377:43."}, "ia": {"src": "assets/granville-island/optimized/ia-1413.webp", "width": 1413, "height": 1488, "title": "My independent IA proposal", "alt": "Original Visit, Explore and Public Market hierarchy branches", "caption": "Excerpt from the independent IA proposal, page 9. Inferred from a supplied historical content inventory. The later team navigation developed differently."}, "home": {"src": "assets/granville-island/optimized/home-full-1440.webp", "width": 1440, "height": 4082, "title": "Final group design / Homepage", "alt": "Homepage complete original desktop screen", "caption": "Original shared final screen, frame 377:43. Illustrative event and vendor content, including sample ratings and reviews. Secondary controls are not all complete prototype interactions."}, "events": {"src": "assets/granville-island/optimized/events-full-1440.webp", "width": 1440, "height": 4976, "title": "Final group design / Events", "alt": "Events complete original desktop screen", "caption": "Original shared final screen, frame 377:243. Illustrative event and vendor content, including sample ratings and reviews. Secondary controls are not all complete prototype interactions."}, "categories": {"src": "assets/granville-island/optimized/categories-full-1500.webp", "width": 1500, "height": 3083, "title": "Final group design / Categories", "alt": "Categories complete original desktop screen", "caption": "Original shared final screen, frame 377:931. Illustrative event and vendor content, including sample ratings and reviews. Secondary controls are not all complete prototype interactions."}, "quick-bites": {"src": "assets/granville-island/optimized/quick-bites-full-1500.webp", "width": 1500, "height": 4723, "title": "Final group design / Quick Bites", "alt": "Quick Bites complete original desktop screen", "caption": "Original shared final screen, frame 377:730. Illustrative event and vendor content, including sample ratings and reviews. Secondary controls are not all complete prototype interactions."}, "vendor": {"src": "assets/granville-island/optimized/vendor-full-1500.webp", "width": 1500, "height": 4243, "title": "Final group design / Vendor profile", "alt": "Vendor profile complete original desktop screen", "caption": "Original shared final screen, frame 377:566. Illustrative event and vendor content, including sample ratings and reviews. Secondary controls are not all complete prototype interactions."}, "planner": {"src": "assets/granville-island/optimized/planner-full-1440.webp", "width": 1440, "height": 2604, "title": "Early desktop planning wireframe", "alt": "Complete early Plan Your Visit desktop wireframe", "caption": "Working-file frame 12:2154. This shows a planning direction with placeholder content, not a completed itinerary generator."}, "mobile": {"src": "assets/granville-island/optimized/mobile-planner-full-393.webp", "width": 393, "height": 1361, "title": "Early mobile planning wireframe", "alt": "Complete early Plan Your Visit mobile wireframe", "caption": "Working-file frame 12:2916. This is an early exploration, rather than a final matched mobile design."}, "map": {"src": "assets/granville-island/optimized/map-full-1440.webp", "width": 1440, "height": 2109, "title": "Early map wireframe", "alt": "Map exploration with search, filters, results list and placeholder map", "caption": "Working-file frame 9:1054. Search, filter and map structure are exploratory. Routing and complete interactive states are not demonstrated."}, "journey": {"src": "assets/granville-island/optimized/journey-1500.webp", "width": 1500, "height": 2123, "title": "Early strategy / journey map", "alt": "Original Jessica journey-map planning tool with Discover, Plan, Prepare, Visit and Post-visit stages", "caption": "Original Phase 1 presentation, physical page 9. This is a planning and synthesis tool based on supplied course material, rather than a record of an additional interview or observed visit."}, "recommendation": {"src": "assets/granville-island/optimized/recommendation-detail-633.webp", "width": 633, "height": 140, "title": "Recommendation page / practical details", "alt": "Hours and location on the recommendation page", "caption": "Unchanged detail crop of final Quick Bites frame 377:730. Details and ratings are sample prototype content."}, "system": {"src": "assets/granville-island/optimized/visual-system-1700.webp", "width": 1700, "height": 820, "title": "Shared visual language / presentation sample", "alt": "Original event icons, button variants and transportation icons", "caption": "Excerpt from the final presentation, page 41. Original artwork and typography are preserved."}};
  const routes = {"home": {"label": "Home / Discover possibilities", "title": "A broad starting point.", "reason": "The homepage combines current experiences with direct routes into planning, events, the map and the directory. It supports visitors arriving with different levels of familiarity.", "action": "Market & Events opens the events page.", "source": "https://www.figma.com/design/tR0tCZCPHqtiwMTBlKBHBI?node-id=377-43", "image": "assets/granville-island/optimized/home-route-1440.webp", "srcset": "assets/granville-island/optimized/home-route-640.webp 640w, assets/granville-island/optimized/home-route-960.webp 960w, assets/granville-island/optimized/home-route-1440.webp 1440w", "width": 1440, "height": 1100, "alt": "Homepage complete original desktop screen / top-of-page excerpt", "caption": "Final group home / Top-of-page excerpt"}, "events": {"label": "Events / Find something to do", "title": "Make current experiences browsable.", "reason": "The events page brings current activities, time and location information, and category browsing into one place. Someone can inspect an event or continue exploring by the kind of experience they want.", "action": "Browse Categories and View All lead to the category overview.", "source": "https://www.figma.com/design/tR0tCZCPHqtiwMTBlKBHBI?node-id=377-243", "image": "assets/granville-island/optimized/events-route-1440.webp", "srcset": "assets/granville-island/optimized/events-route-640.webp 640w, assets/granville-island/optimized/events-route-960.webp 960w, assets/granville-island/optimized/events-route-1440.webp 1440w", "width": 1440, "height": 936, "alt": "Events complete original desktop screen / category-browsing excerpt", "caption": "Final group events / Category-browsing excerpt"}, "categories": {"label": "Categories / Narrow the possibilities", "title": "Start with the kind of visit.", "reason": "Categories frame choices around activities and occasions, including Quick Bites, Craft & Create and Rainy Day Plans. The study notes included a positive response to the rainy-day category because it suggested another way to use the island.", "action": "Quick Bites opens the food recommendations.", "source": "https://www.figma.com/design/tR0tCZCPHqtiwMTBlKBHBI?node-id=377-931", "image": "assets/granville-island/optimized/categories-route-1500.webp", "srcset": "assets/granville-island/optimized/categories-route-640.webp 640w, assets/granville-island/optimized/categories-route-960.webp 960w, assets/granville-island/optimized/categories-route-1500.webp 1500w", "width": 1500, "height": 1146, "alt": "Categories complete original desktop screen / category-card excerpt", "caption": "Final group categories / Category-card excerpt"}, "quick-bites": {"label": "Quick Bites / Compare places", "title": "See useful details before opening a profile.", "reason": "Recommendations combine a description with hours and location. Visitors can scan options here, then choose a vendor for more detail. The displayed ratings are illustrative prototype content.", "action": "Blue Parrot Coffee’s Learn More action opens its profile.", "source": "https://www.figma.com/design/tR0tCZCPHqtiwMTBlKBHBI?node-id=377-730", "image": "assets/granville-island/optimized/quick-bites-route-1500.webp", "srcset": "assets/granville-island/optimized/quick-bites-route-640.webp 640w, assets/granville-island/optimized/quick-bites-route-960.webp 960w, assets/granville-island/optimized/quick-bites-route-1500.webp 1500w", "width": 1500, "height": 1146, "alt": "Quick Bites complete original desktop screen / top-of-page excerpt", "caption": "Final group quick bites / Top-of-page excerpt"}, "vendor": {"label": "Vendor / Investigate a place", "title": "Bring the decision details together.", "reason": "The vendor profile collects hours, location, imagery, contact information and the added menu action. This answers more specific questions about one place, while menu access and dietary detail still need further work.", "action": "The designed route reaches the profile. The menu destination remains incomplete.", "source": "https://www.figma.com/design/tR0tCZCPHqtiwMTBlKBHBI?node-id=377-566", "image": "assets/granville-island/optimized/vendor-route-1500.webp", "srcset": "assets/granville-island/optimized/vendor-route-640.webp 640w, assets/granville-island/optimized/vendor-route-960.webp 960w, assets/granville-island/optimized/vendor-route-1500.webp 1500w", "width": 1500, "height": 1146, "alt": "Vendor profile complete original desktop screen / top-of-page excerpt", "caption": "Final group vendor profile / Top-of-page excerpt"}};
  const viewer = document.querySelector('.gi-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const close = document.querySelector('#viewer-close');
  const zoom = document.querySelector('#viewer-zoom');
  const status = document.querySelector('#viewer-status');
  let lastTrigger = null;

  const setZoom = active => {
    viewer.classList.toggle('is-actual-size', active);
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Fit to view' : 'Actual size';
  };
  viewerImage.addEventListener('load', () => { status.textContent = ''; zoom.disabled = false; });
  viewerImage.addEventListener('error', () => {
    status.textContent = 'This artwork could not load. Please try again or open the original Figma file.';
    zoom.disabled = true;
  });
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const item = artwork[button.dataset.view];
    if (!item) return;
    if (typeof viewer.showModal !== 'function') { window.open(item.src, '_blank', 'noopener'); return; }
    lastTrigger = button;
    document.querySelector('#viewer-title').textContent = item.title;
    document.querySelector('#viewer-caption').textContent = item.caption;
    status.textContent = 'Loading artwork…';
    zoom.disabled = true;
    viewerImage.src = item.src;
    viewerImage.alt = item.alt;
    viewerImage.width = item.width;
    viewerImage.height = item.height;
    viewer.style.setProperty('--artwork-width', `${item.width}px`);
    setZoom(false);
    viewer.showModal();
    viewer.scrollTop = 0;
    const content = document.querySelector('.gi-viewer-content');
    content.scrollTop = 0;
    content.scrollLeft = 0;
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

  const tabs = [...document.querySelectorAll('[data-route]')];
  const controls = document.querySelector('.gi-route-controls');
  const panel = document.querySelector('#route-panel');
  const routeImage = document.querySelector('#route-enlarge img');
  if (!controls || !panel || !routeImage || !tabs.length) return;
  controls.hidden = false;
  const select = tab => {
    const key = tab.dataset.route;
    const item = routes[key];
    if (!item) return;
    tabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    document.querySelector('#route-label').textContent = item.label;
    document.querySelector('#route-title').textContent = item.title;
    document.querySelector('#route-reason').textContent = item.reason;
    document.querySelector('#route-action').textContent = item.action;
    document.querySelector('#route-source').href = item.source;
    document.querySelector('#route-caption').textContent = item.caption;
    routeImage.width = item.width;
    routeImage.height = item.height;
    routeImage.srcset = item.srcset;
    routeImage.src = item.image;
    routeImage.alt = item.alt;
    const enlarge = document.querySelector('#route-enlarge');
    enlarge.dataset.view = key;
    enlarge.setAttribute('aria-label', 'Enlarge the complete final ' + key.replace('-', ' ') + ' screen');
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
      else if (event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length-1;
      else return;
      event.preventDefault();
      select(tabs[next]);
      tabs[next].focus();
    });
  });
})();
