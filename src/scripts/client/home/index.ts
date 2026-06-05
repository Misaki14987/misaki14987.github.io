import { mountPageModule } from "../page-lifecycle";
import { initializeNoteTools } from "./note-tools";
import { initializeHomeScenes } from "./scenes";

export const mountHomePage = () => {
  mountPageModule<HTMLElement>("[data-home-scenes]", (root) => {
    const cleanupScenes = initializeHomeScenes(root);
    const cleanupNoteTools = initializeNoteTools(root);

    return () => {
      cleanupScenes();
      cleanupNoteTools?.();
    };
  });
};
