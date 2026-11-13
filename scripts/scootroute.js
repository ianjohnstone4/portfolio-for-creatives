(() => {
  "use strict";

  const images = {
    journey: { file: "mapped-journey.webp", title: "Canada Place to Sunset Beach", alt: "Guided journey demo with a street-following ride and separate pedestrian paths to pickup and from the return point.", caption: "The portfolio demo replays a saved Vancouver trip. Vehicle availability, parking and movement are simulated." },
    stages: { file: "original-return-plan.webp", title: "The complete journey plan", alt: "Original ScootRoute screen showing pickup walking, the Lime ride, a named return station and the final walk to Sunset Beach.", caption: "Detail from the October 30 prototype. The original journey plan shows sample pickup, return capacity and the final walk." },
    lime: { file: "lime-published-parking-map.png", title: "Lime’s published parking screens", alt: "Two unmodified Lime-published screens: a parking-pin information card and a parking refusal message with an OK action.", caption: "Published on Lime’s Stuttgart page. Not a Vancouver capture. App version and capture date unknown. This enlarged view shows the original image without the case-study annotation overlays. © Lime." },
    compare: { file: "original-comparison.webp", title: "Compare the complete trip", alt: "Original ScootRoute comparison screen showing total minutes, riding and walking distances for three simulated journey options.", caption: "Detail from the October 30 prototype. These comparison values are the original sample estimates." },
    return: { file: "original-return-confirmation.webp", title: "The rental-completion handoff", alt: "ScootRoute arrival state with an acknowledgement button for parking and ending the rental before continuing on foot.", caption: "Existing component with simulated GPS. The acknowledgement does not verify Lime’s rental or billing state. The handoff wording needs closer alignment with Vancouver’s docking confirmation." },
    riding: { file: "mapped-playback.webp", title: "Foreground navigation state", alt: "ScootRoute demo showing the mapped ride and the sample return handoff.", caption: "The portfolio demo moves the marker along the saved cycling path and pauses at the return point." },
    gps: { file: "07-gps-simulated.jpg", title: "Recovering from GPS uncertainty", alt: "ScootRoute GPS waiting state with an option to retry location access.", caption: "Existing component shown with simulated GPS. This is an interface state, not a participant finding." }
  };
  const dialog = document.querySelector(".sr-viewer");
  const image = document.getElementById("viewer-image");
  const closeButton = document.getElementById("viewer-close");
  const sizeButton = document.getElementById("viewer-size");
  let opener = null;

  function resetSize() {
    dialog.classList.remove("is-actual");
    sizeButton.setAttribute("aria-pressed", "false");
    sizeButton.textContent = "Actual size";
    image.style.removeProperty("width");
  }

  document.querySelectorAll("[data-image]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = images[button.dataset.image];
      if (!entry) return;
      opener = button;
      resetSize();
      document.getElementById("viewer-title").textContent = entry.title;
      document.getElementById("viewer-caption").textContent = entry.caption;
      image.alt = entry.alt;
      image.src = `assets/scootroute/${entry.file}`;
      image.removeAttribute("width");
      image.removeAttribute("height");
      document.getElementById("viewer-original").href = image.src;
      dialog.showModal();
      document.body.classList.add("sr-modal-open");
      dialog.scrollTop = 0;
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button:not([disabled]), a[href]")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("sr-modal-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  sizeButton.addEventListener("click", () => {
    const actual = dialog.classList.toggle("is-actual");
    sizeButton.setAttribute("aria-pressed", String(actual));
    sizeButton.textContent = actual ? "Fit to window" : "Actual size";
    if (actual) image.style.width = `${image.naturalWidth}px`;
    else image.style.removeProperty("width");
  });
})();
