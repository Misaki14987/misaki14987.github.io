import { getPublishedPosts, getSitemapEntries } from '../scripts/publication';
import { escapeXml } from '../scripts/seo';

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
  const urls = getSitemapEntries(await getPublishedPosts(), site);

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
