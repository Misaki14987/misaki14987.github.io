export type SiteVariant = 'blog' | 'learning';

const requestedVariant = import.meta.env.SITE_VARIANT;

export const SITE_VARIANT: SiteVariant =
  requestedVariant === 'learning' ? 'learning' : 'blog';

const configs = {
  blog: {
    title: 'M1saK1 Blog',
    description: 'M1saK1 的技术博客，记录软件开发、工程实践与项目复盘。',
    identity: 'M1saK1',
    identityLabel: 'M1saK1 Blog 首页',
    loaderKicker: 'M1SAK1 JOURNAL',
    nav: [
      { href: '/', index: '01', label: 'Articles' },
      { href: '/about/', index: '02', label: 'Profile' },
      { href: 'https://learn.yodelist.icu/', index: '03', label: 'Learn' },
    ],
    home: {
      topline: 'Bright ideas',
      headline: ['M1SAK1', 'SPARKLING', 'NOTES'],
      eyebrow: '怡泉大好き',
      browseLabel: '浏览全部文章',
      archiveTitle: '技术文章',
      archiveLinkLabel: '查看标签',
      filters: [],
    },
  },
  learning: {
    title: 'M1saK1 Learn',
    description: 'M1saK1 的电子与数学学习笔记，记录推导、概念联系与理解过程。',
    identity: 'M1saK1 / Learn',
    identityLabel: 'M1saK1 Learn 首页',
    loaderKicker: 'M1SAK1 LEARNING LOG',
    nav: [
      { href: '/', index: '01', label: 'Notes' },
      { href: '/tags/', index: '02', label: 'Index' },
      { href: 'https://blog.yodelist.icu/', index: '03', label: 'Blog' },
    ],
    home: {
      topline: 'Study traces',
      headline: ['M1SAK1', 'LEARNING', 'NOTES'],
      eyebrow: '从直觉到推导',
      browseLabel: '浏览全部笔记',
      archiveTitle: '学习笔记',
      archiveLinkLabel: '按主题浏览',
      filters: [
        { value: '', label: '全部' },
        { value: 'theory', label: '数学' },
        { value: 'build', label: '电子' },
      ],
    },
  },
} as const;

export const SITE_CONFIG = configs[SITE_VARIANT];
export const SITE_TITLE = SITE_CONFIG.title;
export const DEFAULT_DESCRIPTION = SITE_CONFIG.description;
