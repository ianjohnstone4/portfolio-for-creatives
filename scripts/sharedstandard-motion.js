// Each silent study starts only when the visitor chooses to play it.
const motionClips = [...document.querySelectorAll(".ss-motion video")];

motionClips.forEach((clip) => {
  clip.addEventListener("play", () => {
    motionClips.forEach((other) => {
      if (other !== clip) other.pause();
    });
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) motionClips.forEach((clip) => clip.pause());
});
