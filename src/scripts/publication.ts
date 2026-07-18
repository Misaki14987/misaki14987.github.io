import { getCollection, type CollectionEntry } from "astro:content";
import {
  absolutizeHtml,
  entryDescription,
  escapeXml,
  withTrailingSlash,
} from "./seo";
import { ENCRYPTED_PLACEHOLDER, isEncrypted } from "./encrypted";

export type PostEntry = CollectionEntry<"posts">;
export type PostTone = "build" | "theory" | "personal";

const toTime = (value: Date | string | undefined) =>
  value ? new Date(value).getTime() : 0;

const sortByNewest = (a: PostEntry, b: PostEntry) =>
  toTime(b.data.pubDate) - toTime(a.data.pubDate);

export const postPath = (postOrId: PostEntry | string) => {
  const id = typeof postOrId === "string" ? postOrId : postOrId.id;
  return withTrailingSlash(`/posts/${id}`);
};

export const getPublishedPosts = async () =>
  (await getCollection("posts"))
    .filter((post) => !post.data.draft)
    .sort(sortByNewest);

export const postSubtitle = (post: PostEntry) =>
  post.data.category ?? post.data.tags[0] ?? "";

export const postDescription = (post: PostEntry) =>
  isEncrypted(post) ? ENCRYPTED_PLACEHOLDER : entryDescription(post);

export const postTone = ({
  title,
  subtitle = "",
  tags = [],
}: {
  title: string;
  subtitle?: string;
  tags?: string[];
}): PostTone => {
  const subject = `${subtitle} ${tags.join(" ")} ${title}`.toLowerCase();

  if (/daily|生活|随笔|日常/.test(subject)) return "personal";
  if (/数学|math|linear|algebra|理论/.test(subject)) return "theory";
  return "build";
};

export const formatPostDate = (
  date: Date | string,
  format: "dot" | "han" = "dot",
) => {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  const machine = `${values.year}-${values.month}-${values.day}`;

  return {
    display:
      format === "han"
        ? `${values.year}年${values.month}月${values.day}日`
        : `${values.year}.${values.month}.${values.day}`,
    machine,
  };
};

export const getAllTags = (posts: PostEntry[]) =>
  [...new Set(posts.flatMap((post) => post.data.tags))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

export const toPostCard = (post: PostEntry) => ({
  title: post.data.title,
  subtitle: postSubtitle(post),
  image: post.data.cover,
  link: postPath(post),
  description: postDescription(post),
  pubDate: post.data.pubDate ? new Date(post.data.pubDate) : undefined,
  tags: post.data.tags,
});

export const getPostCards = (posts: PostEntry[]) => posts.map(toPostCard);

export const toRssItem = (post: PostEntry, site: string | URL) => ({
  title: post.data.title,
  pubDate: post.data.pubDate,
  description: postDescription(post),
  content: isEncrypted(post)
    ? undefined
    : post.rendered?.html
      ? absolutizeHtml(post.rendered.html, site)
      : undefined,
  link: postPath(post),
  categories: post.data.tags,
  customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
});
