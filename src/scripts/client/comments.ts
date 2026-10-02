import { mountPageModule } from "./page-lifecycle";

/**
 * 读者来信 — giscus, re-mounted for every article (client-side navigation included) and kept
 * in step with the day/night edition. The themes live in /public/giscus so the comments are
 * printed on the same paper as the article.
 */
const GISCUS_ORIGIN = "https://giscus.app";

const themeUrl = () =>
  `${location.origin}/giscus/${document.documentElement.dataset.edition === "night" ? "night" : "day"}.css`;

export const mountComments = () => {
  mountPageModule<HTMLElement>("[data-comments]", (thread) => {
    const script = document.createElement("script");
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.entries({
      repo: thread.dataset.repo,
      "repo-id": thread.dataset.repoId,
      category: thread.dataset.category,
      "category-id": thread.dataset.categoryId,
      mapping: "pathname",
      strict: "1",
      "reactions-enabled": "1",
      "emit-metadata": "0",
      "input-position": "top",
      theme: themeUrl(),
      lang: "zh-CN",
      loading: "lazy",
    }).forEach(([key, value]) => {
      if (value) script.setAttribute(`data-${key}`, value);
    });
    thread.append(script);

    // giscus has no API for the edition, so follow the attribute on <html>.
    const observer = new MutationObserver(() => {
      thread.querySelector<HTMLIFrameElement>("iframe.giscus-frame")?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: themeUrl() } } },
        GISCUS_ORIGIN,
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-edition"] });

    return () => observer.disconnect();
  });
};
