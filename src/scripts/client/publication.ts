import { navigate } from 'astro:transitions/client';
import { mountPageModule } from './page-lifecycle';
import { turnBackTo } from './transitions';

/** Misaki Journal publication: scroll progress and swipe-to-turn. */
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const mountPublication = () => {
  mountPageModule<HTMLElement>('.publication', (root) => {
    const controller = new AbortController();
    const { signal } = controller;
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
          // Swiping right reveals the previous page, so it turns back.
          if (swipeDirection === 'right') turnBackTo(swipeHref);
          else navigate(swipeHref);
        }
      }, { passive: true, signal });
    }

    updateProgress();
    window.addEventListener('scroll', scheduleProgress, { passive: true, signal });
    window.addEventListener('resize', scheduleProgress, { signal });

    return () => {
      controller.abort();
      cancelAnimationFrame(progressFrame);
    };
  });
};
