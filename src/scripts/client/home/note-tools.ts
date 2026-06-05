import type { Cleanup } from "../page-lifecycle";

const FILTER_KEYS = ["q", "tag", "type", "sort"];

export const initializeNoteTools = (root: HTMLElement): Cleanup | void => {
  const form = root.querySelector<HTMLFormElement>("[data-note-tools]");
  const list = root.querySelector<HTMLElement>(".note-ledger__list");
  if (!form || !list) return;

  const search = form.querySelector<HTMLInputElement>("[data-note-search]");
  const tag = form.querySelector<HTMLSelectElement>("[data-note-tag]");
  const sort = form.querySelector<HTMLSelectElement>("[data-note-sort]");
  if (!search || !tag || !sort) return;

  const controller = new AbortController();
  const { signal } = controller;
  const toneButtons = Array.from(form.querySelectorAll<HTMLButtonElement>("[data-tone-filter]"));
  const count = root.querySelector<HTMLElement>("[data-note-count]");
  const reset = root.querySelector<HTMLButtonElement>("[data-note-reset]");
  const empty = root.querySelector<HTMLElement>("[data-note-empty]");
  const entries = Array.from(list.querySelectorAll<HTMLElement>(".archive-entry"));
  const originalOrder = new Map(entries.map((entry, index) => [entry, index]));
  const params = new URLSearchParams(location.search);
  let activeTone = params.get("type") || "";

  const normalize = (value: string) => value.trim().toLocaleLowerCase("zh-CN");

  const syncToneButtons = () => {
    toneButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.toneFilter === activeTone));
    });
  };

  const updateUrl = () => {
    const url = new URL(location.href);
    FILTER_KEYS.forEach((key) => url.searchParams.delete(key));

    if (root.dataset.activeScene === "articles") url.searchParams.set("view", "articles");
    if (search.value.trim()) url.searchParams.set("q", search.value.trim());
    if (tag.value) url.searchParams.set("tag", tag.value);
    if (activeTone) url.searchParams.set("type", activeTone);
    if (sort.value === "oldest") url.searchParams.set("sort", "oldest");

    history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const apply = () => {
    const query = normalize(search.value);
    const selectedTag = normalize(tag.value);
    let visible = 0;

    entries.forEach((entry) => {
      const matchesQuery = !query || (entry.dataset.search || "").includes(query);
      const entryTags = (entry.dataset.tags || "").split("|");
      const matchesTag = !selectedTag || entryTags.includes(selectedTag);
      const matchesTone = !activeTone || entry.dataset.tone === activeTone;
      const show = matchesQuery && matchesTag && matchesTone;

      entry.hidden = !show;
      if (show) visible += 1;
    });

    entries
      .slice()
      .sort((a, b) => sort.value === "oldest"
        ? Number(a.dataset.date || 0) - Number(b.dataset.date || 0)
        : (originalOrder.get(a) ?? 0) - (originalOrder.get(b) ?? 0))
      .forEach((entry) => list.append(entry));

    if (count) count.textContent = `${visible} 篇`;
    if (empty) empty.hidden = visible !== 0;
    if (reset) reset.hidden = !(query || selectedTag || activeTone || sort.value === "oldest");
    updateUrl();
  };

  search.value = params.get("q") || "";
  tag.value = params.get("tag") || "";
  sort.value = params.get("sort") === "oldest" ? "oldest" : "newest";
  syncToneButtons();

  toneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTone = button.dataset.toneFilter || "";
      syncToneButtons();
      apply();
    }, { signal });
  });

  search.addEventListener("input", apply, { signal });
  tag.addEventListener("change", apply, { signal });
  sort.addEventListener("change", apply, { signal });
  form.addEventListener("submit", (event) => event.preventDefault(), { signal });

  reset?.addEventListener("click", () => {
    form.reset();
    activeTone = "";
    syncToneButtons();
    apply();
    search.focus();
  }, { signal });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable);
    if (isTyping) return;

    const requestsSearch =
      event.key === "/" ||
      ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
    if (!requestsSearch) return;

    event.preventDefault();
    if (root.dataset.activeScene !== "articles") {
      root.querySelector<HTMLButtonElement>('[data-scene-target="articles"]')?.click();
    }
    search.focus({ preventScroll: true });
  }, { signal });

  apply();
  return () => controller.abort();
};
