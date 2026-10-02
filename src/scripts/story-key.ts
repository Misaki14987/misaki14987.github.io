/** CSS-ident-safe key so a story's cover and headline can morph between pages. */
export const storyKey = (id: string) =>
  id.replace(/[^a-zA-Z0-9_-]/g, (char) => `_${char.codePointAt(0)!.toString(16)}`);

/** The post id from a `/posts/<id>/` path, if it is one. */
export const storyIdFromPath = (pathname: string) => {
  const match = pathname.match(/^\/posts\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : undefined;
};
