export const initializeReadingControls = (
  article: HTMLElement,
  signal: AbortSignal
) => {
  const progress = document.querySelector<HTMLElement>("[data-reading-progress]");
  const backToTop = document.querySelector<HTMLButtonElement>("[data-back-to-top]");
  const toc = document.querySelector<HTMLElement>("[data-post-toc]");
  const tocToggle = document.querySelector<HTMLButtonElement>("[data-toc-toggle]");

  const updateScrollState = () => {
    const top = article.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, article.offsetHeight - window.innerHeight * 0.55);
    const value = Math.min(1, Math.max(0, (window.scrollY - top) / distance));

    if (progress) progress.style.transform = `scaleX(${value})`;
    backToTop?.classList.toggle("is-visible", window.scrollY > 720);
  };

  window.addEventListener("scroll", updateScrollState, { passive: true, signal });
  window.addEventListener("resize", updateScrollState, { signal });
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, { signal });

  tocToggle?.addEventListener("click", () => {
    if (!toc) return;

    const open = toc.classList.toggle("is-open");
    tocToggle.setAttribute("aria-expanded", String(open));
    const marker = tocToggle.querySelector("span");
    if (marker) marker.textContent = open ? "−" : "+";
  }, { signal });

  updateScrollState();
};
