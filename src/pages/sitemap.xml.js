import { getCollection } from 'astro:content';
import { absoluteUrl, escapeXml } from '../scripts/seo';

const staticPages = ['/', '/about/', '/tags/'];
const toTime = (value) => (value ? new Date(value).getTime() : 0);

const urlEntry = ({ loc, lastmod, changefreq, priority }) => [
  '  <url>',
  `    <loc>${escapeXml(loc)}</loc>`,
  lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
  changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
  priority ? `    <priority>${priority}</priority>` : '',
  '  </url>',
].filter(Boolean).join('\n');

export async function GET(context) {
  const site = context.site;
  const posts = (await getCollection('posts'))
    .sort((a, b) => toTime(b.data.pubDate) - toTime(a.data.pubDate));
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];

  const urls = [
    ...staticPages.map((path) => ({
      loc: absoluteUrl(path, site),
      changefreq: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? '1.0' : '0.6',
    })),
    ...tags.map((tag) => ({
      loc: absoluteUrl(`/tags/${encodeURIComponent(tag)}/`, site),
      changefreq: 'monthly',
      priority: '0.5',
    })),
    ...posts.map((post) => ({
      loc: absoluteUrl(`/posts/${post.id}/`, site),
      lastmod: post.data.pubDate,
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(urlEntry),
    '</urlset>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
