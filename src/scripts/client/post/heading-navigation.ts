const RESET_LABEL_MS = 1200;

export const initializeHeadingNavigation = (
  article: HTMLElement,
  signal: AbortSignal
) => {
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"));
  const headings = Array.from(article.querySelectorAll<HTMLElement>("h2[id], h3[id]"));

  headings.forEach((heading) => {
    const anchor = document.createElement("a");
    const sectionTitle = heading.textContent || "本节";
    anchor.className = "heading-anchor";
    anchor.href = `#${heading.id}`;
    anchor.setAttribute("aria-label", `复制“${sectionTitle}”的链接`);
    anchor.textContent = "#";

    anchor.addEventListener("click", async (event) => {
      event.preventDefault();
      history.replaceState(history.state, "", `#${heading.id}`);
      heading.scrollIntoView({ behavior: "smooth", block: "start" });

      try {
        await navigator.clipboard.writeText(location.href);
        anchor.textContent = "已复制";
        window.setTimeout(() => {
          anchor.textContent = "#";
        }, RESET_LABEL_MS);
      } catch {
        anchor.textContent = "#";
      }
    }, { signal });

    heading.append(anchor);
  });

  if (headings.length === 0 || !("IntersectionObserver" in window)) return;

  const linkById = new Map(tocLinks.map((link) => [link.dataset.tocLink, link]));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;

    linkById.forEach((link, id) => {
      link.classList.toggle("is-active", id === visible.target.id);
    });
  }, {
    rootMargin: "-18% 0px -68% 0px",
    threshold: [0, 1],
  });

  headings.forEach((heading) => observer.observe(heading));
  return () => observer.disconnect();
};
