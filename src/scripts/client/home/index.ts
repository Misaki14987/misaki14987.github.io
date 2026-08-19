import { mountPageModule } from "../page-lifecycle";
import { initializeNoteTools } from "./note-tools";
import { initializeHomeScenes } from "./scenes";
import { initializeHeroField } from "./visual";

export const mountHomePage = () => {
  mountPageModule<HTMLElement>("[data-home-scenes]", (root) => {
    const cleanupScenes = initializeHomeScenes(root);
    const cleanupNoteTools = initializeNoteTools(root);
    const cleanupHeroField = initializeHeroField(root);

    return () => {
      cleanupScenes();
      cleanupNoteTools?.();
      cleanupHeroField();
    };
  });
};
