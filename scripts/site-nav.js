/* One shared, progressively enhanced header for the portfolio. */
(() => {
  if (document.querySelector('.site-nav-header')) return;
  const original = document.querySelector('header.hero-header, header.sr-header, header.gi-header, header.cs-header, header.cr-header');
  const script = document.currentScript;
  if (!original || !script) return;

  const base = new URL('../', script.src);
  const workUrl = new URL('index.html', base);
  const aboutUrl = new URL('about.html', base);
  const footer = document.querySelector('footer.site-footer, footer.sr-footer, footer.gi-footer, footer.cs-footer, footer.cr-footer');
  if (footer && !footer.id) footer.id = 'contact';
  const page = location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  const workCurrent = page === 'index.html' || location.pathname === base.pathname;
  const aboutCurrent = page === 'about.html' || page === 'about';
  const header = document.createElement('header');
  header.className = 'site-nav-header';

  const nav = document.createElement('nav');
  nav.className = 'site-nav-bar';
  nav.setAttribute('aria-label', 'Main navigation');
  const brand = document.createElement('a');
  brand.className = 'site-nav-brand';
  brand.href = workUrl.href;
  brand.setAttribute('aria-label', 'Ian Johnstone, home');
  const logo = document.createElement('img');
  logo.src = new URL('assets/branding-images/ij-nav.svg', base).href;
  logo.alt = '';
  logo.width = 34;
  logo.height = 44;
  brand.append(logo);
  nav.append(brand);

  const links = document.createElement('ul');
  links.className = 'site-nav-links';
  [
    ['Work', workUrl.href, workCurrent],
    ['About', aboutUrl.href, aboutCurrent],
    ['Contact', footer ? `#${footer.id}` : `${aboutUrl.href}#contact`, false]
  ].forEach(([label, href, current]) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (current) link.setAttribute('aria-current', 'page');
    item.append(link);
    links.append(item);
  });
  nav.append(links);
  header.append(nav);

  // Keep the existing header's space so the page layout does not jump.
  original.classList.add('site-nav-placeholder');
  original.inert = true;
  original.setAttribute('aria-hidden', 'true');
  document.body.prepend(header);
  document.body.classList.add('site-nav-enabled');
  document.documentElement.classList.add('site-nav-active');

  const main = document.querySelector('main');
  if (main) {
    if (!main.id) main.id = document.getElementById('main-content') ? 'site-main' : 'main-content';
    let skip = Array.from(document.querySelectorAll('a[href]')).find(link =>
      link.getAttribute('href') === `#${main.id}` && /skip/i.test(link.textContent)
    );
    if (!skip) {
      skip = document.createElement('a');
      skip.href = `#${main.id}`;
      skip.textContent = 'Skip to content';
    }
    skip.classList.add('site-nav-skip');
    document.body.prepend(skip);
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = document.documentElement.clientWidth;
  let lastProgress = -1;
  let frame = 0;

  function render() {
    frame = 0;
    const raw = Math.min(1, Math.max(0, window.scrollY) / 240);
    const progress = reducedMotion.matches ? (raw >= .5 ? 1 : 0) : raw * raw * (3 - 2 * raw);
    if (progress === lastProgress) return;
    lastProgress = progress;
    const narrow = width <= 600;
    const compact = Math.min(464, width - 24);
    const expanded = Math.max(compact, width - (narrow ? 24 : 48));
    const mix = (start, end) => start + (end - start) * progress;
    const values = {
      '--site-nav-width': `${mix(expanded, compact).toFixed(2)}px`,
      '--site-nav-height': `${mix(narrow ? 76 : 88, 64).toFixed(2)}px`,
      '--site-nav-top': `${mix(8, 14).toFixed(2)}px`,
      '--site-nav-padding': `${mix(narrow ? 14 : 22, narrow ? 12 : 22).toFixed(2)}px`,
      '--site-nav-logo': `${mix(42, 34).toFixed(2)}px`,
      '--site-nav-alpha': (.64 * progress).toFixed(3),
      '--site-nav-blur': `${(22 * progress).toFixed(2)}px`,
      '--site-nav-border': (.10 * progress).toFixed(3),
      '--site-nav-highlight': (.76 * progress).toFixed(3),
      '--site-nav-shadow': (.09 * progress).toFixed(3),
      '--site-nav-radius': `${mix(10, 22).toFixed(2)}px`
    };
    Object.entries(values).forEach(([name, value]) => header.style.setProperty(name, value));
  }

  function requestRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function resize() {
    width = document.documentElement.clientWidth;
    lastProgress = -1;
    requestRender();
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pageshow', resize);
  window.addEventListener('pagehide', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  });
  reducedMotion.addEventListener('change', () => { lastProgress = -1; requestRender(); });
  render();
})();
