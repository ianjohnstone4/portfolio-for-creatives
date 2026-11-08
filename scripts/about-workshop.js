(() => {
  const section = document.getElementById("cabin-and-workshop");
  if (!section) return;

  const chooser = section.querySelector(".workshop-choices");
  const choices = Array.from(chooser.querySelectorAll("button"));
  const projects = Array.from(section.querySelectorAll(".workshop-project"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function select(id) {
    for (const project of projects) {
      project.hidden = project.id !== id;
      if (project.hidden) project.querySelector("video").pause();
    }
    for (const choice of choices) {
      choice.setAttribute("aria-pressed", String(choice.getAttribute("aria-controls") === id));
    }
  }

  for (const choice of choices) {
    choice.addEventListener("click", () => select(choice.getAttribute("aria-controls")));
  }
  select(choices[0].getAttribute("aria-controls"));
  chooser.hidden = false;

  function preparePlayer(project) {
    const video = project.querySelector("video");
    if (!video.canPlayType("video/mp4")) return;

    const controls = project.querySelector(".workshop-controls");
    const toggle = controls.querySelector("[data-play]");
    const finish = controls.querySelector('[data-jump="end"]');
    let seen = false;
    let inView = false;
    let pendingSeek = null;

    function atEnd() {
      return video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.015);
    }

    function sync() {
      if (atEnd()) toggle.textContent = "Replay";
      else if (!video.paused) toggle.textContent = "Pause";
      else if (video.currentTime > 0.015) toggle.textContent = "Resume";
      else toggle.textContent = toggle.dataset.play;
      if (finish) finish.hidden = atEnd();
    }

    function play() {
      seen = true;
      const playing = video.play();
      if (playing) playing.catch(sync);
    }

    function seek(target) {
      if (Number.isFinite(video.duration)) {
        pendingSeek = null;
        video.currentTime = target === "end" ? video.duration : Math.min(target, video.duration);
      } else {
        pendingSeek = target;
        video.load();
      }
    }

    toggle.addEventListener("click", () => {
      seen = true;
      pendingSeek = null;
      if (!video.paused && !atEnd()) {
        video.pause();
      } else {
        if (atEnd()) seek(0);
        play();
      }
    });

    finish?.addEventListener("click", () => {
      seen = true;
      const focusReplay = document.activeElement === finish;
      video.pause();
      seek("end");
      if (focusReplay) toggle.focus({ preventScroll: true });
    });

    video.addEventListener("loadedmetadata", () => {
      if (pendingSeek !== null) seek(pendingSeek);
      sync();
    });
    for (const event of ["play", "pause", "ended", "seeked"]) {
      video.addEventListener(event, sync);
    }
    video.addEventListener("error", () => {
      controls.hidden = true;
      video.controls = true;
    });

    function checkAutoplay() {
      if (project.hidden || document.hidden || !inView) {
        video.pause();
      } else if (!seen && !reducedMotion.matches) {
        play();
      }
    }
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.3;
        checkAutoplay();
      }, { threshold: [0, 0.3] });
      observer.observe(video);
    }
    document.addEventListener("visibilitychange", checkAutoplay);
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) video.pause();
      else checkAutoplay();
    });
    video.muted = true;
    video.controls = false;
    controls.hidden = false;
    sync();
  }

  projects.forEach(preparePlayer);
})();
