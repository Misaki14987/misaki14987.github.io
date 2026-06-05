export const initializeScrollRestoration = () => {
  history.scrollRestoration = "manual";
  let restoreSavedPosition = false;
  let saveFrame = 0;

  const storageKey = () => `scroll:${location.pathname}${location.search}`;
  const savePosition = () => {
    sessionStorage.setItem(storageKey(), String(window.scrollY));
  };

  window.addEventListener("scroll", () => {
    cancelAnimationFrame(saveFrame);
    saveFrame = requestAnimationFrame(savePosition);
  }, { passive: true });

  window.addEventListener("popstate", () => {
    restoreSavedPosition = true;
  });

  document.addEventListener("astro:before-preparation", savePosition);
  document.addEventListener("astro:after-swap", () => {
    if (location.hash) return;

    const savedPosition = Number(sessionStorage.getItem(storageKey()) || 0);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: restoreSavedPosition ? savedPosition : 0,
        behavior: "auto",
      });
      restoreSavedPosition = false;
    });
  });
};
