export const SITE_CONFIG = {
  title: 'M1saK1 Blog',
  description: 'M1saK1 的技术博客，记录软件开发、工程实践与项目复盘。',
  identity: 'M1saK1',
  identityLabel: 'M1saK1 Blog 首页',
  nav: [
    { href: '/', index: '01', label: 'Articles' },
    { href: '/about/', index: '02', label: 'Profile' },
    { href: 'https://learn.yodelist.icu/', index: '03', label: 'Learn' },
  ],
} as const;

export const SITE_TITLE = SITE_CONFIG.title;
export const DEFAULT_DESCRIPTION = SITE_CONFIG.description;

export const CONTACT_LINKS = [
  { label: 'GitHub', icon: 'github', href: 'https://github.com/Misaki14987', external: true },
  { label: 'Bilibili', icon: 'bilibili', href: 'https://space.bilibili.com/M1saK1', external: true },
  { label: 'X', icon: 'x', href: 'https://x.com/LianiuMis', external: true },
  { label: '邮箱', icon: 'mail', href: 'mailto:yodelmisaki@gmail.com', external: false },
  { label: 'RSS', icon: 'rss', href: '/rss.xml', external: false },
] as const;

/** 读者来信: giscus comments, stored as GitHub Discussions on the blog repository. */
export const COMMENTS_CONFIG = {
  repo: 'Misaki14987/misaki14987.github.io',
  repoId: 'R_kgDOUBbkag',
  // Only maintainers and giscus can open discussions in Announcements, so strangers can't spam the repo.
  category: 'Announcements',
  categoryId: 'DIC_kwDOUBbkas4DG3UY',
} as const;
