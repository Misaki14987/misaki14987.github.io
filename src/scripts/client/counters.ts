/**
 * The colophon's live numbers.
 *
 * - Days since founding are counted in the browser so they never go stale between builds.
 * - Visits come from Vercount (a 不蒜子-compatible counter that works with modern browsers'
 *   blocking rules). Its script counts the page it runs on, so it is re-inserted on every
 *   client-side navigation. Counters stay hidden until filled (see `.visit-count` in the
 *   theme), so an outage simply hides them.
 */
const COUNTER_SRC = "https://events.vercount.one/js";
const DAY_MS = 86_400_000;

const updateDaysSince = () => {
  document.querySelectorAll<HTMLElement>("[data-days-since]").forEach((element) => {
    const founded = new Date(`${element.dataset.daysSince}T00:00:00+08:00`);
    if (Number.isNaN(founded.getTime())) return;
    element.textContent = String(Math.max(1, Math.floor((Date.now() - founded.getTime()) / DAY_MS) + 1));
  });
};

const countVisit = () => {
  if (!document.querySelector('[id^="vercount_value_"]')) return;

  document.querySelector("script[data-visit-counter]")?.remove();
  const script = document.createElement("script");
  script.src = COUNTER_SRC;
  script.async = true;
  script.dataset.visitCounter = "";
  document.head.append(script);
};

const onPage = () => {
  // Astro swaps <body> on every navigation, so this marks one count per page view
  // even though this runs both now and on the first `astro:page-load`.
  if ("counted" in document.body.dataset) return;
  document.body.dataset.counted = "";

  updateDaysSince();
  // Local previews would otherwise be counted as visits.
  if (import.meta.env.PROD) countVisit();
};

export const initializeCounters = () => {
  document.addEventListener("astro:page-load", onPage);
  onPage();
};
