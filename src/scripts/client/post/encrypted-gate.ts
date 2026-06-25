import { mountPageModule } from "../page-lifecycle";
import {
  decryptString,
  deriveKey,
  exportRawKey,
  importRawKey,
} from "../encrypted-crypto";
import { readPostKey, shakeAndReset, writePostKey } from "../post-key";
import { initializePostContent } from "./index";

type Payload = {
  slug: string;
  salt: string;
  iv: string;
  ciphertext: string;
  iterations: number;
};

export const mountEncryptedGate = () => {
  mountPageModule<HTMLElement>('[data-encrypted-gate]', (gate) => {
    const payloadEl = document.querySelector<HTMLScriptElement>(
      '[data-encrypted-payload]',
    );
    if (!payloadEl) return;

    const payload = JSON.parse(payloadEl.textContent || '{}') as Payload;

    const form = gate.querySelector<HTMLFormElement>('[data-encrypted-form]');
    const input = gate.querySelector<HTMLInputElement>('[data-encrypted-input]');
    const error = gate.querySelector<HTMLElement>('[data-encrypted-error]');
    const stage = document.querySelector<HTMLElement>('[data-encrypted-stage]');
    const content = document.querySelector<HTMLElement>('[data-encrypted-content]');
    if (!form || !input || !error || !content) return;

    let contentController: AbortController | null = null;

    const reveal = (html: string) => {
      content.innerHTML = html;
      contentController?.abort();
      contentController = new AbortController();
      initializePostContent(content, contentController.signal);

      gate.classList.add('is-unlocked');
      content.classList.add('is-revealed');
      content.hidden = false;
      window.setTimeout(() => {
        gate.hidden = true;
      }, 320);
    };

    const attempt = async (password: string): Promise<string | null> => {
      try {
        const key = await deriveKey(password, payload.salt, payload.iterations);
        const html = await decryptString(key, payload.iv, payload.ciphertext);
        const raw = await exportRawKey(key);
        writePostKey(payload.slug, raw);
        return html;
      } catch {
        return null;
      }
    };

    void (async () => {
      const stored = readPostKey(payload.slug);
      if (!stored) return;
      try {
        const key = await importRawKey(stored);
        const html = await decryptString(key, payload.iv, payload.ciphertext);
        reveal(html);
      } catch {
        //114514
      }
    })();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      error.hidden = true;
      const password = input.value;
      if (!password) return;
      const html = await attempt(password);
      if (html) {
        reveal(html);
      } else {
        error.hidden = false;
        shakeAndReset(gate, input);
      }
    });

    return () => {
      contentController?.abort();
    };
  });
};
