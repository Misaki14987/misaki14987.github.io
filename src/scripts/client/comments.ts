import { mountPageModule } from "./page-lifecycle";

/**
 * 读者来信 — giscus with its own light/dark themes, re-mounted for every article
 * (client-side navigation included) and kept in step with the day/night edition.
 */
const GISCUS_ORIGIN = "https://giscus.app";

const theme = () => (document.documentElement.dataset.edition === "night" ? "dark" : "light");

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
      theme: theme(),
      lang: "zh-CN",
      loading: "lazy",
    }).forEach(([key, value]) => {
      if (value) script.setAttribute(`data-${key}`, value);
    });
    thread.append(script);

    // giscus has no API for the edition, so follow the attribute on <html>.
    const observer = new MutationObserver(() => {
      thread.querySelector<HTMLIFrameElement>("iframe.giscus-frame")?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: theme() } } },
        GISCUS_ORIGIN,
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-edition"] });

    return () => observer.disconnect();
  });
};
