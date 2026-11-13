(() => {
  "use strict";

  const images = {
    journey: { file: "planner-journey.jpg", title: "Canada Place to Sunset Beach", alt: "The mapped route has three legs and an estimate of 13 minutes. The app uses simulated inventory and movement.", caption: "ScootRoute portfolio demo. The trip includes the walk to pickup, the scooter ride, the return and the final walk." },
    pickup: { file: "planner-pickup-detail.jpg", title: "The walk to pickup", alt: "ScootRoute’s first leg shows a one-minute, 120-metre walk to Canada Place parking bay and three simulated scooters.", caption: "Detail from the current journey plan. The pickup walk is visible before starting the ride. Availability is simulated." },
    stages: { file: "planner-timeline.jpg", title: "The return bay and final walk", alt: "ScootRoute’s journey timeline shows the Lime ride, Sunset Beach parking bay and a two-minute final walk to the beach.", caption: "The return bay shows six sample spaces. The last leg follows a mapped pedestrian path for 140 metres." },
    lime: { file: "lime-published-parking-map.png", title: "Lime’s published parking screens", alt: "Two unmodified Lime-published screens: a parking-pin information card and a parking refusal message with an OK action.", caption: "Published on Lime’s Stuttgart page. Not a Vancouver capture. App version and capture date unknown. This enlarged view shows the original image without the case-study annotation overlays. © Lime." },
    compare: { file: "planner-compare.jpg", title: "Compare the complete trip", alt: "Original ScootRoute comparison screen showing total minutes, riding and walking distances for three simulated journey options.", caption: "The demo compares the full trip using mapped travel distances, estimated times and sample availability." },
    return: { file: "planner-return.jpg", title: "From the return bay to the final walk", alt: "ScootRoute’s Return step names Sunset Beach parking bay, reminds the rider to check Lime for rental completion and offers Continue on foot.", caption: "The walkthrough pauses at the return bay. “Continue on foot” starts the final walking leg. ScootRoute cannot verify the return or rental completion." },
    riding: { file: "planner-ride.jpg", title: "Foreground navigation state", alt: "ScootRoute map and current-leg instruction showing sample progress, remaining distance and location status.", caption: "Playback follows the cycling route to Sunset Beach. The arrow and distance update as the rider approaches each turn." },
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
