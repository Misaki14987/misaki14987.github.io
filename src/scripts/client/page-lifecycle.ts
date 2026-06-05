export type Cleanup = () => void;

const mountedSelectors = new Set<string>();

export const mountPageModule = <Root extends Element>(
  selector: string,
  initialize: (root: Root) => Cleanup | void
) => {
  if (mountedSelectors.has(selector)) return;
  mountedSelectors.add(selector);

  let activeRoot: Root | null = null;
  let cleanup: Cleanup | undefined;

  const mount = () => {
    const nextRoot = document.querySelector<Root>(selector);
    if (nextRoot === activeRoot) return;

    cleanup?.();
    cleanup = undefined;
    activeRoot = nextRoot;

    if (nextRoot) cleanup = initialize(nextRoot) || undefined;
  };

  document.addEventListener("astro:page-load", mount);
  mount();
};
