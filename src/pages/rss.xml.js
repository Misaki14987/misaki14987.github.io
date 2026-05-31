import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { absoluteUrl, absolutizeHtml, entryDescription } from '../scripts/seo';

const toTime = (value) => (value ? new Date(value).getTime() : 0);

export async function GET(context) {
  const site = context.site;
  const posts = (await getCollection('posts'))
    .sort((a, b) => toTime(b.data.pubDate) - toTime(a.data.pubDate));

  return rss({
    title: 'M1saK1 Blog',
    description: 'M1saK1 Blog 全文订阅',
    site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: entryDescription(post),
      content: post.rendered?.html ? absolutizeHtml(post.rendered.html, site) : undefined,
      link: `/posts/${post.id}`,
      categories: post.data.tags,
      customData: `<dc:creator>${post.data.author}</dc:creator>`,
    })),
    customData: [
      `<language>zh-CN</language>`,
      `<atom:link href="${absoluteUrl('/rss.xml', site)}" rel="self" type="application/rss+xml" />`,
    ].join(''),
  });
}
