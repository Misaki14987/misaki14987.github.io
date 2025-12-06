// 自动读取 posts 目录下的 Markdown 前言，生成博客列表数据
const posts = import.meta.glob('../pages/posts/*.md', { eager: true });

// 解析图片文件名，生成构建后的资源路径
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,svg,gif}', {
  eager: true,
  import: 'default',
});

const toTime = (value) => (value ? new Date(value).getTime() : 0);

const blogs = Object.entries(posts).map(([path, mod]) => {
  const frontmatter = mod.frontmatter ?? {};
  const slug = path.split('/').pop().replace(/\.md$/, '');
  const imagePath = frontmatter.image?.url ?? frontmatter.image;
  const imageName = imagePath ? imagePath.split('/').pop() : undefined;

  return {
    title: frontmatter.title ?? slug,
    subtitle:
      frontmatter.subtitle ??
      frontmatter.category ??
      (frontmatter.tags ? frontmatter.tags[0] : ''),
    image: imageName ? images[`../assets/${imageName}`] ?? imagePath : undefined,
    link: `/posts/${slug}`,
    description: frontmatter.description ?? '',
    pubDate: frontmatter.pubDate ? new Date(frontmatter.pubDate) : undefined,
  };
}).sort((a, b) => toTime(b.pubDate) - toTime(a.pubDate));

export default blogs;
