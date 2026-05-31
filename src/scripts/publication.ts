import { getCollection, type CollectionEntry } from 'astro:content';
import {
  absoluteUrl,
  absolutizeHtml,
  entryDescription,
  escapeXml,
  withTrailingSlash,
} from './seo';

export type PostEntry = CollectionEntry<'posts'>;

export const staticPagePaths = ['/', '/about/', '/tags/'] as const;

const toTime = (value: Date | string | undefined) =>
  value ? new Date(value).getTime() : 0;

const sortByNewest = (a: PostEntry, b: PostEntry) =>
  toTime(b.data.pubDate) - toTime(a.data.pubDate);

export const postPath = (postOrId: PostEntry | string) => {
  const id = typeof postOrId === 'string' ? postOrId : postOrId.id;
  return withTrailingSlash(`/posts/${id}`);
};

export const tagPath = (tag: string) =>
  withTrailingSlash(`/tags/${encodeURIComponent(tag)}`);

export const getPublishedPosts = async () =>
  (await getCollection('posts'))
    .filter((post) => !post.data.draft)
    .sort(sortByNewest);

export const postSubtitle = (post: PostEntry) =>
  post.data.category ?? post.data.tags[0] ?? '';

export const postDescription = (post: PostEntry) => entryDescription(post);

export const formatPostDate = (
  date: Date | string,
  format: 'dot' | 'han' = 'dot'
) => {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(date));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const machine = `${values.year}-${values.month}-${values.day}`;

  return {
    display:
      format === 'han'
        ? `${values.year}年${values.month}月${values.day}日`
        : `${values.year}.${values.month}.${values.day}`,
    machine,
  };
};

export const getAllTags = (posts: PostEntry[]) =>
  [...new Set(posts.flatMap((post) => post.data.tags))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));

export const getPostsByTag = (posts: PostEntry[], tag: string) =>
  posts.filter((post) => post.data.tags.includes(tag));

export const toPostCard = (
  post: PostEntry,
  options: { index?: number; total?: number } = {}
) => {
  const { index, total } = options;
  const entryId =
    typeof index === 'number' && typeof total === 'number'
      ? `[LOG-${String(total - index).padStart(3, '0')}]`
      : undefined;

  return {
    title: post.data.title,
    subtitle: postSubtitle(post),
    image: post.data.cover,
    link: postPath(post),
    description: postDescription(post),
    pubDate: post.data.pubDate ? new Date(post.data.pubDate) : undefined,
    tags: post.data.tags,
    entryId,
  };
};

export const getPostCards = (posts: PostEntry[]) =>
  posts.map((post, index, allPosts) =>
    toPostCard(post, { index, total: allPosts.length })
  );

export const toRssItem = (post: PostEntry, site: string | URL) => ({
  title: post.data.title,
  pubDate: post.data.pubDate,
  description: postDescription(post),
  content: post.rendered?.html ? absolutizeHtml(post.rendered.html, site) : undefined,
  link: postPath(post),
  categories: post.data.tags,
  customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
});

export const getSitemapEntries = (posts: PostEntry[], site: string | URL) => [
  ...staticPagePaths.map((path) => ({
    loc: absoluteUrl(path, site),
    changefreq: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? '1.0' : '0.6',
  })),
  ...getAllTags(posts).map((tag) => ({
    loc: absoluteUrl(tagPath(tag), site),
    changefreq: 'monthly',
    priority: '0.5',
  })),
  ...posts.map((post) => ({
    loc: absoluteUrl(postPath(post), site),
    lastmod: post.data.updatedDate ?? post.data.pubDate,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];
