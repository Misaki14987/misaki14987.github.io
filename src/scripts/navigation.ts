export const normalizePath = (path: string) => {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
};

export const isNavigationPathActive = (currentPath: string, href: string) => {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);

  return target === "/"
    ? current === "/"
    : current === target || current.startsWith(target);
};
