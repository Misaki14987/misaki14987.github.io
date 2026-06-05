import { initializeNavigation } from "./navigation";
import { initializeRouteLoader } from "./route-loader";
import { initializeScrollRestoration } from "./scroll-restoration";

let initialized = false;

export const initializeSiteRuntime = () => {
  if (initialized) return;
  initialized = true;

  initializeNavigation();
  initializeRouteLoader();
  initializeScrollRestoration();
};
