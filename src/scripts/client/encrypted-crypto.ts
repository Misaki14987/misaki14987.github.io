import { fromBase64, toBase64 } from "../base64";

const ITERATIONS = 100_000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const deriveKey = async (
  password: string,
  saltB64: string,
  iterations: number = ITERATIONS,
): Promise<CryptoKey> => {
  const salt = fromBase64(saltB64);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"],
  );
};

export const decryptString = async (
  key: CryptoKey,
  ivB64: string,
  ciphertextB64: string,
): Promise<string> => {
  const iv = fromBase64(ivB64);
  const ciphertext = fromBase64(ciphertextB64);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return decoder.decode(plain);
};

export const exportRawKey = async (key: CryptoKey): Promise<string> => {
  const raw = await crypto.subtle.exportKey("raw", key);
  return toBase64(raw);
};

export const importRawKey = async (rawB64: string): Promise<CryptoKey> => {
  const raw = fromBase64(rawB64);
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
};
