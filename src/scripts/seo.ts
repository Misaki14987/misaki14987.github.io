export const SITE_TITLE = 'M1saK1 Blog';
export const DEFAULT_DESCRIPTION =
  'M1saK1 的个人博客'

const TRAILING_SLASH_FILE_RE = /\.[a-z0-9]+$/i;

export const withTrailingSlash = (path: string) => {
  if (!path || path === '/') return '/';
  if (path.endsWith('/') || TRAILING_SLASH_FILE_RE.test(path)) return path;
  return `${path}/`;
};

export const absoluteUrl = (pathOrUrl: string | URL | undefined, site: string | URL) => {
  const siteUrl = site instanceof URL ? site : new URL(site);
  if (!pathOrUrl) return siteUrl.href;

  const value = pathOrUrl instanceof URL ? pathOrUrl.href : pathOrUrl;
  if (/^[a-z][a-z\d+\-.]*:/i.test(value)) return value;

  return new URL(value, siteUrl).href;
};

export const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const textFromMarkdown = (markdown = '') =>
  markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const excerpt = (value = '', maxLength = 160) => {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/[，。！？、；：,.!?;:\s]+$/u, '')}...`;
};

export const entryDescription = (
  entry: { data?: { description?: string; summary?: string }; body?: string },
  fallback = DEFAULT_DESCRIPTION
) => {
  const explicit = entry.data?.description?.trim() || entry.data?.summary?.trim();
  if (explicit) return explicit;

  const generated = excerpt(textFromMarkdown(entry.body), 160);
  return generated || fallback;
};

export const absolutizeHtml = (html: string, site: string | URL) =>
  html.replace(/\s(href|src)=["']([^"']+)["']/gi, (match, attr, value) => {
    if (
      !value ||
      value.startsWith('#') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:') ||
      value.startsWith('data:')
    ) {
      return match;
    }

    return ` ${attr}="${absoluteUrl(value, site)}"`;
  });
