function setUpMuseumEntrance() {
  const home = document.getElementById('portfolio-home');
  const experience = document.getElementById('museum-experience');
  const frame = document.getElementById('museum-frame');
  const entry = document.getElementById('enter-museum');
  const nav = document.querySelector('.site-nav-bar');

  if (!nav) {
    entry.addEventListener('click', () => location.assign(frame.dataset.src));
    return;
  }

  const brand = nav.querySelector('.site-nav-brand');
  const links = [...nav.querySelectorAll('.site-nav-links a')];
  const work = links.find(link => link.textContent === 'Work');
  const contact = links.find(link => link.textContent === 'Contact');
  const museumItem = document.createElement('li');
  const museumLink = document.createElement('a');
  museumLink.href = '#museum';
  museumLink.textContent = 'Museum';
  museumItem.append(museumLink);
  work.closest('li').after(museumItem);

  const exit = document.createElement('button');
  exit.type = 'button';
  exit.id = 'exit-museum';
  exit.className = 'museum-exit-button';
  exit.textContent = '← Exit museum';
  exit.hidden = true;
  nav.append(exit);

  let returnFocus = entry;
  let returnHash = '';
  let returnScroll = 0;

  function focusMuseum() {
    if (!experience.hidden) frame.contentDocument?.getElementById('museum-canvas')?.focus();
  }

  function enterMuseum(addHistory = true, trigger = returnFocus) {
    if (!experience.hidden) return;
    const saved = !addHistory && history.state?.museum ? history.state : null;
    returnHash = saved?.returnHash ?? (location.hash === '#museum' ? '' : location.hash);
    returnScroll = saved?.returnScroll ?? window.scrollY;
    returnFocus = trigger;

    home.hidden = home.inert = true;
    experience.hidden = exit.hidden = false;
    museumItem.hidden = true;
    work.removeAttribute('aria-current');
    document.body.classList.add('museum-preview-active');
    if (addHistory) history.pushState({ museum: true, returnHash, returnScroll }, '', '#museum');
    if (frame.hasAttribute('src')) focusMuseum();
    else frame.src = frame.dataset.src;
  }

  function leaveMuseum(addHistory = true, hash = returnHash) {
    if (experience.hidden) return;
    home.hidden = home.inert = false;
    experience.hidden = exit.hidden = true;
    museumItem.hidden = false;
    work.setAttribute('aria-current', 'page');
    document.body.classList.remove('museum-preview-active');
    if (addHistory) history.pushState({ museum: false }, '', location.pathname + location.search + hash);
    returnFocus.focus({ preventScroll: true });
    window.scrollTo({ top: returnScroll, behavior: 'instant' });
  }

  frame.addEventListener('load', focusMuseum);
  entry.addEventListener('click', () => enterMuseum(true, entry));
  museumLink.addEventListener('click', event => {
    event.preventDefault();
    enterMuseum(true, museumLink);
  });
  exit.addEventListener('click', () => leaveMuseum());
  for (const link of [brand, work]) {
    link.addEventListener('click', event => {
      if (experience.hidden) return;
      event.preventDefault();
      leaveMuseum();
    });
  }
  contact.addEventListener('click', event => {
    if (experience.hidden) return;
    event.preventDefault();
    leaveMuseum(true, '#contact');
    document.getElementById('contact').scrollIntoView();
  });
  window.addEventListener('hashchange', () => {
    if (location.hash === '#museum') enterMuseum(false);
    else leaveMuseum(false);
  });
  if (location.hash === '#museum') enterMuseum(false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setUpMuseumEntrance, { once: true });
} else {
  setUpMuseumEntrance();
}
