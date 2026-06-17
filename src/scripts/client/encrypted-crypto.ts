const ITERATIONS = 100_000;

const fromBase64 = (b64: string): Uint8Array => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const deriveKey = async (
  password: string,
  saltB64: string,
  iterations: number = ITERATIONS,
): Promise<CryptoKey> => {
  const salt = fromBase64(saltB64);
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt'],
  );
};

export const decryptString = async (
  key: CryptoKey,
  ivB64: string,
  ciphertextB64: string,
): Promise<string> => {
  const iv = fromBase64(ivB64);
  const ciphertext = fromBase64(ciphertextB64);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return decoder.decode(plain);
};

export const exportRawKey = async (key: CryptoKey): Promise<string> => {
  const raw = await crypto.subtle.exportKey('raw', key);
  const bytes = new Uint8Array(raw);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const importRawKey = async (rawB64: string): Promise<CryptoKey> => {
  const raw = fromBase64(rawB64);
  return crypto.subtle.importKey(
    'raw',
    raw,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
};
