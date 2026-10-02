import { mountPageModule } from "./page-lifecycle";

/**
 * Searching the 合订本 with Pagefind. The index is written into `dist/pagefind/` after
 * `astro build`, so it is loaded lazily on the first keystroke and is absent in `astro dev`.
 */
type PagefindResult = {
  url: string;
  excerpt: string;
  meta: { title?: string; date?: string; kind?: string };
};
type Pagefind = {
  options: (options: Record<string, unknown>) => Promise<void>;
  debouncedSearch: (
    term: string,
    options?: Record<string, unknown>,
    debounceMs?: number,
  ) => Promise<{ results: { data: () => Promise<PagefindResult> }[] } | null>;
};

const PAGEFIND_PATH = "/pagefind/pagefind.js";
const RESULT_LIMIT = 12;
let pagefind: Promise<Pagefind | null> | undefined;

const loadPagefind = () => {
  pagefind ??= import(/* @vite-ignore */ PAGEFIND_PATH)
    .then(async (module: Pagefind) => {
      await module.options({ excerptLength: 36 });
      return module;
    })
    .catch(() => null);
  return pagefind;
};

const renderResult = (result: PagefindResult) => {
  const item = document.createElement("li");
  item.className = "entry-row";

  const link = document.createElement("a");
  link.className = "entry-link archive-result";
  link.href = result.url;

  const date = document.createElement("span");
  date.className = "entry-date";
  date.textContent = result.meta.date ?? "";

  const body = document.createElement("span");
  body.className = "archive-result__body";
  const title = document.createElement("strong");
  title.className = "entry-title";
  title.textContent = result.meta.title ?? result.url;
  const excerpt = document.createElement("span");
  excerpt.className = "archive-result__excerpt";
  // Pagefind escapes the page text and only adds <mark> around the matched words.
  excerpt.innerHTML = result.excerpt;
  body.append(title, excerpt);

  const kind = document.createElement("span");
  kind.className = "entry-tag publication-meta";
  kind.textContent = result.meta.kind ?? "";

  const arrow = document.createElement("span");
  arrow.className = "entry-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";

  link.append(date, body, kind, arrow);
  item.append(link);
  return item;
};

export const mountArchiveSearch = () => {
  mountPageModule<HTMLElement>("[data-archive-search]", (root) => {
    const controller = new AbortController();
    const { signal } = controller;
    const input = root.querySelector<HTMLInputElement>("[data-search-input]");
    const status = root.querySelector<HTMLElement>("[data-search-status]");
    const list = root.querySelector<HTMLOListElement>("[data-search-results]");
    const years = document.querySelector<HTMLElement>("[data-archive-years]");
    if (!input || !status || !list) return;

    const showArchive = () => {
      list.hidden = true;
      list.replaceChildren();
      status.textContent = "";
      if (years) years.hidden = false;
    };

    const search = async () => {
      const term = input.value.trim();
      if (!term) {
        showArchive();
        return;
      }

      const engine = await loadPagefind();
      if (!engine) {
        status.textContent = "检索索引在构建后生成（本地请先运行 pnpm build && pnpm preview）。";
        return;
      }

      const found = await engine.debouncedSearch(term, {}, 180);
      if (found === null || input.value.trim() !== term) return;

      const results = await Promise.all(found.results.slice(0, RESULT_LIMIT).map((result) => result.data()));
      if (years) years.hidden = true;
      list.hidden = results.length === 0;
      list.replaceChildren(...results.map(renderResult));
      status.textContent = results.length
        ? `找到 ${found.results.length} 篇与「${term}」有关的往期`
        : `合订本里没有找到「${term}」`;
    };

    input.addEventListener("input", search, { signal });
    input.addEventListener("focus", () => void loadPagefind(), { once: true, signal });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        showArchive();
      }
    }, { signal });
    document.addEventListener("keydown", (event) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, [contenteditable='true']");
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        input.focus();
      }
    }, { signal });

    return () => controller.abort();
  });
};
