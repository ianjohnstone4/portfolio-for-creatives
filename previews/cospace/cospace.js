(() => {
  "use strict";

  const screens = {
    home: { title: "A place to start", file: "home.png", alt: "CoSpace home with recent sessions, a focus timer, nearby meetups, and virtual workspaces.", caption: "Original Figma homepage. Session names, people, and counts are prototype content." },
    nearby: { title: "Find a session nearby", file: "nearby.png", alt: "CoSpace map of North Vancouver with location filters, available sessions, and a Host Session action.", caption: "Original in-person discovery screen. The map is source artwork, rather than a live location service." },
    virtual: { title: "Work alongside others online", file: "virtual.png", alt: "Virtual Casual Room with a shared focus timer, Ethan Cole, participant cards, and call controls.", caption: "Original virtual room screen. Video, audio, chat, and sharing are represented in the Figma concept." },
    location: { title: "Choose a location", file: "location.png", alt: "Choose a location using a map pin, address field, and Select and Continue button.", caption: "Original hosting screen with a selected location and address confirmation." },
    schedule: { title: "Build a schedule", file: "schedule-filled.png", alt: "Original session schedule from 8AM to 4PM with check-in, focus sessions, coffee and lunch breaks, reflection, and a Continue button.", caption: "Original full-day schedule. The complete source artwork is shown without cropping." },
    review: { title: "Review the details", file: "review.png", alt: "Editable session summary showing location, date and time, session type, group size, safety choices, description, and Publish Session.", caption: "Original review-before-publish interface. Verification choices are proposed controls, rather than an implemented identity check." },
    focus: { title: "Work alongside others", file: "focus.png", alt: "In-person coworking session with a focus timer, upcoming break information, and a personal goal list.", caption: "Original in-person session screen. The timer and task content are prototype states." },
    wireflow: { title: "The original session wireflow", file: "wireflow.png", alt: "Five original screens connected by red arrows: directions, arrival, focused work, break, and session completion.", caption: "Original Figma process artifact. On a small screen, scroll the enlarged image horizontally to inspect the flow." }
  };
  const steps = [
    { screen: "location", detail: "A selected pin and address field make the proposed meeting place explicit before moving on." },
    { screen: "schedule", detail: "The schedule gives check-in, focus periods, breaks, and reflection their own time blocks across the day." },
    { screen: "review", detail: "The summary gathers the session details in one place, with edit actions beside each section before publishing." },
    { screen: "focus", detail: "The in-person session pairs the current focus period with upcoming breaks and a personal goal list." }
  ];
  let currentStep = 0;
  const stepButtons = [...document.querySelectorAll("[data-step]")];
  const walkthroughImage = document.getElementById("walkthrough-image");
  const walkthroughView = document.getElementById("walkthrough-view");
  const prev = document.getElementById("step-prev");
  const next = document.getElementById("step-next");

  function showStep(index) {
    if (index < 0 || index >= steps.length) return;
    currentStep = index;
    const step = steps[index];
    const screen = screens[step.screen];
    walkthroughImage.src = `assets/screens/${screen.file}`;
    walkthroughImage.alt = screen.alt;
    // The long schedule remains complete within the same handset. No source pixels are cropped.
    walkthroughImage.classList.toggle("cs-screen--long", step.screen === "schedule");
    walkthroughView.dataset.view = step.screen;
    document.getElementById("stage-label").textContent = screen.title;
    document.getElementById("step-detail").textContent = step.detail;
    const count = document.getElementById("step-count");
    count.firstChild.textContent = `${String(index + 1).padStart(2, "0")} `;
    stepButtons.forEach((button, i) => {
      button.classList.toggle("is-active", i === index);
      button.setAttribute("aria-pressed", String(i === index));
    });
    prev.disabled = index === 0;
    next.disabled = index === steps.length - 1;
  }

  stepButtons.forEach((button) => button.addEventListener("click", () => showStep(Number(button.dataset.step))));
  prev.addEventListener("click", () => showStep(currentStep - 1));
  next.addEventListener("click", () => showStep(currentStep + 1));

  const dialog = document.querySelector(".cs-viewer");
  const viewerImage = document.getElementById("viewer-image");
  const close = document.getElementById("viewer-close");
  let opener;

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.view;
      const screen = screens[key];
      if (!screen) return;
      opener = button;
      document.getElementById("viewer-title").textContent = screen.title;
      document.getElementById("viewer-caption").textContent = screen.caption;
      viewerImage.src = `assets/screens/${screen.file}`;
      viewerImage.alt = screen.alt;
      viewerImage.removeAttribute("width");
      viewerImage.removeAttribute("height");
      dialog.classList.toggle("is-wide", key === "wireflow");
      dialog.showModal();
      document.body.classList.add("cs-modal-open");
      close.focus();
    });
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("cs-modal-open");
    if (opener) opener.focus();
  });
})();
