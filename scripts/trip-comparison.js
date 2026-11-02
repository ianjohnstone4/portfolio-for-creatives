(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const options = {
    scooter: { total: 14, walk: 250, ride: '2.6', label: 'Lime Scooter' },
    bike: { total: 15, walk: 380, ride: '2.5', label: 'Mobi E-bike' }
  };
  document.querySelectorAll('[data-trip-comparison]').forEach((root) => {
    const buttons = [...root.querySelectorAll('[data-trip-option]')];
    const numbers = [...root.querySelectorAll('[data-trip-number]')];
    const timers = new Map();
    let labReduced = false;
    let selected = 'scooter';
    const reduced = () => preference.matches || labReduced;
    function renderNumber(numberRoot, number, animate) {
      window.clearTimeout(timers.get(numberRoot));
      const next = String(number);
      const value = numberRoot.querySelector('[data-trip-value]');
      const visual = numberRoot.querySelector('[data-trip-digits]');
      const before = (numberRoot.dataset.value || value.textContent).padStart(next.length, ' ');
      visual.replaceChildren();
      [...next].forEach((character, i) => {
        const digit = document.createElement('span');
        digit.className = 'trip-digit';
        const changing = animate && !reduced() && before[i] !== character;
        if (changing) {
          const outgoing = document.createElement('span');
          outgoing.className = 'trip-digit-out';
          outgoing.textContent = before[i];
          digit.appendChild(outgoing);
        }
        const incoming = document.createElement('span');
        incoming.textContent = character;
        if (changing) incoming.className = 'trip-digit-in';
        digit.appendChild(incoming);
        visual.appendChild(digit);
      });
      value.textContent = next;
      numberRoot.dataset.value = next;
      if (animate && !reduced()) timers.set(numberRoot, window.setTimeout(() => renderNumber(numberRoot, number, false), 550));
    }
    function select(key, animate) {
      const item = options[key];
      selected = key;
      root.dataset.selectedTrip = key;
      buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.tripOption === key)));
      numbers.forEach((number) => renderNumber(number, item[number.dataset.tripNumber], animate));
      root.querySelector('[data-trip-summary]').textContent = `${item.ride} km ride · ${item.walk} m walk`;
      if (animate) root.querySelector('[data-trip-announcement]').textContent = `${item.label}: ${item.total} minutes estimated total, ${item.walk} metres walking. Simulated journey.`;
    }
    buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.tripOption, true)));
    preference.addEventListener('change', () => select(selected, false));
    document.addEventListener('portfolio:reduce-motion', (event) => {
      labReduced = Boolean(event.detail);
      select(selected, false);
    });
    select('scooter', false);
  });
})();
