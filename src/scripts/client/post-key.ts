const STORAGE_PREFIX = 'post-key:';

export const storageKeyFor = (slug: string) => `${STORAGE_PREFIX}${slug}`;

export const readPostKey = (slug: string): string | null => {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    return sessionStorage.getItem(storageKeyFor(slug));
  } catch {
    return null;
  }
};

export const writePostKey = (slug: string, rawKey: string): void => {
  try {
    sessionStorage.setItem(storageKeyFor(slug), rawKey);
  } catch {
    /* sessionStorage 不可用 */
  }
};

const ERROR_SHAKE_MS = 420;

export const shakeAndReset = (
  shaken: HTMLElement,
  input: HTMLInputElement,
): void => {
  shaken.classList.add('is-error');
  window.setTimeout(() => shaken.classList.remove('is-error'), ERROR_SHAKE_MS);
  input.value = '';
  input.focus();
};
