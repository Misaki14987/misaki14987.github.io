import { mountPageModule } from './page-lifecycle';

export type SiteTheme = 'units' | 'newspaper';
type TransitionPhase = 'idle' | 'exit' | 'cover' | 'swap' | 'enter';

const normalizeTheme = (value: string | null): SiteTheme =>
  value === 'newspaper' || value === 'plain' ? 'newspaper' : 'units';

const preferredTheme = (): SiteTheme => {
  const requested = new URLSearchParams(location.search).get('theme');
  if (requested === 'units' || requested === 'newspaper' || requested === 'plain') {
    return normalizeTheme(requested);
  }
  return normalizeTheme(localStorage.getItem('site-theme'));
};

const updateControls = (theme: SiteTheme) => {
  const next = theme === 'units' ? 'NEWSPAPER' : 'UNIT';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', `切换到 ${next} 主题`);
    button.setAttribute('title', `切换到 ${next} 主题`);
    button.querySelectorAll<HTMLElement>('[data-theme-name]').forEach((name) => {
      name.textContent = theme === 'units' ? 'UNIT' : 'NEWSPAPER';
    });
  });
};

const applyTheme = (theme: SiteTheme, previous = theme, explicit = false) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('site-theme', theme);
  updateControls(theme);
  document.dispatchEvent(new CustomEvent('site:theme-change', {
    detail: { theme, previous, explicit },
  }));
};

export const initializeThemeController = () => {
  mountPageModule<HTMLElement>('[data-theme-transition][data-phase]', (root) => {
    const controller = new AbortController();
    const { signal } = controller;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let timers: number[] = [];
    let targetTheme: SiteTheme | null = null;

    const setPhase = (phase: TransitionPhase) => {
      root.dataset.phase = phase;
      if (phase === 'idle') delete document.documentElement.dataset.themeTransition;
      else document.documentElement.dataset.themeTransition = phase;
    };

    const clearTimers = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };

    const finish = () => {
      if (targetTheme) {
        const previous = normalizeTheme(document.documentElement.dataset.theme ?? null);
        if (previous !== targetTheme) applyTheme(targetTheme, previous, true);
      }
      targetTheme = null;
      root.dataset.from = '';
      root.dataset.to = '';
      root.setAttribute('aria-hidden', 'true');
      setPhase('idle');
      clearTimers();
      document.querySelector<HTMLButtonElement>('[data-theme-toggle]:not([hidden])')?.focus({ preventScroll: true });
    };

    const later = (delay: number, callback: () => void) => {
      timers.push(window.setTimeout(callback, delay));
    };

    const switchTheme = () => {
      if (targetTheme) return;
      const from = normalizeTheme(document.documentElement.dataset.theme ?? null);
      const to: SiteTheme = from === 'units' ? 'newspaper' : 'units';

      if (reducedMotion.matches) {
        if (location.pathname === '/' && to === 'newspaper') window.scrollTo({ top: 0, behavior: 'auto' });
        applyTheme(to, from, true);
        return;
      }

      targetTheme = to;
      root.dataset.from = from;
      root.dataset.to = to;
      root.setAttribute('aria-hidden', 'false');
      setPhase('exit');

      later(280, () => setPhase('cover'));
      later(700, () => {
        if (location.pathname === '/' && to === 'newspaper') window.scrollTo({ top: 0, behavior: 'auto' });
        applyTheme(to, from, true);
        setPhase('swap');
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase('enter')));
      });
      later(1420, finish);
    };

    document.addEventListener('click', (event) => {
      if ((event.target as Element).closest('[data-theme-toggle]')) switchTheme();
    }, { signal });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && targetTheme) finish();
    }, { signal });
    document.addEventListener('astro:before-swap', ((event: Event & { newDocument: Document }) => {
      event.newDocument.documentElement.dataset.theme = normalizeTheme(document.documentElement.dataset.theme ?? null);
    }) as EventListener, { signal });

    applyTheme(preferredTheme());
    if (location.hash) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
      }));
    }

    return () => {
      controller.abort();
      clearTimers();
    };
  });
};
