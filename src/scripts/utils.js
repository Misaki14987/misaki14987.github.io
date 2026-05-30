import { getCollection } from 'astro:content';

const posts = await getCollection('posts');

const toTime = (value) => (value ? new Date(value).getTime() : 0);

const blogs = posts
  .map((post) => {
    const { title, category, tags, cover, description, pubDate } = post.data;
    return {
      title,
      subtitle: category ?? (tags.length ? tags[0] : ''),
      image: cover,
      link: `/posts/${post.id}`,
      description: description ?? '',
      pubDate: pubDate ? new Date(pubDate) : undefined,
      tags: tags ?? [],
    };
  })
  .sort((a, b) => toTime(b.pubDate) - toTime(a.pubDate))
  .map((blog, i, arr) => ({
    ...blog,
    entryId: `[LOG-${String(arr.length - i).padStart(3, '0')}]`,
  }));

export default blogs;
