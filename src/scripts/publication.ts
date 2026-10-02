import { getCollection, type CollectionEntry } from 'astro:content';
import {
  absolutizeHtml,
  absoluteUrl,
  entryDescription,
  escapeXml,
  withTrailingSlash,
} from './seo';
import { storyKey } from './story-key';

export type PostEntry = CollectionEntry<'posts'>;
export type PostKind = PostEntry['data']['kind'];
export type PostTone = 'build' | 'theory' | 'personal';

export const staticPagePaths = ['/', '/about/', '/tags/'] as const;

const toTime = (value: Date | string | undefined) =>
  value ? new Date(value).getTime() : 0;

const sortByNewest = (a: PostEntry, b: PostEntry) =>
  toTime(b.data.pubDate) - toTime(a.data.pubDate);

export const postPath = (postOrId: PostEntry | string) => {
  const id = typeof postOrId === 'string' ? postOrId : postOrId.id;
  return withTrailingSlash(`/posts/${id}`);
};

export const storyNames = (id: string) => ({
  key: storyKey(id),
  cover: `--story-cover: story-cover-${storyKey(id)}`,
  title: `--story-title: story-title-${storyKey(id)}`,
});

export const tagPath = (tag: string) =>
  withTrailingSlash(`/tags/${encodeURIComponent(tag)}`);

export const getPublishedPosts = async (kind?: PostKind) =>
  (await getCollection('posts'))
    .filter(
      (post) =>
        !post.data.draft &&
        (!kind || post.data.kind === kind),
    )
    .sort(sortByNewest);

export const postSubtitle = (post: PostEntry) =>
  post.data.category ?? post.data.tags[0] ?? '';

export const postDescription = (post: PostEntry) => entryDescription(post);

export const postTone = ({
  title,
  subtitle = '',
  tags = [],
}: {
  title: string;
  subtitle?: string;
  tags?: string[];
}): PostTone => {
  const subject = `${subtitle} ${tags.join(' ')} ${title}`.toLowerCase();

  if (/daily|生活|随笔|日常/.test(subject)) return 'personal';
  if (/数学|math|linear|algebra|理论/.test(subject)) return 'theory';
  return 'build';
};

const CJK = /[぀-ヿ㐀-鿿]/g;

/** Words in prose, code excluded: each CJK character counts as one, as do Latin words. */
const proseCounts = (markdown: string) => {
  const prose = markdown.replace(/```[\s\S]*?```/g, '');
  const cjk = prose.match(CJK)?.length ?? 0;
  const words = prose.replace(CJK, ' ').match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return { cjk, words };
};

/** Rough estimate: ~400 CJK characters or ~200 Latin words per minute. */
export const readingMinutes = (markdown: string) => {
  const { cjk, words } = proseCounts(markdown);
  return Math.max(1, Math.round(cjk / 400 + words / 200));
};

/** The colophon's circulation line: issues, words and the founding date. */
export const siteStats = (posts: PostEntry[]) => {
  const words = posts.reduce((total, post) => {
    const counts = proseCounts(post.body ?? '');
    return total + counts.cjk + counts.words;
  }, 0);
  const founded = posts.reduce<Date | undefined>((earliest, post) => {
    const date = new Date(post.data.pubDate);
    return !earliest || date < earliest ? date : earliest;
  }, undefined);

  return {
    posts: posts.length,
    words: words >= 10000 ? `${(words / 10000).toFixed(1)} 万` : String(words),
    founded,
  };
};

export const formatPostDate = (
  date: Date | string,
  format: 'dot' | 'han' = 'dot',
) => {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(date));
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
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

export const toPostCard = (post: PostEntry) => ({
  id: post.id,
  title: post.data.title,
  subtitle: postSubtitle(post),
  image: post.data.cover,
  link: postPath(post),
  description: postDescription(post),
  pubDate: post.data.pubDate ? new Date(post.data.pubDate) : undefined,
  tags: post.data.tags,
  kind: post.data.kind,
  category: post.data.category,
});

export const getPostCards = (posts: PostEntry[]) => posts.map(toPostCard);

export const toRssItem = (post: PostEntry, site: string | URL) => ({
  title: post.data.title,
  pubDate: post.data.pubDate,
  description: postDescription(post),
  content: post.rendered?.html
    ? absolutizeHtml(post.rendered.html, site)
    : undefined,
  link: postPath(post),
  categories: post.data.tags,
  customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
});
