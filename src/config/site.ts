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
