import bloginfo from '../assets/bloginfo.json';

// 解析 JSON 中的图片文件名，生成对应的构建后资源路径
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  import: 'default',
});

const blogs = bloginfo.map((entry) => ({
  ...entry,
  image: entry.image ? images[`../assets/${entry.image}`] : undefined,
}));

export default blogs;
