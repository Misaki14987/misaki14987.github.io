// Give the loader enough time to establish its visual rhythm before it can close.
const MIN_VISIBLE_MS = 320;

export const initializeRouteLoader = () => {
  let navigationStartedAt = 0;
  let navigationId = 0;
  let hideTimer: number | undefined;

  const getLoader = () => document.querySelector<HTMLElement>(".archive-loader");

  document.addEventListener("astro:before-preparation", () => {
    const loader = getLoader();
    if (!loader) return;

    navigationId += 1;
    navigationStartedAt = performance.now();
    window.clearTimeout(hideTimer);
    loader.classList.add("is-routing");
  });

  const triggerPageEntrance = () => {
    const main = document.querySelector<HTMLElement>("main.main");
    if (!main) return;
    main.classList.remove("is-entering");
    // Force reflow so the animation restarts on every navigation
    void main.offsetWidth;
    main.classList.add("is-entering");
  };

  document.addEventListener("astro:page-load", () => {
    const loader = getLoader();
    if (!loader?.classList.contains("is-routing")) return;

    const currentNavigationId = navigationId;
    const elapsed = performance.now() - navigationStartedAt;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (currentNavigationId !== navigationId) return;

      requestAnimationFrame(() => {
        // Kick off the page entrance at the same frame the loader starts exiting
        triggerPageEntrance();
        requestAnimationFrame(() => getLoader()?.classList.remove("is-routing"));
      });
    }, wait);
  });
};
