import { mountPageModule } from "../page-lifecycle";
import { initializeCodeBlocks } from "./code-blocks";
import { initializeFootnotes } from "./footnotes";
import { initializeHeadingNavigation } from "./heading-navigation";
import { initializeReadingControls } from "./reading-controls";

export const initializePostContent = (article: HTMLElement, signal: AbortSignal) => {
  initializeReadingControls(article, signal);
  const disconnectHeadingObserver = initializeHeadingNavigation(article, signal);
  initializeCodeBlocks(article, signal);
  const removeFootnotePreviews = initializeFootnotes(article, signal);

  return () => {
    disconnectHeadingObserver?.();
    removeFootnotePreviews?.();
  };
};

export const mountPostPage = () => {
  mountPageModule<HTMLElement>("[data-article-content]", (article) => {
    const controller = new AbortController();
    const { signal } = controller;

    const cleanup = initializePostContent(article, signal);

    return () => {
      controller.abort();
      cleanup();
    };
  });
};
