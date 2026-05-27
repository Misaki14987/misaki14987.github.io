#!/usr/bin/env node

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const title = process.argv[2];

if (!title) {
  console.error('Usage: pnpm new "文章标题"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\u4e00-\u9fff-]/g, '');

const dir = join('src', 'content', 'posts', slug);

if (existsSync(dir)) {
  console.error(`Already exists: ${dir}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const frontmatter = `---
title: '${title}'
pubDate: ${today}
author: 'M1saK1'
description: ''
tags: []
---

# ${title}
`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.md'), frontmatter);
console.log(`Created: ${dir}/index.md`);
