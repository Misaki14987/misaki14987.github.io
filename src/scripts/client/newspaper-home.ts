import { mountPageModule } from './page-lifecycle';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const initializeNewspaperHome = () => {
  mountPageModule<HTMLElement>('[data-newspaper-home]', (root) => {
    const controller = new AbortController();
    const { signal } = controller;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const scenes = Array.from(root.querySelectorAll<HTMLElement>('.np-scene, .np-desk__outro'));
    let frame = 0;
    let stamped = false;

    const updateOpening = () => {
      const reduced = reducedMotion.matches;
      const active = document.documentElement.dataset.theme === 'newspaper';
      const progress = reduced ? 1 : active ? clamp(window.scrollY / (window.innerHeight * .72)) : 0;
      const ink = clamp((progress - .28) / .42);
      const mobile = innerWidth <= 768;
      const startY = mobile ? -72 : -120;
      const startRotation = mobile ? -3 : -7;
      const startScale = mobile ? .9 : .84;

      root.style.setProperty('--desk-paper-y', `${startY * (1 - progress)}px`);
      root.style.setProperty('--desk-paper-rotate', `${startRotation * (1 - progress)}deg`);
      root.style.setProperty('--desk-paper-scale', String(startScale + progress * (1 - startScale)));
      root.style.setProperty('--desk-title-opacity', String(.2 + ink * .8));
      root.style.setProperty('--desk-title-scale', String(1.12 - ink * .12));
      root.style.setProperty('--desk-title-blur', `${(1 - ink) * 5}px`);
      root.style.setProperty('--desk-pencil-shift', `${progress * 34}px`);
      root.style.setProperty('--desk-coffee-shift', `${progress * -18}px`);
      root.style.setProperty('--desk-fold-angle', `${(1 - progress) * 34}deg`);
      root.style.setProperty('--desk-crease-opacity', String(.34 - progress * .2));

      if (!stamped && progress >= .7) {
        stamped = true;
        root.classList.add('is-stamped', 'is-stamp-striking');
        window.setTimeout(() => root.classList.remove('is-stamp-striking'), 240);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateOpening();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '-8% 0px -12%', threshold: .16 });

    const mountMotion = () => {
      const reduced = reducedMotion.matches;
      root.dataset.motion = reduced ? 'reduced' : 'full';
      if (reduced) {
        root.classList.add('is-stamped');
        scenes.forEach((scene) => scene.classList.add('is-in-view'));
      } else {
        scenes.forEach((scene) => observer.observe(scene));
      }
      updateOpening();
    };

    document.addEventListener('site:theme-change', ((event: CustomEvent) => {
      if (event.detail.theme !== 'newspaper') return;
      if (event.detail.explicit) {
        stamped = false;
        root.classList.remove('is-stamped', 'is-stamp-striking');
        scenes.forEach((scene) => {
          scene.classList.remove('is-in-view');
          if (!reducedMotion.matches) observer.observe(scene);
        });
      }
      updateOpening();
    }) as EventListener, { signal });
    window.addEventListener('scroll', schedule, { passive: true, signal });
    window.addEventListener('resize', schedule, { signal });
    reducedMotion.addEventListener('change', mountMotion, { signal });
    mountMotion();

    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  });
};
