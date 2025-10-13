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

Astro 是一个前端开发框架，可以用来快速搭建一些中小规模的网站（本博客使用 astro 搭建）。

## 前言

在阅读之前，建议已经有一定的前端基础，了解 HTML, CSS, JavaScript, 以及至少一种前端框架（如 React, Vue 等）。

## Why Astro?

Astro 在我的理解中是一个适合用来构建像博客这样的静态网站的框架。官网介绍的 Astro 是**Content-driven**

Astro 可以非常好的自兼容 **Markdown** 和 **MDX**，可以兼容各种框架如 **React**, **Vue**，如果有团队开发大家写不一样的屎也无妨。

Astro 可以让开发者自控制渲染过程，优化性能。Astro 优先生成静态页面(SSG)，这就使得其非常适合这种如博客这样的简单网站

## Astro 的安装

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

使用其他的包管理器同理(其实我喜欢 bun)

## 什么是群岛架构？

先介绍一下 Astro 的核心概念之一 **群岛架构(Island Architecture)**

简单来讲就是页面是一个大海，大海里占大多数的是不动的海面(静态的 HTML)，偶尔有几个小岛屿会动(动态的 JS 组件)。而 Astro 优先渲染海面部分，再去渲染动态的岛屿(JS)。这样既能够保证页面的静态性能，让用户点开网站就能迅速的看到主体内容，又能在需要的时候再去提供动态的交互，也避免了让整个页面变成沉重的单页应用(SPA)。

比如说有一个组件 `<Counter />`，它是一个动态的计数器组件：

```astro
---
import Counter from '../components/Counter.astro';
---
<html>
  <head>
    <title>My Astro Site</title>
  </head>
  <body>
    <h1>Welcome to my Astro site</h1>
    <Counter client:load /> <!-- 只有这个组件会被加载 JS -->
  </body>
</html>
```

这里的 `client:load` 指令告诉 Astro 这个组件需要在客户端加载 JavaScript。这样，只有这个计数器组件会有动态行为，而其他部分仍然是静态的 HTML。

## Astro 的项目结构

Astro 的项目结构一般有以下几个部分：

```
astro-project/
├── public/             # 静态资源文件夹，存放图片、字体等
├── src/                # 源代码文件夹
│   ├── components/    # 组件文件夹，存放可复用的 UI 组件
│   ├── layouts/       # 布局文件夹，存放页面布局
│   ├── pages/         # 页面文件夹，存放网站的各个页面
│   ├── styles/        # 样式文件夹，存放全局样式
│   └── scripts/       # 脚本文件夹，存放全局脚本
├── astro.config.mjs   # Astro 配置文件
├── package.json       # 项目依赖和脚本
└── tsconfig.json      # TypeScript 配置文件（如果使用 TypeScript）
```

`src/pages` 目录下的文件会自动映射为网站的路由，其他的目录是约定俗成。

## Astro 配置

Astro 的配置文件为 `astro.config.mjs`, 我常用的配置项如下:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'blog.yodelist.icu', // 你的网站地址,Astro 会用这个来生成sitemap(站点地图,可以帮助搜索引擎更好地索引你的网站)
  server: {
    port: 1145, // 开发服务器端口
    host: true, // 是否监听所有网络接口 or [custom-address]
    allowedHosts: ['hachimi.yodelist.icu'], // 允许访问的主机名
    headers: {
      // 自定义响应头
      'Custom-Header': 'MyCustomHeaderValue',
    },
  },
  markdown: {
    syntaxHighlight: 'prism', // 语法高亮,可以选择 'prism' 或 'shiki'
    remarkPlugins: [], // 你可以在这里添加 remark 插件
    rehypePlugins: [], // 你可以在这里添加 rehype 插件
  },
  integrations: [
    // 这里可以添加各种集成插件，比如 Tailwind CSS, React, Partydown 等等
  ],
  vite: {
    // 这里可以添加 Vite 的配置,不需要在vite.config.js中重复配置
  },
});
```

还有许多选项可以来优化开发构建过程和网站性能,具体配置项可以参考[官方文档](https://docs.astro.build/zh-cn/reference/configuration-reference/)

## Astro 模板语法

Astro 的语法是一种类 JSX 的语法，比如

```astro
---
//这一部分是JS区域,可以写任何JS代码
import Layout from '../layouts/Layout.astro';
import MyComponent from '../components/MyComponent.astro';
const title = 'Hello, Astro!';
const items = ['Item 1', 'Item 2', 'Item 3'];
function handleClick() {
  alert('button clicked！');
}
---
<!-- 这一部分是 HTML 区域，可以写 HTML 和 Astro 语法 -->
<Layout> <!-- 组件化 -->
  <h1>Hello {title}</h1> <!-- 使用花括号插入变量 -->
  <MyComponent someProp={`My title is: ${title}`} /> <!-- 动态属性 -->
  <button onClick={handleClick}>I won't do anything when you click me</button> <!-- 但不能这样，Astro这里会将花括号中的内容视为文本,如果需要在这里使用事件处理函数，可以将其提取到组件中，也可以正常的写JS操作dom -->
  {items.map((item) => (
    <div>{item}</div>
  ))} <!-- 列表动态渲染 -->
  { true && <p>This will be rendered</p> } <!-- 条件渲染 -->
</Layout>
```

#### 工具函数

`Astro.props` 用来访问传递给组件的属性

```astro
---
const { title, content } = Astro.props; // 解构传递的属性
---
<h1>{title}</h1> <!-- 使用传递的属性 -->
<p>{content}</p>
```

---

`Astro.slots`是一组用来修改组件的插槽内容(<slot />)的工具函数

```astro
---
const HTML = Astro.slots.render('default'); //这里可以把插槽的内容渲染成字符串,用处不大
---
<slot />

{ Astro.slots.has('dingdongji') && (<p>Big Dog</p>) }
// 这里检查是否有名为 'dingdongji' 的插槽，如果有则渲染 <p>Big Dog</p>

```

---

`Astro.self`可以用来递归渲染组件

```astro
---
const { depth = 0, maxDepth = 3 } = Astro.props;
---
<p>Depth: {depth}</p>
{depth < maxDepth && <Astro.self depth={depth + 1} maxDepth={maxDepth} />}
// 这里递归渲染组件本身，直到达到最大深度3
```

渲染出来将是这样

```
Depth: 0
Depth: 1
Depth: 2
Depth: 3
```

## 参考资料

- [Astro 官方文档](https://docs.astro.build/zh/)
