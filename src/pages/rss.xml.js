import rss from '@astrojs/rss';
import { getPublishedPosts, toRssItem } from '../scripts/publication';
import { absoluteUrl, SITE_TITLE } from '../scripts/seo';

export async function GET(context) {
  const site = context.site;
  const posts = await getPublishedPosts();

  return rss({
    title: SITE_TITLE,
    description: 'M1saK1 Blog 全文订阅，包含文章正文、标签和作者信息。',
    site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    items: posts.map((post) => toRssItem(post, site)),
    customData: [
      `<language>zh-CN</language>`,
      `<atom:link href="${absoluteUrl('/rss.xml', site)}" rel="self" type="application/rss+xml" />`,
    ].join(''),
  });
}
