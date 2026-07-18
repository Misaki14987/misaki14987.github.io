import { initializeScrollRestoration } from "./scroll-restoration";

let initialized = false;

export const initializeSiteRuntime = () => {
  if (initialized) return;
  initialized = true;

  initializeScrollRestoration();
};
