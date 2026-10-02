import { initializeScrollRestoration } from "./scroll-restoration";
import { mountPublication } from "./publication";
import { initializeTransitions } from "./transitions";
import { initializeCounters } from "./counters";

let initialized = false;

export const initializeSiteRuntime = () => {
  if (initialized) return;
  initialized = true;

  initializeScrollRestoration();
  initializeTransitions();
  initializeCounters();
  mountPublication();
};
