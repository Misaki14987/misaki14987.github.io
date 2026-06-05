import { mountPageModule } from "../page-lifecycle";
import { initializeCodeBlocks } from "./code-blocks";
import { initializeFootnotes } from "./footnotes";
import { initializeHeadingNavigation } from "./heading-navigation";
import { initializeReadingControls } from "./reading-controls";

export const mountPostPage = () => {
  mountPageModule<HTMLElement>("[data-article-content]", (article) => {
    const controller = new AbortController();
    const { signal } = controller;

    initializeReadingControls(article, signal);
    const disconnectHeadingObserver = initializeHeadingNavigation(article, signal);
    initializeCodeBlocks(article, signal);
    const removeFootnotePreviews = initializeFootnotes(article, signal);

    return () => {
      controller.abort();
      disconnectHeadingObserver?.();
      removeFootnotePreviews();
    };
  });
};
