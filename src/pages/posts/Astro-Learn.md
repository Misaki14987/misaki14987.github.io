---
layout: ../../layouts/MarkdownLayout.astro
title: 'Astro 学习笔记 1'
pubDate: 2025-09-23
description: '记录学习 Astro 框架的过程和心得。1'
author: 'M1saK1'
category: 'Learning Notes'
image:
url: 'src/assets/astro.png'
alt: 'Astro Logo'
tags: ['Frontend', 'Astro', 'Web Development']
---

# Astro 学习笔记

Astro 是一个前端开发框架，可以用来快速搭建一些中小规模的网站（博客使用 astro 搭建）。

## Why Astro?

Astro 在我的理解中是一个适合用来构建像博客这样的静态网站的框架。官网介绍的就是我们 Astro 是**Content-driven**,内容优先。

Astro 可以非常好的自兼容 **Markdown** 和 **MDX**，可以兼容各种框架如 **React**, **Vue**，如果有团队开发大家写不一样的屎也无妨。

Astro 可以让开发者自控制渲染过程，优化性能。Astro 优先静态，这就使得其非常适合这种如博客这样的简单网站

> 接下来就介绍一下我学习 Astro 的一些心得和过程

## Astro 的安装

Very Simple,先确保你有 Nodejs 环境

```bash
# 使用 npm 创建一个新的 Astro 项目
npm create astro@latest
# 进入项目目录
cd your-project-name
# 安装依赖
npm install
# 启动开发服务器
npm run dev
```

使用其他的包管理器同理

## 什么是群岛架构？

先介绍一下 Astro 的核心概念之一 **群岛架构(Island Architecture)**

简单来讲就是你的页面是一个大海，大海里占大多数的是不动的海面(静态的 HTML)，偶尔有几个小岛屿会动(动态的 JS 组件)。而 Astro 优先渲染海面部分(SSR)，再去渲染动态的岛屿(JS)。这样既能够保证页面的静态性能，让用户点开网站就能迅速的看到主体内容，又能在需要的时候再去提供动态的交互，也避免了让整个页面变成沉重的单页应用(SPA)。

## Astro 的项目结构

Astro 的项目结构非常简单，主要有以下几个部分：

```
astro-project/
├── public/             # 静态资源文件夹，存放图片、字体等
├── src/                # 源代码文件夹
│   ├── components/    # 组件文件夹，存放可复用的 UI 组件
│   ├── layouts/       # 布局文件夹，存放页面布局
│   ├── pages/         # 页面文件夹，存放网站的各个页面
│   ├── styles/        # 样式文件夹，存放全局
│   └── scripts/       # 脚本文件夹，存放全局脚本
├── astro.config.mjs   # Astro 配置文件
├── package.json       # 项目依赖和脚本
└── tsconfig.json      # TypeScript 配置文件（如果使用 TypeScript）
```

`src/pages` 目录下的文件会自动映射为网站的路由，请确保你有这个目录。
其他的目录是约定俗成。
astro.config.mjs 的相关配置后面再写）

## Astro 的基本语法

Astro 是基于组件进行开发的，文件的后缀名为`.astro`。
Astro 的语法很简单，主要有三种部分：

1. **组件导入**：用来导入其他组件，写在两个`---` 之间。
2. **前端脚本**：用来处理数据和逻辑，写在两个`---` 之间。
3. **模板部分**：用来渲染 HTML，写在 `---` 之后。
   具体例子如下

```astro
---
import Header from '../components/Header.astro';
const title = 'Hello, Astro!';
---
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <Header />
    <h1>{title}</h1>
    <p>Welcome to my Astro site.</p>
  </body>
</html>
```

如你所见，就是简单的 HTML, 配上一些模板语法，比如 `{}` 来插入变量，`<Component />` 来使用组件。如果你写过 React 或 Vue，应该会觉得很熟悉。

暂时写到这里

## 参考资料

- [Astro 官方文档](https://docs.astro.build/zh/)
