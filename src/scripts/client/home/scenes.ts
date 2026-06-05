import type { Cleanup } from "../page-lifecycle";

const SCENE_ORDER = ["intro", "articles"] as const;
const FILTER_KEYS = ["q", "tag", "type", "sort"];
const TRANSITION_MS = 720;

type SceneName = (typeof SCENE_ORDER)[number];

const isSceneName = (value: string): value is SceneName =>
  SCENE_ORDER.includes(value as SceneName);

export const initializeHomeScenes = (root: HTMLElement): Cleanup => {
  const controller = new AbortController();
  const { signal } = controller;
  const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
  const targets = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-scene-target]"));
  const steps = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-scene-step]"));
  const viewport = root.querySelector<HTMLElement>(".scene-viewport");
  const params = new URLSearchParams(location.search);
  const hasFilters = FILTER_KEYS.some((key) => params.has(key));
  let active: SceneName =
    params.get("view") === "intro"
      ? "intro"
      : params.get("view") === "articles" || hasFilters
        ? "articles"
        : "intro";
  let transitioning = false;
  let transitionTimer: number | undefined;
  let touchStartX = 0;

  const syncControls = () => {
    root.dataset.activeScene = active;
    targets.forEach((target) => {
      target.setAttribute("aria-pressed", String(target.dataset.sceneTarget === active));
    });
  };

  const showInitialScene = () => {
    scenes.forEach((scene) => {
      const selected = scene.dataset.scene === active;
      scene.hidden = !selected;
      scene.classList.toggle("is-active", selected);
    });
    syncControls();
  };

  const updateUrl = () => {
    const url = new URL(location.href);
    if (active === "articles") {
      url.searchParams.set("view", "articles");
    } else if (FILTER_KEYS.some((key) => url.searchParams.has(key))) {
      url.searchParams.set("view", "intro");
    } else {
      url.searchParams.delete("view");
    }
    history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const switchTo = (next: SceneName) => {
    if (next === active || transitioning) return;

    const outgoing = scenes.find((scene) => scene.dataset.scene === active);
    const incoming = scenes.find((scene) => scene.dataset.scene === next);
    if (!outgoing || !incoming) return;

    const direction = SCENE_ORDER.indexOf(next) > SCENE_ORDER.indexOf(active)
      ? "forward"
      : "backward";
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    transitioning = true;
    incoming.hidden = false;
    incoming.classList.add("is-active", `scene-in--${direction}`);
    outgoing.classList.add(`scene-out--${direction}`);
    active = next;
    syncControls();
    updateUrl();
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

    const finish = () => {
      outgoing.hidden = true;
      outgoing.classList.remove("is-active", `scene-out--${direction}`);
      incoming.classList.remove(`scene-in--${direction}`);
      transitioning = false;
    };

    if (reducedMotion) {
      finish();
    } else {
      transitionTimer = window.setTimeout(finish, TRANSITION_MS);
    }
  };

  targets.forEach((target) => {
    target.addEventListener("click", () => {
      const next = target.dataset.sceneTarget || "";
      if (isSceneName(next)) switchTo(next);
    }, { signal });
  });

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      const offset = Number(step.dataset.sceneStep || 0);
      const nextIndex = (SCENE_ORDER.indexOf(active) + offset + SCENE_ORDER.length)
        % SCENE_ORDER.length;
      switchTo(SCENE_ORDER[nextIndex]);
    }, { signal });
  });

  viewport?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0]?.clientX || 0;
  }, { passive: true, signal });

  viewport?.addEventListener("touchend", (event) => {
    const distance = (event.changedTouches[0]?.clientX || touchStartX) - touchStartX;
    if (Math.abs(distance) < 56) return;

    const offset = distance < 0 ? 1 : -1;
    const nextIndex = (SCENE_ORDER.indexOf(active) + offset + SCENE_ORDER.length)
      % SCENE_ORDER.length;
    switchTo(SCENE_ORDER[nextIndex]);
  }, { passive: true, signal });

  showInitialScene();

  return () => {
    controller.abort();
    window.clearTimeout(transitionTimer);
  };
};
