export const initializeFootnotes = (
  article: HTMLElement,
  signal: AbortSignal
) => {
  const removePreviews = () => {
    article.querySelectorAll(".footnote-preview").forEach((preview) => preview.remove());
  };

  article.querySelectorAll<HTMLAnchorElement>("a[data-footnote-ref]").forEach((reference) => {
    reference.addEventListener("click", (event) => {
      const note = document.getElementById(decodeURIComponent(reference.hash.slice(1)));
      if (!note) return;
      event.preventDefault();
      removePreviews();

      const preview = document.createElement("aside");
      preview.className = "footnote-preview";
      preview.innerHTML = note.innerHTML;
      preview.querySelectorAll("[data-footnote-backref]").forEach((backref) => backref.remove());
      preview.style.setProperty("--footnote-top", `${reference.offsetTop}px`);

      const close = document.createElement("button");
      close.type = "button";
      close.setAttribute("aria-label", "关闭脚注");
      close.textContent = "×";
      close.addEventListener("click", () => preview.remove(), { signal });
      preview.prepend(close);

      const paragraph = reference.closest("p, li, blockquote");
      if (matchMedia("(max-width: 1080px)").matches && paragraph) {
        paragraph.after(preview);
      } else {
        article.append(preview);
      }
    }, { signal });
  });

  return removePreviews;
};
