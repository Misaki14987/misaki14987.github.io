import { isNavigationPathActive } from "../navigation";

export const initializeNavigation = () => {
  const update = () => {
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]").forEach((link) => {
      const active = isNavigationPathActive(location.pathname, link.getAttribute("href") || "/");
      link.classList.toggle("active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  document.addEventListener("astro:page-load", update);
  update();
};
