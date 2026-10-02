import { navigate } from "astro:transitions/client";
import type { TransitionBeforePreparationEvent } from "astro:transitions/client";
import { mountPageModule } from "./page-lifecycle";
import { storyIdFromPath, storyKey } from "../story-key";

/**
 * Every navigation is one of three gestures, exposed to CSS through
 * Astro's `data-astro-transition` attribute:
 *   story    — opening or leaving an article: the cover and headline carry over
 *   forward  — turning to the next page
 *   back     — turning back
 */
let pendingTurn: "back" | undefined;
let activeStory: string | undefined;

/** Only the story being opened (or returned from) carries its names across. */
const markActiveStory = () => {
  document.querySelectorAll(".is-story-active").forEach((element) => {
    element.classList.remove("is-story-active");
  });
  if (!activeStory) return;
  document.querySelectorAll(`[data-story="${activeStory}"]`).forEach((element) => {
    element.classList.add("is-story-active");
  });
};

export const turnBackTo = (href: string) => {
  pendingTurn = "back";
  navigate(href);
};

const initializePageTurns = () => {
  document.addEventListener("astro:before-preparation", (event) => {
    const preparation = event as TransitionBeforePreparationEvent;
    const turn = pendingTurn
      ?? (preparation.sourceElement as Element | undefined)
        ?.closest?.("[data-turn]")
        ?.getAttribute("data-turn");
    pendingTurn = undefined;

    const storyId = storyIdFromPath(preparation.to.pathname)
      ?? storyIdFromPath(preparation.from.pathname);
    activeStory = storyId ? storyKey(storyId) : undefined;
    markActiveStory();

    if (storyId) {
      preparation.direction = "story";
    } else if (turn === "back") {
      preparation.direction = "back";
    }
  });

  // The new page is captured after the swap, so mark its copy of the story too.
  document.addEventListener("astro:after-swap", markActiveStory);
  document.addEventListener("astro:page-load", () => {
    activeStory = undefined;
    markActiveStory();
  });
};

/** Day ↔ night edition, with the new edition inked outward from the toggle. */
const initializeEditionToggle = () => {
  document.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest?.("[data-edition-toggle]");
    if (!button) return;

    const root = document.documentElement;
    const next = root.dataset.edition === "night" ? "day" : "night";
    const apply = () => {
      root.dataset.edition = next;
      try {
        localStorage.setItem("edition", next);
      } catch {}
    };

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    const bounds = button.getBoundingClientRect();
    root.style.setProperty("--flood-x", `${bounds.left + bounds.width / 2}px`);
    root.style.setProperty("--flood-y", `${bounds.top + bounds.height / 2}px`);
    root.classList.add("is-edition-switching");
    document.startViewTransition(apply).finished.finally(() => {
      root.classList.remove("is-edition-switching");
    });
  });
};

/** The nav carries the brand only once the nameplate has left the screen. */
const initializeNameplateBrand = () => {
  mountPageModule<HTMLElement>("[data-nameplate]", (nameplate) => {
    const nav = document.querySelector<HTMLElement>("[data-site-nav]");
    if (!nav) return;

    const observer = new IntersectionObserver(([entry]) => {
      nav.classList.toggle("is-brand-visible", !entry.isIntersecting);
    }, { rootMargin: "-60px 0px 0px 0px" });
    observer.observe(nameplate);

    return () => {
      observer.disconnect();
      nav.classList.remove("is-brand-visible");
    };
  });
};

export const initializeTransitions = () => {
  initializePageTurns();
  initializeEditionToggle();
  initializeNameplateBrand();
};
