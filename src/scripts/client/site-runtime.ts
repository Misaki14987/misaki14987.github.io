import { initializeScrollRestoration } from "./scroll-restoration";
import { mountPublication } from "./publication";

let initialized = false;

export const initializeSiteRuntime = () => {
  if (initialized) return;
  initialized = true;

  initializeScrollRestoration();
  mountPublication();
};
