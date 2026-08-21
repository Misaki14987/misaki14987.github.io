import { mountPageModule } from './page-lifecycle';

/** Misaki Journal publication motion and reading progress. */
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const mountPublication = () => {
  mountPageModule<HTMLElement>('.publication', (root) => {
    const controller = new AbortController();
    const { signal } = controller;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let progressFrame = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartAt = 0;

    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const updateProgress = () => {
      progressFrame = 0;
      if (!progress) return;
      const max = (document.documentElement.scrollHeight || 1) - window.innerHeight;
      const ratio = clamp01(window.scrollY / Math.max(max, 1));
      progress.style.transform = `scaleX(${ratio})`;
    };
    const scheduleProgress = () => {
      if (progressFrame) return;
      progressFrame = requestAnimationFrame(updateProgress);
    };

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>('.friend-section, .colophon'),
    );
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10%', threshold: 0.08 });

    const configureMotion = () => {
      const reduced = reducedMotion.matches;
      root.dataset.motion = reduced ? 'reduced' : 'full';
      revealTargets.forEach((target) => {
        target.classList.add('publication-reveal');
        if (reduced) target.classList.add('is-revealed');
        else revealObserver.observe(target);
      });
    };

    const pointerRows = Array.from(
      root.querySelectorAll<HTMLElement>('.entry-link, .diary-entry, .friend-entry'),
    );
    if (!reducedMotion.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      pointerRows.forEach((row) => {
        row.addEventListener('pointermove', (event) => {
          const bounds = row.getBoundingClientRect();
          const offset = clamp01((event.clientX - bounds.left) / bounds.width) - 0.5;
          row.style.setProperty('--pointer-shift', `${offset * 7}px`);
        }, { passive: true, signal });
        row.addEventListener('pointerleave', () => {
          row.style.setProperty('--pointer-shift', '0px');
        }, { signal });
      });
    }

    const swipeHref = root.dataset.swipeHref;
    const swipeDirection = root.dataset.swipeDirection;
    if (swipeHref && (swipeDirection === 'left' || swipeDirection === 'right')) {
      root.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartAt = performance.now();
      }, { passive: true, signal });

      root.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        if (!touch || !touchStartAt) return;
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const elapsed = performance.now() - touchStartAt;
        touchStartAt = 0;

        const movesTowardPage = swipeDirection === 'left' ? deltaX < -72 : deltaX > 72;
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.35;
        if (movesTowardPage && isHorizontal && elapsed < 850) {
          window.location.assign(swipeHref);
        }
      }, { passive: true, signal });
    }

    updateProgress();
    configureMotion();
    window.addEventListener('scroll', scheduleProgress, { passive: true, signal });
    window.addEventListener('resize', scheduleProgress, { signal });
    reducedMotion.addEventListener('change', configureMotion, { signal });

    return () => {
      controller.abort();
      cancelAnimationFrame(progressFrame);
      revealObserver.disconnect();
    };
  });
};
