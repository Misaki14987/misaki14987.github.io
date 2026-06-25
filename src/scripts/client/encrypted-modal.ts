import { mountPageModule } from "./page-lifecycle";
import {
  decryptString,
  deriveKey,
  exportRawKey,
} from "./encrypted-crypto";
import { shakeAndReset, writePostKey } from "./post-key";

type CardMeta = {
  slug: string;
  link: string;
  salt: string;
  iv: string;
  verify: string;
  iterations: number;
};

export const mountEncryptedModal = () => {
  mountPageModule<HTMLElement>('[data-encrypted-modal]', (modal) => {
    const backdrop = modal.querySelector<HTMLElement>('[data-encrypted-backdrop]');
    const card = modal.querySelector<HTMLElement>('[data-encrypted-card]');
    const closeBtn = modal.querySelector<HTMLButtonElement>('[data-encrypted-close]');
    const form = modal.querySelector<HTMLFormElement>('[data-encrypted-form]');
    const input = modal.querySelector<HTMLInputElement>('[data-encrypted-input]');
    const error = modal.querySelector<HTMLElement>('[data-encrypted-error]');
    const hint = modal.querySelector<HTMLElement>('[data-encrypted-hint]');

    if (!backdrop || !card || !closeBtn || !form || !input || !error || !hint) {
      return;
    }

    let current: CardMeta | null = null;
    let lastFocused: HTMLElement | null = null;
    let busy = false;

    const open = (meta: CardMeta, title: string) => {
      current = meta;
      lastFocused = document.activeElement as HTMLElement;
      hint.textContent = '输入密码以阅读'
      error.hidden = true;
      input.value = '';
      modal.hidden = false;
      requestAnimationFrame(() => {
        modal.classList.add('is-open');
      });
      window.setTimeout(() => input.focus(), 80);
    };

    const close = () => {
      if (busy) return;
      modal.classList.remove('is-open');
      window.setTimeout(() => {
        modal.hidden = true;
        current = null;
      }, 220);
      lastFocused?.focus?.();
    };

    const onCardClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-encrypted-link]',
      );
      if (!link) return;
      const cardEl = link.closest<HTMLElement>('[data-encrypted-meta]');
      if (!cardEl) return;
      const raw = cardEl.getAttribute('data-encrypted-meta');
      if (!raw) return;
      event.preventDefault();
      const meta = JSON.parse(raw) as CardMeta;
      const title = cardEl.getAttribute('data-encrypted-title') || '';
      open(meta, title);
    };

    document.addEventListener('click', onCardClick, { capture: true });
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) close();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!current || busy) return;
      busy = true;
      error.hidden = true;
      const password = input.value;
      try {
        const key = await deriveKey(password, current.salt, current.iterations);
        const ok = await decryptString(key, current.iv, current.verify);
        if (ok !== 'OK') throw new Error('mismatch');
        const raw = await exportRawKey(key);
        writePostKey(current.slug, raw);
        hint.textContent = 'ああああああああああ';
        form.hidden = true;
        const target = current.link;
        window.setTimeout(() => {
          window.location.href = target;
        }, 360);
      } catch {
        busy = false;
        error.hidden = false;
        form.hidden = false;
        hint.textContent = '叮不到咚鸡吗';
        shakeAndReset(modal, input);
      }
    });

    return () => {
      document.removeEventListener('click', onCardClick, { capture: true } as EventListenerOptions);
    };
  });
};
