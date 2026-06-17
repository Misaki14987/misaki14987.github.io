import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CollectionEntry } from 'astro:content';

/**
 * 构建时加密工具。Web Crypto API，Node 与浏览器通用。
 * 每篇文章独立 salt + 派生密钥（PBKDF2 / SHA-256 / 100k 轮），AES-GCM 256。
 *
 * 密码不写在 frontmatter 里（frontmatter 只用 password: true 标记）。
 * 真实密码从两个来源读取，环境变量优先，找不到则构建报错：
 *   1. 环境变量 BLOG_POST_PASSWORDS：JSON 字符串 { "post-id": "password" }，CI 部署时注入。
 *   2. 本地文件 src/content/passwords.json：同样结构，已被 .gitignore 排除，仅本地构建用。
 */

const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

const encoder = new TextEncoder();

const toBase64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const isEncrypted = (post: { data?: { password?: boolean } }) =>
  Boolean(post.data?.password);

type PasswordMap = Record<string, string>;

let passwordMapCache: PasswordMap | null = null;

const loadPasswordMap = (): PasswordMap => {
  if (passwordMapCache) return passwordMapCache;

  const fromEnv = process.env.BLOG_POST_PASSWORDS;
  if (fromEnv) {
    try {
      passwordMapCache = JSON.parse(fromEnv) as PasswordMap;
      return passwordMapCache;
    } catch {
      throw new Error(
        'BLOG_POST_PASSWORDS 环境变量不是合法的 JSON。期望格式: {"post-id": "password"}',
      );
    }
  }

  // 本地构建：读 src/content/passwords.json（相对项目根目录）
  const localPath = resolve(process.cwd(), 'src/content/passwords.json');
  try {
    const raw = readFileSync(localPath, 'utf-8');
    passwordMapCache = JSON.parse(raw) as PasswordMap;
    return passwordMapCache;
  } catch {
    throw new Error(
      `找不到加密文章的密码源。\n` +
        `本地构建：请创建 src/content/passwords.json（参考 passwords.example.json）。\n` +
        `CI 部署：请设置 BLOG_POST_PASSWORDS 环境变量 / GitHub Secret。`,
    );
  }
};

const getPostPassword = (postId: string): string => {
  const map = loadPasswordMap();
  const password = map[postId];
  if (!password) {
    throw new Error(
      `文章 "${postId}" 标记了 password: true，但在密码源中找不到对应的密码。\n` +
        `请在 src/content/passwords.json 或 BLOG_POST_PASSWORDS 中添加: "${postId}": "你的密码"`,
    );
  }
  return password;
};

const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
};

type KeyEntry = { salt: Uint8Array; key: CryptoKey };
const keyCache = new Map<string, KeyEntry>();

const getKey = async (post: CollectionEntry<'posts'>): Promise<KeyEntry> => {
  const cached = keyCache.get(post.id);
  if (cached) return cached;
  const password = getPostPassword(post.id);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await deriveKey(password, salt);
  const entry: KeyEntry = { salt, key };
  keyCache.set(post.id, entry);
  return entry;
};

export interface EncryptedContent {
  salt: string;
  iv: string;
  ciphertext: string;
  iterations: number;
}

export interface EncryptedVerify {
  salt: string;
  iv: string;
  verify: string;
  iterations: number;
}

/** 加密正文 HTML，用于文章页。同一篇文章在本次构建中复用 salt 与派生密钥。 */
export const encryptContent = async (
  post: CollectionEntry<'posts'>,
  html: string,
): Promise<EncryptedContent> => {
  const { salt, key } = await getKey(post);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(html),
  );
  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
    iterations: ITERATIONS,
  };
};

/** 加密一个校验令牌，用于列表页模态框验密码。不暴露正文密文。 */
export const encryptVerify = async (
  post: CollectionEntry<'posts'>,
): Promise<EncryptedVerify> => {
  const { salt, key } = await getKey(post);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const verify = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode('OK'),
  );
  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    verify: toBase64(verify),
    iterations: ITERATIONS,
  };
};

export const ENCRYPTED_PLACEHOLDER = '这篇日记已加密。';

export { isEncrypted };
