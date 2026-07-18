import { mountPageModule } from "../page-lifecycle";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const initializeHomeMotion = () => {
  mountPageModule<HTMLElement>("[data-home-motion]", (root) => {
    const hero = root.querySelector<HTMLElement>("[data-home-hero]");
    if (!hero) return;

    const authorMark =
      hero.querySelector<HTMLButtonElement>("[data-author-mark]");
    const stamp = hero.querySelector<HTMLElement>("[data-batch-stamp]");
    const sections = root.querySelectorAll<HTMLElement>("[data-print-section]");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let activationCount = 0;
    let activationStarted = 0;
    let stampTimer = 0;
    let registrationTimer = 0;
    let entranceTimer = 0;

    root.classList.add("is-motion-enabled");

    const align = () => {
      hero.style.setProperty("--reg-x", "0px");
      hero.style.setProperty("--reg-y", "0px");
    };

    const updateFeed = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const progress = reducedMotion.matches
        ? 0
        : clamp(-rect.top / rect.height);
      hero.style.setProperty("--hero-shift", `${progress * 48}px`);
      hero.style.setProperty("--hero-copy-shift", `${progress * -24}px`);
      hero.style.setProperty("--hero-crop", `${progress * 6}%`);
    };

    const requestFeedUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateFeed);
    };

    const register = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      const limit = innerWidth <= 1200 ? 6 : 8;
      const x =
        clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1) *
        limit;
      const y =
        clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1) *
        limit;
      hero.style.setProperty("--reg-x", `${x.toFixed(2)}px`);
      hero.style.setProperty("--reg-y", `${y.toFixed(2)}px`);
    };

    const activateStamp = () => {
      const now = performance.now();
      if (now - activationStarted > 900) {
        activationStarted = now;
        activationCount = 1;
        return;
      }

      activationCount += 1;
      if (activationCount < 3 || !stamp) return;

      activationCount = 0;
      stamp.classList.add("is-stamped");
      clearTimeout(stampTimer);
      stampTimer = window.setTimeout(
        () => stamp.classList.remove("is-stamped"),
        1400,
      );
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                if (observer === null) return;
                (entry.target as HTMLElement).classList.add("is-printed");
                observer.unobserve(entry.target);
              });
            },
            { threshold: 0.2 },
          )
        : null;

    sections.forEach((section) =>
      observer
        ? observer.observe(section)
        : section.classList.add("is-printed"),
    );
    hero.classList.add("is-registering");
    hero.style.setProperty("--reg-x", `${innerWidth <= 1200 ? 6 : 8}px`);
    hero.style.setProperty("--reg-y", "-6px");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        entranceTimer = window.setTimeout(
          () => {
            align();
            registrationTimer = window.setTimeout(
              () => hero.classList.remove("is-registering"),
              680,
            );
          },
          reducedMotion.matches ? 0 : 120,
        );
      }),
    );
    updateFeed();

    hero.addEventListener("pointermove", register, { passive: true });
    hero.addEventListener("pointerleave", align);
    window.addEventListener("pointerup", align, { passive: true });
    window.addEventListener("scroll", requestFeedUpdate, { passive: true });
    window.addEventListener("resize", requestFeedUpdate, { passive: true });
    reducedMotion.addEventListener("change", requestFeedUpdate);
    authorMark?.addEventListener("click", activateStamp);

    return () => {
      root.classList.remove("is-motion-enabled");
      observer?.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(stampTimer);
      clearTimeout(registrationTimer);
      clearTimeout(entranceTimer);
      hero.removeEventListener("pointermove", register);
      hero.removeEventListener("pointerleave", align);
      window.removeEventListener("pointerup", align);
      window.removeEventListener("scroll", requestFeedUpdate);
      window.removeEventListener("resize", requestFeedUpdate);
      reducedMotion.removeEventListener("change", requestFeedUpdate);
      authorMark?.removeEventListener("click", activateStamp);
    };
  });
};
